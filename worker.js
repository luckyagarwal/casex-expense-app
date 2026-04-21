/**
 * Notion Expense PWA — Cloudflare Worker
 *
 * Endpoints:
 *   GET  /                          → HTML PWA shell (auth-gated)
 *   GET  /login                     → PIN login page
 *   POST /login                     → validate PIN, set session cookie
 *   GET  /logout                    → clear session cookie
 *   GET  /api/bootstrap[?refresh=1] → categories, subcategories, accounts, recents
 *   GET  /api/expenses?period=today|week|month[&refresh=1]
 *                                   → cached expense list; refresh=1 bypasses KV
 *   POST /api/expense               → create expense in Notion, invalidates KV
 *   DELETE /api/expense/:id         → archive page in Notion, invalidates KV
 *   GET  /healthz                   → 200 OK
 *
 * Env secrets (wrangler secret put ...):
 *   NOTION_TOKEN    — Notion integration token
 *   PIN             — login PIN (if unset, auth is skipped)
 *   SESSION_SECRET  — random string for signing cookies (generate any long random string)
 *
 * Env vars (wrangler.toml [vars]):
 *   EXPENSES_DB_ID, CATEGORIES_DB_ID, SUBCATEGORIES_DB_ID, ACCOUNTS_DB_ID
 *
 * KV binding (wrangler.toml [[kv_namespaces]]):
 *   EXPENSE_CACHE   — stores expense snapshots; gracefully absent = no caching
 */

const NOTION_API     = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// Cache TTLs in seconds
const TTL = { bootstrap: 1800, today: 300, week: 1800, month: 3600 };

// ----------------------------------------------------------------------------
// KV cache helpers
// ----------------------------------------------------------------------------

async function kvGet(env, key) {
  if (!env.EXPENSE_CACHE) return null;
  try {
    const raw = await env.EXPENSE_CACHE.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function kvSet(env, key, data, ttl) {
  if (!env.EXPENSE_CACHE) return;
  try {
    await env.EXPENSE_CACHE.put(key, JSON.stringify({ ...data, cachedAt: Date.now() }), {
      expirationTtl: ttl,
    });
  } catch { /* non-fatal */ }
}

async function kvDel(env, ...keys) {
  if (!env.EXPENSE_CACHE) return;
  await Promise.allSettled(keys.map((k) => env.EXPENSE_CACHE.delete(k)));
}

// Deterministic KV keys that auto-rotate when the period rolls over
function periodKey(period) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  if (period === "today") {
    return `expenses:today:${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }
  if (period === "week") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const jan4 = new Date(d.getFullYear(), 0, 4);
    const wk = 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
    return `expenses:week:${d.getFullYear()}-W${pad(wk)}`;
  }
  if (period === "month") {
    return `expenses:month:${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  }
  return `expenses:${period}`;
}

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
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = { raw: text }; }
  if (!resp.ok) {
    const err = new Error(`Notion ${method} ${path} → ${resp.status}: ${data?.message || text}`);
    err.status = resp.status;
    err.body   = data;
    throw err;
  }
  return data;
}

async function queryAll(env, databaseId, body = {}, pageSize = 100) {
  const results = [];
  let startCursor;
  for (let i = 0; i < 5; i++) {
    const payload = { page_size: pageSize, ...body };
    if (startCursor) payload.start_cursor = startCursor;
    const data = await notion(env, "POST", `/databases/${databaseId}/query`, payload);
    results.push(...(data.results || []));
    if (!data.has_more) break;
    startCursor = data.next_cursor;
  }
  return results;
}

function titleOf(page, prop) {
  return (page.properties?.[prop]?.title || []).map((t) => t.plain_text || "").join("").trim();
}
function relationIdsOf(page, prop) {
  return (page.properties?.[prop]?.relation || []).map((r) => r.id);
}
function numberOf(page, prop)    { return page.properties?.[prop]?.number  ?? null; }
function dateStartOf(page, prop) { return page.properties?.[prop]?.date?.start ?? null; }

