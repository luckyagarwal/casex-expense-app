/**
 * Notion Expense — low-friction PWA for adding expenses to Notion.
 *
 * Endpoints:
 *   GET  /                → HTML form (PWA)
 *   GET  /api/bootstrap   → categories, subcategories, accounts, recent-5 per field,
 *                           subcategory-by-category frequency map (from last 50 expenses)
 *   POST /api/expense     → create an expense row; inline-creates missing category /
 *                           subcategory / account by title if an id isn't provided
 *   GET  /healthz         → 200 OK
 *
 * Auth: all /api/* routes require header "X-Auth: <SHARED_SECRET>" (client stores
 * it in localStorage after first visit via ?k=... query parameter).
 *
 * Env bindings (wrangler secret put ...):
 *   NOTION_TOKEN     — your Notion integration token (secret_... / ntn_...)
 *   SHARED_SECRET    — any random string; gates /api/* access
 *
 * Env vars (wrangler.toml [vars]):
 *   EXPENSES_DB_ID, CATEGORIES_DB_ID, SUBCATEGORIES_DB_ID, ACCOUNTS_DB_ID
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// ----------------------------------------------------------------------------
// Notion helpers
// ----------------------------------------------------------------------------

async function notion(env, method, path, body) {
  const resp = await fetch(NOTION_API + path, {
    method,
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await resp.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!resp.ok) {
    const err = new Error(
      `Notion ${method} ${path} → ${resp.status}: ${json?.message || text}`,
    );
    err.status = resp.status;
    err.body = json;
    throw err;
  }
  return json;
}

async function queryAll(env, databaseId, body = {}, pageSize = 100) {
  // Paginate through a database query. Only pull as much as we need.
  const results = [];
  let startCursor = undefined;
  for (let i = 0; i < 5; i++) {
    // hard cap at ~500 rows
    const payload = { page_size: pageSize, ...body };
    if (startCursor) payload.start_cursor = startCursor;
    const data = await notion(
      env,
      "POST",
      `/databases/${databaseId}/query`,
      payload,
    );
    results.push(...(data.results || []));
    if (!data.has_more) break;
    startCursor = data.next_cursor;
  }
  return results;
}

function titleOf(page, titleProp) {
  const rt = page.properties?.[titleProp]?.title || [];
  return rt.map((t) => t.plain_text || "").join("").trim();
}

function relationIdsOf(page, propName) {
  const rel = page.properties?.[propName]?.relation || [];
  return rel.map((r) => r.id);
}

function numberOf(page, propName) {
  return page.properties?.[propName]?.number ?? null;
}

function dateStartOf(page, propName) {
  return page.properties?.[propName]?.date?.start ?? null;
}

async function createRowInDb(env, databaseId, titleProp, title) {
  const page = await notion(env, "POST", "/pages", {
    parent: { database_id: databaseId },
    properties: {
      [titleProp]: { title: [{ text: { content: title } }] },
    },
  });
  return page;
}

// ----------------------------------------------------------------------------
// Bootstrap: everything the form needs on load
// ----------------------------------------------------------------------------

async function handleBootstrap(env) {
  // Pull all lookup rows. Keep small by only requesting the properties we care
  // about implicitly — Notion returns full page objects either way, so we
  // just read what we need.
  const [categories, subcategories, accounts, recentExpenses] =
    await Promise.all([
      queryAll(env, env.CATEGORIES_DB_ID, {
        sorts: [{ property: "Category", direction: "ascending" }],
      }),
      queryAll(env, env.SUBCATEGORIES_DB_ID, {
        sorts: [{ property: "Subcategory", direction: "ascending" }],
      }),
      queryAll(env, env.ACCOUNTS_DB_ID, {
        sorts: [{ property: "Account", direction: "ascending" }],
      }),
      queryAll(
        env,
        env.EXPENSES_DB_ID,
        {
          sorts: [{ timestamp: "created_time", direction: "descending" }],
        },
        50,
      ),
    ]);

  const categoryList = categories.map((p) => ({
    id: p.id,
    name: titleOf(p, "Category"),
  }));
  const subcategoryList = subcategories.map((p) => ({
    id: p.id,
    name: titleOf(p, "Subcategory"),
  }));
  const accountList = accounts.map((p) => ({
    id: p.id,
    name: titleOf(p, "Account"),
  }));

  // Compute recents: most-recently-used unique ids, top 5 per field.
  const recentCats = [];
  const recentSubs = [];
  const recentAccts = [];
  const seenCat = new Set(),
    seenSub = new Set(),
    seenAcct = new Set();

  // subcatByCategory: { [categoryId]: { [subcategoryId]: count } }
  const subcatByCategory = {};

  // Trim to the most recent 50
  const recent = recentExpenses.slice(0, 50);
  for (const ex of recent) {
    const cats = relationIdsOf(ex, "Category");
    const subs = relationIdsOf(ex, "Subcategory");
    const accts = relationIdsOf(ex, "Account");

    for (const c of cats) {
      if (!seenCat.has(c) && recentCats.length < 5) {
        recentCats.push(c);
        seenCat.add(c);
      }
    }
    for (const s of subs) {
      if (!seenSub.has(s) && recentSubs.length < 5) {
        recentSubs.push(s);
        seenSub.add(s);
      }
    }
    for (const a of accts) {
      if (!seenAcct.has(a) && recentAccts.length < 5) {
        recentAccts.push(a);
        seenAcct.add(a);
      }
    }

    // cross-product: every (cat, sub) pair seen in this expense bumps count
    for (const c of cats) {
      if (!subcatByCategory[c]) subcatByCategory[c] = {};
      for (const s of subs) {
        subcatByCategory[c][s] = (subcatByCategory[c][s] || 0) + 1;
      }
    }
  }

  return {
    categories: categoryList,
    subcategories: subcategoryList,
    accounts: accountList,
    recent: {
      categories: recentCats,
      subcategories: recentSubs,
      accounts: recentAccts,
    },
    subcatByCategory,
  };
}

// ----------------------------------------------------------------------------
// Create expense (inline-creates missing lookup rows if names given w/o ids)
// ----------------------------------------------------------------------------

async function resolveOrCreate(env, databaseId, titleProp, id, name) {
  if (id) return id;
  if (!name || !name.trim()) return null;
  const page = await createRowInDb(env, databaseId, titleProp, name.trim());
  return page.id;
}

async function handleCreateExpense(env, body) {
  const {
    expense,
    amount,
    date,
    categoryId,
    categoryName,
    subcategoryId,
    subcategoryName,
    accountId,
    accountName,
  } = body || {};

  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return { error: "Amount required and must be a number", status: 400 };
  }

  // Resolve or create each relation
  const [catId, subId, acctId] = await Promise.all([
    resolveOrCreate(
      env,
      env.CATEGORIES_DB_ID,
      "Category",
      categoryId,
      categoryName,
    ),
    resolveOrCreate(
      env,
      env.SUBCATEGORIES_DB_ID,
      "Subcategory",
      subcategoryId,
      subcategoryName,
    ),
    resolveOrCreate(
      env,
      env.ACCOUNTS_DB_ID,
      "Account",
      accountId,
      accountName,
    ),
  ]);

  const properties = {
    Expense: { title: [{ text: { content: (expense || "").trim() } }] },
    Amount: { number: Number(amount) },
  };
  if (date) properties.Date = { date: { start: date } };
  if (catId) properties.Category = { relation: [{ id: catId }] };
  if (subId) properties.Subcategory = { relation: [{ id: subId }] };
  if (acctId) properties.Account = { relation: [{ id: acctId }] };

  const page = await notion(env, "POST", "/pages", {
    parent: { database_id: env.EXPENSES_DB_ID },
    properties,
  });

  return {
    ok: true,
    pageId: page.id,
    url: page.url,
    created: {
      categoryId: catId && !categoryId ? catId : null,
      subcategoryId: subId && !subcategoryId ? subId : null,
      accountId: acctId && !accountId ? acctId : null,
    },
  };
}

// ----------------------------------------------------------------------------
// Expense history: fetches expenses filtered by period (today / week / month)
// Resolves category, subcategory, account names server-side.
// ----------------------------------------------------------------------------

async function handleGetExpenses(env, url) {
  const period = url.searchParams.get("period") || "month";
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  let startDate = todayStr;
  if (period === "week") {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    startDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } else if (period === "month") {
    startDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  }

  // Fetch expenses + lookup tables in parallel
  const [expensesRaw, categories, subcategories, accounts] = await Promise.all([
    queryAll(
      env,
      env.EXPENSES_DB_ID,
      {
        filter: { property: "Date", date: { on_or_after: startDate } },
        sorts: [{ property: "Date", direction: "descending" }],
      },
      100,
    ),
    queryAll(env, env.CATEGORIES_DB_ID, {}),
    queryAll(env, env.SUBCATEGORIES_DB_ID, {}),
    queryAll(env, env.ACCOUNTS_DB_ID, {}),
  ]);

  const catById = Object.fromEntries(
    categories.map((p) => [p.id, titleOf(p, "Category")]),
  );
  const subById = Object.fromEntries(
    subcategories.map((p) => [p.id, titleOf(p, "Subcategory")]),
  );
  const accById = Object.fromEntries(
    accounts.map((p) => [p.id, titleOf(p, "Account")]),
  );

  const expenses = expensesRaw
    .map((p) => {
      const dateStart = dateStartOf(p, "Date") || "";
      const cats = relationIdsOf(p, "Category")
        .map((id) => catById[id])
        .filter(Boolean);
      const subs = relationIdsOf(p, "Subcategory")
        .map((id) => subById[id])
        .filter(Boolean);
      const accts = relationIdsOf(p, "Account")
        .map((id) => accById[id])
        .filter(Boolean);
      return {
        id: p.id,
        name: titleOf(p, "Expense") || "",
        amount: numberOf(p, "Amount") || 0,
        date: dateStart,
        category: cats[0] || "",
        subcategory: subs.join(", "),
        account: accts[0] || "",
      };
    })
    .filter((e) => e.date && e.date.split("T")[0] >= startDate);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return { expenses, total, period, startDate };
}

// ----------------------------------------------------------------------------
// Auth gate
// ----------------------------------------------------------------------------

function checkAuth(request, env) {
  // If no SHARED_SECRET is configured, allow all requests (open personal use).
  if (!env.SHARED_SECRET) return true;
  const h = request.headers.get("X-Auth");
  if (h && h === env.SHARED_SECRET) return true;
  const url = new URL(request.url);
  const k = url.searchParams.get("k");
  if (k && k === env.SHARED_SECRET) return true;
  return false;
}

// ----------------------------------------------------------------------------
// HTML (inline) — see /sessions/.../index.html.js for source
// ----------------------------------------------------------------------------

import { HTML } from "./index-html.js";

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") return new Response("ok");

    if (url.pathname === "/") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname.startsWith("/api/")) {
      if (!checkAuth(request, env)) return json({ error: "unauthorized" }, 401);

      try {
        if (url.pathname === "/api/bootstrap" && request.method === "GET") {
          const data = await handleBootstrap(env);
          return json(data);
        }
        if (url.pathname === "/api/expenses" && request.method === "GET") {
          const data = await handleGetExpenses(env, url);
          return json(data);
        }
        if (url.pathname === "/api/expense" && request.method === "POST") {
          const body = await request.json().catch(() => null);
          const result = await handleCreateExpense(env, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        return json({ error: "not found" }, 404);
      } catch (err) {
        return json(
          { error: err.message || "server error", details: err.body || null },
          err.status || 500,
        );
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