async function createRowInDb(env, dbId, titleProp, title) {
  return notion(env, "POST", "/pages", {
    parent: { database_id: dbId },
    properties: { [titleProp]: { title: [{ text: { content: title } }] } },
  });
}

// ----------------------------------------------------------------------------
// Bootstrap — categories, subcategories, accounts + recency data
// ----------------------------------------------------------------------------

async function handleBootstrap(env, refresh = false) {
  const KEY = "bootstrap";
  if (!refresh) {
    const cached = await kvGet(env, KEY);
    if (cached) return { ...cached, cached: true };
  }

  const [categories, subcategories, accounts, recentExpenses] = await Promise.all([
    queryAll(env, env.CATEGORIES_DB_ID,    { sorts: [{ property: "Category",    direction: "ascending" }] }),
    queryAll(env, env.SUBCATEGORIES_DB_ID, { sorts: [{ property: "Subcategory", direction: "ascending" }] }),
    queryAll(env, env.ACCOUNTS_DB_ID,      { sorts: [{ property: "Account",     direction: "ascending" }] }),
    queryAll(env, env.EXPENSES_DB_ID,      { sorts: [{ timestamp: "created_time", direction: "descending" }] }, 50),
  ]);

  const categoryList    = categories.map((p)    => ({ id: p.id, name: titleOf(p, "Category")    }));
  const subcategoryList = subcategories.map((p) => ({ id: p.id, name: titleOf(p, "Subcategory") }));
  const accountList     = accounts.map((p)      => ({ id: p.id, name: titleOf(p, "Account")     }));

  const recentCats = [], recentSubs = [], recentAccts = [];
  const seenCat = new Set(), seenSub = new Set(), seenAcct = new Set();
  const subcatByCategory = {};

  for (const ex of recentExpenses.slice(0, 50)) {
    const cats = relationIdsOf(ex, "Category");
    const subs = relationIdsOf(ex, "Subcategory");
    const accts = relationIdsOf(ex, "Account");
    for (const c of cats) { if (!seenCat.has(c)  && recentCats.length  < 5) { recentCats.push(c);  seenCat.add(c);  } }
    for (const s of subs) { if (!seenSub.has(s)  && recentSubs.length  < 5) { recentSubs.push(s);  seenSub.add(s);  } }
    for (const a of accts){ if (!seenAcct.has(a) && recentAccts.length < 5) { recentAccts.push(a); seenAcct.add(a); } }
    for (const c of cats) {
      if (!subcatByCategory[c]) subcatByCategory[c] = {};
      for (const s of subs) subcatByCategory[c][s] = (subcatByCategory[c][s] || 0) + 1;
    }
  }

  const result = {
    categories: categoryList, subcategories: subcategoryList, accounts: accountList,
    recent: { categories: recentCats, subcategories: recentSubs, accounts: recentAccts },
    subcatByCategory,
  };
  await kvSet(env, KEY, result, TTL.bootstrap);
  return { ...result, cached: false };
}

// ----------------------------------------------------------------------------
// Expense history — fetches & caches by period
// ----------------------------------------------------------------------------

async function handleGetExpenses(env, url) {
  const period  = url.searchParams.get("period")  || "month";
  const refresh = url.searchParams.get("refresh") === "1";
  const KEY     = periodKey(period);

  if (!refresh) {
    const cached = await kvGet(env, KEY);
    if (cached) return { ...cached, cached: true };
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  let startDate = todayStr;
  if (period === "week") {
    const d = new Date(now);
    const day = d.getDay();
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    startDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } else if (period === "month") {
    startDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  }

  // Try with date filter; fall back to unfiltered if the Date property doesn't exist yet
  let expensesRaw;
  try {
    expensesRaw = await queryAll(env, env.EXPENSES_DB_ID, {
      filter: { property: "Date", date: { on_or_after: startDate } },
      sorts:  [{ property: "Date", direction: "descending" }],
    }, 100);
  } catch {
    expensesRaw = await queryAll(env, env.EXPENSES_DB_ID, {
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    }, 100);
  }

  const [categories, subcategories, accounts] = await Promise.all([
    queryAll(env, env.CATEGORIES_DB_ID,    {}),
    queryAll(env, env.SUBCATEGORIES_DB_ID, {}),
    queryAll(env, env.ACCOUNTS_DB_ID,      {}),
  ]);

  const catById = Object.fromEntries(categories.map((p)    => [p.id, titleOf(p, "Category")]));
  const subById = Object.fromEntries(subcategories.map((p) => [p.id, titleOf(p, "Subcategory")]));
  const accById = Object.fromEntries(accounts.map((p)      => [p.id, titleOf(p, "Account")]));

  const expenses = expensesRaw
    .map((p) => {
      const date = dateStartOf(p, "Date") || "";
      return {
        id:          p.id,
        name:        titleOf(p, "Expense") || "",
        amount:      numberOf(p, "Amount") || 0,
        date,
        category:    relationIdsOf(p, "Category").map((id) => catById[id]).filter(Boolean)[0] || "",
        subcategory: relationIdsOf(p, "Subcategory").map((id) => subById[id]).filter(Boolean).join(", "),
        account:     relationIdsOf(p, "Account").map((id) => accById[id]).filter(Boolean)[0] || "",
      };
    })
    .filter((e) => e.date && e.date.split("T")[0] >= startDate);

  const total  = expenses.reduce((s, e) => s + e.amount, 0);
  const result = { expenses, total, period, startDate };
  await kvSet(env, KEY, result, TTL[period] || 1800);
  return { ...result, cached: false };
}

// ----------------------------------------------------------------------------
// Create expense — then bust all period caches
// ----------------------------------------------------------------------------

async function resolveOrCreate(env, dbId, titleProp, id, name) {
  if (id) return id;
  if (!name?.trim()) return null;
  const page = await createRowInDb(env, dbId, titleProp, name.trim());
  return page.id;
}

async function handleCreateExpense(env, body) {
  const { expense, amount, date, categoryId, categoryName,
          subcategoryId, subcategoryName, accountId, accountName } = body || {};

  if (amount === undefined || amount === null || isNaN(Number(amount)))
    return { error: "Amount required and must be a number", status: 400 };

  const [catId, subId, acctId] = await Promise.all([
    resolveOrCreate(env, env.CATEGORIES_DB_ID,    "Category",    categoryId,    categoryName),
    resolveOrCreate(env, env.SUBCATEGORIES_DB_ID, "Subcategory", subcategoryId, subcategoryName),
    resolveOrCreate(env, env.ACCOUNTS_DB_ID,      "Account",     accountId,     accountName),
  ]);

  const properties = {
    Expense: { title: [{ text: { content: (expense || "").trim() } }] },
    Amount:  { number: Number(amount) },
  };
  if (date)   properties.Date        = { date:     { start: date } };
  if (catId)  properties.Category    = { relation: [{ id: catId  }] };
  if (subId)  properties.Subcategory = { relation: [{ id: subId  }] };
  if (acctId) properties.Account     = { relation: [{ id: acctId }] };

  const page = await notion(env, "POST", "/pages", {
    parent: { database_id: env.EXPENSES_DB_ID },
    properties,
  });

  // Bust all cached periods so the new expense shows up immediately
  await kvDel(env,
    periodKey("today"), periodKey("week"), periodKey("month"),
    "bootstrap",
  );

  return {
    ok: true, pageId: page.id, url: page.url,
    created: {
      categoryId:    catId  && !categoryId    ? catId  : null,
      subcategoryId: subId  && !subcategoryId ? subId  : null,
      accountId:     acctId && !accountId     ? acctId : null,
    },
  };
}

// ----------------------------------------------------------------------------
// Delete expense — archive in Notion, bust KV
// ----------------------------------------------------------------------------

async function handleDeleteExpense(env, pageId) {
  if (!pageId) return { error: "Page ID required", status: 400 };

  // Notion "delete" = archive the page
  await notion(env, "PATCH", `/pages/${pageId}`, { archived: true });

  // Invalidate all period caches
  await kvDel(env,
    periodKey("today"), periodKey("week"), periodKey("month"),
    "bootstrap",
  );

  return { ok: true, pageId };
}

// ----------------------------------------------------------------------------
// Cloudflare Access JWT auth
// CF_ACCESS_TEAM = your Zero Trust team name (e.g. "casex")
// CF_ACCESS_AUD  = Application ID from Access app details page
// ----------------------------------------------------------------------------

function getCookie(request, name) {
  const hdr = request.headers.get("Cookie") || "";
  const pair = hdr.split(";").map(s => s.trim()).find(s => s.startsWith(name + "="));
  return pair ? pair.slice(name.length + 1) : null;
}

function b64url(str) {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + (4 - str.length % 4) % 4, "="));
}

async function verifyAccessJWT(token, teamName, aud) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const header  = JSON.parse(b64url(parts[0]));
    const payload = JSON.parse(b64url(parts[1]));

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;

    // Check audience
    const audOk = Array.isArray(payload.aud) ? payload.aud.includes(aud) : payload.aud === aud;
    if (!audOk) return false;

    // Fetch public keys from Cloudflare (cached at edge)
    const certsUrl = `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`;
    const certs = await fetch(certsUrl, { cf: { cacheTtl: 3600 } }).then(r => r.json());
    const jwk = (certs.keys || []).find(k => k.kid === header.kid);
    if (!jwk) return false;

    // Verify RS256 signature
    const key = await crypto.subtle.importKey(
      "jwk", jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["verify"]
    );
    const sig  = Uint8Array.from(b64url(parts[2]), c => c.charCodeAt(0));
    const data = new TextEncoder().encode(parts[0] + "." + parts[1]);
    return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, sig, data);
  } catch { return false; }
}

async function isAuthorized(request, env) {
  if (!env.CF_ACCESS_TEAM || !env.CF_ACCESS_AUD) return true; // not configured = open
  const token = request.headers.get("Cf-Access-Jwt-Assertion")
             || getCookie(request, "CF_Authorization");
  if (!token) return false;
  return verifyAccessJWT(token, env.CF_ACCESS_TEAM, env.CF_ACCESS_AUD);
}

function cfLoginUrl(env, returnUrl) {
  return `https://${env.CF_ACCESS_TEAM}.cloudflareaccess.com/cdn-cgi/access/login/${
    new URL(returnUrl).hostname
  }?redirect_url=${encodeURIComponent(returnUrl)}`;
}

// ----------------------------------------------------------------------------
// HTML shell
// ----------------------------------------------------------------------------

import { HTML } from "./index-html.js";

// ----------------------------------------------------------------------------
// Router
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

    // ── Cloudflare Access auth gate ──
    if (!(await isAuthorized(request, env))) {
      if (url.pathname.startsWith("/api/")) return json({ error: "unauthorized" }, 401);
      // Redirect to Cloudflare Access login — it handles OTP/Google etc.
      return new Response(null, {
        status: 302,
        headers: { Location: cfLoginUrl(env, request.url) },
      });
    }

    // ── App shell ──
    if (url.pathname === "/") {
      return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ── API routes ──
    if (url.pathname.startsWith("/api/")) {
      try {
        if (url.pathname === "/api/bootstrap" && request.method === "GET") {
          const refresh = url.searchParams.get("refresh") === "1";
          return json(await handleBootstrap(env, refresh));
        }
        if (url.pathname === "/api/expenses" && request.method === "GET") {
          return json(await handleGetExpenses(env, url));
        }
        if (url.pathname === "/api/expense" && request.method === "POST") {
          const body = await request.json().catch(() => null);
          const result = await handleCreateExpense(env, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        if (url.pathname.startsWith("/api/expense/") && request.method === "DELETE") {
          const pageId = url.pathname.slice("/api/expense/".length);
          const result = await handleDeleteExpense(env, pageId);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        return json({ error: "not found" }, 404);
      } catch (err) {
        return json({ error: err.message || "server error", details: err.body || null }, err.status || 500);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
