/**
 * Expense Tracker — Cloudflare Worker
 *
 * All data stored in Cloudflare D1 (SQLite). No external API dependencies.
 *
 * Endpoints:
 *   GET  /                              → Mobile PWA shell
 *   GET  /desktop                       → Desktop app shell
 *   GET  /manifest.json                 → PWA manifest
 *   GET  /sw.js                         → Service worker
 *   GET  /healthz                       → 200 OK
 *
 *   GET  /api/d1/bootstrap              → categories, subcategories, accounts, recents
 *   GET  /api/d1/expenses               → transactions for period or date range
 *   GET  /api/d1/summary                → income/expense totals for period
 *   POST /api/d1/expense                → create transaction (expense | income | transfer)
 *   PUT  /api/d1/expense/:id            → update transaction
 *   DELETE /api/d1/expense/:id          → delete transaction
 *   GET  /api/d1/export                 → CSV export
 *
 * Required bindings (wrangler.toml):
 *   DB  — D1 database
 *
 * Optional secrets (wrangler secret put ...):
 *   CF_ACCESS_TEAM, CF_ACCESS_AUD — Cloudflare Access JWT validation
 */

// ----------------------------------------------------------------------------
// Date / period helpers
// ----------------------------------------------------------------------------

function partsInTimeZone(timeZone, date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || "UTC",
    year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day), weekday: parts.weekday };
}

function ymd({ year, month, day }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function shiftDate(dateStr, deltaDays) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return ymd({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
}

function isoWeekKey(dateStr) {
  const thursday = shiftDate(dateStr, 3 - ((new Date(`${dateStr}T00:00:00Z`).getUTCDay() + 6) % 7));
  const [year] = thursday.split("-").map(Number);
  const jan4     = `${year}-01-04`;
  const jan4Date = new Date(`${jan4}T00:00:00Z`);
  const thurDate = new Date(`${thursday}T00:00:00Z`);
  const jan4Wday = (jan4Date.getUTCDay() + 6) % 7;
  const week     = 1 + Math.round(((thurDate - jan4Date) / 86400000 - 3 + jan4Wday) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function rangeForPeriod(period, timeZone) {
  const localNow = partsInTimeZone(timeZone);
  const today    = ymd(localNow);
  if (period === "today") return { startDate: today, endDate: today };
  if (period === "week") {
    const dayMap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    const offset = dayMap[localNow.weekday] ?? 0;
    const start  = shiftDate(today, -offset);
    return { startDate: start, endDate: shiftDate(start, 6) };
  }
  if (period === "month") {
    const start   = `${localNow.year}-${String(localNow.month).padStart(2, "0")}-01`;
    const nextMon = localNow.month === 12
      ? `${localNow.year + 1}-01-01`
      : `${localNow.year}-${String(localNow.month + 1).padStart(2, "0")}-01`;
    return { startDate: start, endDate: shiftDate(nextMon, -1) };
  }
  return { startDate: today, endDate: today };
}

// ----------------------------------------------------------------------------
// D1 helpers
// ----------------------------------------------------------------------------

async function d1Run(db, sql, params = []) {
  return db.prepare(sql).bind(...params).run();
}

async function d1All(db, sql, params = []) {
  const { results } = await db.prepare(sql).bind(...params).all();
  return results;
}

async function d1First(db, sql, params = []) {
  return db.prepare(sql).bind(...params).first();
}

// ----------------------------------------------------------------------------
// Bootstrap — categories, subcategories, accounts + recency hints
// ----------------------------------------------------------------------------

async function handleD1Bootstrap(env) {
  if (!env.DB) return { error: "D1 database not configured", status: 500 };

  const [categories, subcategories, accounts, recentExpenses] = await Promise.all([
    d1All(env.DB, "SELECT id,name,emoji,icon_url FROM categories ORDER BY name"),
    d1All(env.DB, "SELECT id,name,category_id,icon_url FROM subcategories ORDER BY name"),
    d1All(env.DB, "SELECT id,name,emoji,icon_url FROM accounts ORDER BY name"),
    d1All(env.DB,
      "SELECT e.category_id,e.subcategory_id,e.account_id FROM expenses e ORDER BY e.date DESC LIMIT 20"),
  ]);

  const mkIcon = (emoji, iconUrl) => {
    if (iconUrl) {
      if (iconUrl.startsWith("lucide:")) return { type: "lucide", value: iconUrl.slice(7) };
      if (iconUrl.startsWith("bank:"))   return { type: "bank",   value: iconUrl.slice(5) };
      if (iconUrl.startsWith("brand:"))  return { type: "brand",  value: iconUrl.slice(6) };
      if (iconUrl.startsWith("/"))       return { type: "image",  value: iconUrl };
    }
    return emoji ? { type: "emoji", value: emoji } : null;
  };
  const catSet  = new Set(categories.map(c => c.id));
  const subSet  = new Set(subcategories.map(s => s.id));
  const acctSet = new Set(accounts.map(a => a.id));

  const recentCats = [], recentSubs = [], recentAccts = [];
  const seenCat = new Set(), seenSub = new Set(), seenAcct = new Set();
  const subcatByCategory = {};
  for (const ex of recentExpenses) {
    if (ex.category_id && catSet.has(ex.category_id) && !seenCat.has(ex.category_id) && recentCats.length < 5) {
      recentCats.push(ex.category_id); seenCat.add(ex.category_id);
    }
    if (ex.subcategory_id && subSet.has(ex.subcategory_id) && !seenSub.has(ex.subcategory_id) && recentSubs.length < 5) {
      recentSubs.push(ex.subcategory_id); seenSub.add(ex.subcategory_id);
    }
    if (ex.account_id && acctSet.has(ex.account_id) && !seenAcct.has(ex.account_id) && recentAccts.length < 5) {
      recentAccts.push(ex.account_id); seenAcct.add(ex.account_id);
    }
    if (ex.category_id && ex.subcategory_id) {
      if (!subcatByCategory[ex.category_id]) subcatByCategory[ex.category_id] = {};
      subcatByCategory[ex.category_id][ex.subcategory_id] = (subcatByCategory[ex.category_id][ex.subcategory_id] || 0) + 1;
    }
  }

  return {
    categories:    categories.map(c => ({ id: c.id, name: c.name, icon: mkIcon(c.emoji, c.icon_url) })),
    subcategories: subcategories.map(s => ({ id: s.id, name: s.name, categoryId: s.category_id, icon: mkIcon(null, s.icon_url) })),
    accounts:      accounts.map(a => ({ id: a.id, name: a.name, icon: mkIcon(a.emoji, a.icon_url) })),
    recent:        { categories: recentCats, subcategories: recentSubs, accounts: recentAccts },
    subcatByCategory,
  };
}

// ----------------------------------------------------------------------------
// Entity edit — categories, subcategories, accounts (rename + re-icon)
// ----------------------------------------------------------------------------

async function handleD1UpdateEntity(env, table, id, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!id) return { error: "ID required", status: 400 };
  if (!["categories", "subcategories", "accounts"].includes(table))
    return { error: "Invalid table", status: 400 };

  const sets = [], params = [];
  if (typeof body?.name === "string") {
    const name = body.name.trim();
    if (!name) return { error: "Name cannot be empty", status: 400 };
    sets.push("name=?"); params.push(name);
  }
  if (body && "emoji" in body) {
    sets.push("emoji=?"); params.push(typeof body.emoji === "string" ? body.emoji : "");
  }
  if (body && "iconUrl" in body) {
    sets.push("icon_url=?"); params.push(body.iconUrl || null);
  }
  if (!sets.length) return { error: "Nothing to update", status: 400 };

  params.push(id);
  const sql = `UPDATE ${table} SET ${sets.join(",")} WHERE id=?`;
  const r = await env.DB.prepare(sql).bind(...params).run();
  if (!r.meta?.changes) return { error: "Not found", status: 404 };
  return { ok: true, id };
}

// ----------------------------------------------------------------------------
// Read transactions
// ----------------------------------------------------------------------------

async function handleD1Expenses(env, url) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };

  const period     = url.searchParams.get("period") || "month";
  const type       = url.searchParams.get("type") || "";
  const catFilter  = url.searchParams.get("category") || "";
  const subFilter  = url.searchParams.get("subcategory") || "";
  const acctFilter = url.searchParams.get("account") || "";
  const from       = url.searchParams.get("from") || "";
  const to         = url.searchParams.get("to") || "";
  const q          = url.searchParams.get("q") || "";
  const timeZone   = url.searchParams.get("timeZone") || "";
  const sortBy     = url.searchParams.get("sortBy") || "date";
  const sortDir    = url.searchParams.get("sortDir") || "desc";
  const ord        = sortDir === "asc" ? "ASC" : "DESC";

  const filteredQuery = Boolean(from || to || catFilter || subFilter || acctFilter || q);
  const range = filteredQuery
    ? { startDate: from || "0000-01-01", endDate: to || "9999-12-31" }
    : rangeForPeriod(period, timeZone);
  const { startDate, endDate } = range;

  const mkIcon = (emoji, iconUrl) => {
    if (iconUrl) {
      if (iconUrl.startsWith("lucide:")) return { type: "lucide", value: iconUrl.slice(7) };
      if (iconUrl.startsWith("bank:"))   return { type: "bank",   value: iconUrl.slice(5) };
      if (iconUrl.startsWith("brand:"))  return { type: "brand",  value: iconUrl.slice(6) };
      if (iconUrl.startsWith("/"))       return { type: "image",  value: iconUrl };
    }
    return emoji ? { type: "emoji", value: emoji } : null;
  };
  let expenses = [], incomeRows = [];

  if (!type || type === "expense") {
    let sql = `SELECT e.*,c.name as cat_name,c.emoji as cat_emoji,c.icon_url as cat_icon_url,
      s.name as sub_name,s.icon_url as sub_icon_url,
      a.name as acct_name,a.emoji as acct_emoji,a.icon_url as acct_icon_url
      FROM expenses e
      LEFT JOIN categories c ON e.category_id=c.id
      LEFT JOIN subcategories s ON e.subcategory_id=s.id
      LEFT JOIN accounts a ON e.account_id=a.id
      WHERE substr(e.date,1,10)>=? AND substr(e.date,1,10)<=?`;
    const p = [startDate, endDate];
    if (catFilter)  { sql += " AND e.category_id=?";    p.push(catFilter); }
    if (subFilter)  { sql += " AND e.subcategory_id=?"; p.push(subFilter); }
    if (acctFilter) { sql += " AND e.account_id=?";     p.push(acctFilter); }
    if (q) {
      sql += " AND (LOWER(e.note) LIKE ? OR LOWER(c.name) LIKE ? OR LOWER(a.name) LIKE ?)";
      const lq = `%${q.toLowerCase()}%`; p.push(lq, lq, lq);
    }
    sql += sortBy === "amount"
      ? ` ORDER BY e.amount ${ord}, e.date DESC`
      : ` ORDER BY e.date ${ord}`;
    expenses = await d1All(env.DB, sql, p);
  }

  if (!type || type === "income") {
    let sql = `SELECT i.*,c.name as cat_name,c.emoji as cat_emoji,c.icon_url as cat_icon_url,
      a.name as acct_name,a.emoji as acct_emoji,a.icon_url as acct_icon_url
      FROM income i
      LEFT JOIN categories c ON i.category_id=c.id
      LEFT JOIN accounts a ON i.account_id=a.id
      WHERE substr(i.date,1,10)>=? AND substr(i.date,1,10)<=?`;
    const p = [startDate, endDate];
    if (acctFilter) { sql += " AND i.account_id=?"; p.push(acctFilter); }
    if (q) {
      sql += " AND (LOWER(i.note) LIKE ? OR LOWER(i.source) LIKE ? OR LOWER(c.name) LIKE ? OR LOWER(a.name) LIKE ?)";
      const lq = `%${q.toLowerCase()}%`; p.push(lq, lq, lq, lq);
    }
    sql += sortBy === "amount"
      ? ` ORDER BY i.amount ${ord}, i.date DESC`
      : ` ORDER BY i.date ${ord}`;
    incomeRows = await d1All(env.DB, sql, p);
  }

  const mapExp = (r) => ({
    id: r.id, name: r.note || "", amount: r.amount, date: r.date,
    categoryId: r.category_id || "", category: r.cat_name || "",
    categoryIcon: mkIcon(r.cat_emoji, r.cat_icon_url),
    subcategoryId: r.subcategory_id || "", subcategory: r.sub_name || "",
    subcategoryIcon: mkIcon(null, r.sub_icon_url), subcategoryIcons: [],
    accountId: r.account_id || "", account: r.acct_name || "",
    accountIcon: mkIcon(r.acct_emoji, r.acct_icon_url), txnType: "expense",
  });

  const mapInc = (r) => ({
    id: r.id, name: r.note || r.source || "", amount: r.amount, date: r.date,
    categoryId: r.category_id || "", category: r.cat_name || "",
    categoryIcon: mkIcon(r.cat_emoji, r.cat_icon_url),
    subcategoryId: "", subcategory: "",
    subcategoryIcon: null, subcategoryIcons: [],
    accountId: r.account_id || "", account: r.acct_name || "",
    accountIcon: mkIcon(r.acct_emoji, r.acct_icon_url), txnType: "income",
  });

  let all = [...expenses.map(mapExp), ...incomeRows.map(mapInc)];
  if (sortBy === "amount") {
    all.sort((a, b) => sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount);
  } else {
    all.sort((a, b) => sortDir === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }

  return {
    expenses: all,
    total: all.reduce((s, e) => s + e.amount, 0),
    period: filteredQuery ? "range" : period,
    startDate, endDate, cached: false,
  };
}

// ----------------------------------------------------------------------------
// Summary totals
// ----------------------------------------------------------------------------

async function handleD1Summary(env, url) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };

  const period   = url.searchParams.get("period") || "month";
  const timeZone = url.searchParams.get("timeZone") || "";
  const { startDate, endDate } = rangeForPeriod(period, timeZone);

  const [expSum, incSum] = await Promise.all([
    d1First(env.DB, "SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE substr(date,1,10)>=? AND substr(date,1,10)<=?", [startDate, endDate]),
    d1First(env.DB, "SELECT COALESCE(SUM(amount),0) as total FROM income   WHERE substr(date,1,10)>=? AND substr(date,1,10)<=?", [startDate, endDate]),
  ]);

  const totalExpenses = expSum?.total || 0;
  const totalIncome   = incSum?.total || 0;
  return { balance: totalIncome - totalExpenses, totalIncome, totalExpenses, startDate, endDate };
}

// ----------------------------------------------------------------------------
// Write — create / update / delete transactions
// ----------------------------------------------------------------------------

async function handleD1CreateTransaction(env, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  const { amount, date, categoryId, subcategoryId, accountId, txnType,
          fromAccountId, toAccountId } = body || {};
  const note = body?.note || body?.expense || "";
  if (amount === undefined || isNaN(Number(amount))) return { error: "Amount required", status: 400 };

  const id = crypto.randomUUID();
  const d  = date || new Date().toISOString().split("T")[0];

  if (txnType === "income") {
    await d1Run(env.DB,
      "INSERT INTO income (id,date,amount,note,source,category_id,account_id) VALUES (?,?,?,?,?,?,?)",
      [id, d, Number(amount), note, note, categoryId || null, accountId || null]);
  } else if (txnType === "transfer") {
    if (!fromAccountId || !toAccountId) return { error: "From and To accounts required", status: 400 };
    await d1Run(env.DB,
      "INSERT INTO transfers (id,date,amount,note,from_account_id,to_account_id) VALUES (?,?,?,?,?,?)",
      [id, d, Number(amount), note, fromAccountId, toAccountId]);
  } else {
    await d1Run(env.DB,
      "INSERT INTO expenses (id,date,amount,note,category_id,subcategory_id,account_id) VALUES (?,?,?,?,?,?,?)",
      [id, d, Number(amount), note, categoryId || null, subcategoryId || null, accountId || null]);
  }
  return { ok: true, id };
}

async function handleD1UpdateTransaction(env, id, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!id) return { error: "ID required", status: 400 };
  const { amount, date, categoryId, subcategoryId, accountId, txnType } = body || {};
  const note = body?.note || body?.expense || "";
  if (amount === undefined || isNaN(Number(amount))) return { error: "Amount required", status: 400 };

  if (txnType === "income") {
    await d1Run(env.DB,
      "UPDATE income SET date=?,amount=?,note=?,source=?,category_id=?,account_id=? WHERE id=?",
      [date, Number(amount), note, note, categoryId || null, accountId || null, id]);
  } else {
    await d1Run(env.DB,
      "UPDATE expenses SET date=?,amount=?,note=?,category_id=?,subcategory_id=?,account_id=? WHERE id=?",
      [date, Number(amount), note, categoryId || null, subcategoryId || null, accountId || null, id]);
  }
  return { ok: true, id };
}

async function handleD1DeleteTransaction(env, id, txnType) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!id) return { error: "ID required", status: 400 };

  if (txnType === "income") {
    await d1Run(env.DB, "DELETE FROM income WHERE id=?", [id]);
  } else if (txnType === "transfer") {
    await d1Run(env.DB, "DELETE FROM transfers WHERE id=?", [id]);
  } else if (txnType === "expense") {
    await d1Run(env.DB, "DELETE FROM expenses WHERE id=?", [id]);
  } else {
    // Auto-detect table
    const r1 = await env.DB.prepare("DELETE FROM expenses WHERE id=?").bind(id).run();
    if (!r1.meta?.changes) {
      const r2 = await env.DB.prepare("DELETE FROM income WHERE id=?").bind(id).run();
      if (!r2.meta?.changes) {
        await d1Run(env.DB, "DELETE FROM transfers WHERE id=?", [id]);
      }
    }
  }
  return { ok: true, id };
}

// ----------------------------------------------------------------------------
// CSV export
// ----------------------------------------------------------------------------

async function handleD1Export(env, url) {
  if (!env.DB) return new Response(JSON.stringify({ error: "D1 not configured" }), { status: 500 });

  const type     = url.searchParams.get("type") || "expense";
  const period   = url.searchParams.get("period") || "month";
  const from     = url.searchParams.get("from") || "";
  const to       = url.searchParams.get("to") || "";
  const timeZone = url.searchParams.get("timeZone") || "";
  const range    = (from || to)
    ? { startDate: from || "0000-01-01", endDate: to || "9999-12-31" }
    : rangeForPeriod(period, timeZone);
  const { startDate, endDate } = range;

  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  let csv;

  if (type === "income") {
    const rows = await d1All(env.DB,
      `SELECT i.date,i.note,i.source,i.amount,a.name as account
       FROM income i LEFT JOIN accounts a ON i.account_id=a.id
       WHERE substr(i.date,1,10)>=? AND substr(i.date,1,10)<=? ORDER BY i.date DESC`,
      [startDate, endDate]);
    csv = "Date,Source,Amount,Account\n" +
      rows.map(r => [r.date, r.note || r.source, r.amount, r.account].map(esc).join(",")).join("\n");
  } else {
    const rows = await d1All(env.DB,
      `SELECT e.date,e.note,e.amount,c.name as category,s.name as subcategory,a.name as account
       FROM expenses e
       LEFT JOIN categories c ON e.category_id=c.id
       LEFT JOIN subcategories s ON e.subcategory_id=s.id
       LEFT JOIN accounts a ON e.account_id=a.id
       WHERE substr(e.date,1,10)>=? AND substr(e.date,1,10)<=? ORDER BY e.date DESC`,
      [startDate, endDate]);
    csv = "Date,Note,Amount,Category,Subcategory,Account\n" +
      rows.map(r => [r.date, r.note, r.amount, r.category, r.subcategory, r.account].map(esc).join(",")).join("\n");
  }

  const filename = `${type === "income" ? "income" : "expenses"}-${period}-${startDate}.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

// ----------------------------------------------------------------------------
// HTML shells + PWA assets
// ----------------------------------------------------------------------------

import { HTML }         from "./index-html.js";
import { DESKTOP_HTML } from "./desktop-html.js";

const MANIFEST_JSON = JSON.stringify({
  name: "Expense Tracker",
  short_name: "Expenses",
  start_url: "/",
  display: "standalone",
  background_color: "#191919",
  theme_color: "#121212",
  icons: [{
    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiB2aWV3Qm94PSIwIDAgMTkyIDE5MiI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9IiMxOTE5MTkiIHJ4PSI0OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjE1ZW0iIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iOTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPvCfkLg8L3RleHQ+PC9zdmc+",
    sizes: "192x192",
    type: "image/svg+xml",
    purpose: "any maskable"
  }]
});

const SW_JS = `
const CACHE_NAME = "ne-pwa-v19";
const OFFLINE_URLS = ["/", "/desktop"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        const ct = networkResponse.headers.get("Content-Type") || "";
        if (networkResponse.ok && ct.includes("application/json")) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: "Offline", cached: true, offline: true }), {
          status: 200, headers: { "Content-Type": "application/json" }
        });
      })
    );
    return;
  }

  if (url.pathname === "/" || url.pathname === "/desktop") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          const ct = networkResponse.headers.get("Content-Type") || "";
          if (networkResponse.ok && ct.includes("text/html"))
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          return networkResponse;
        }).catch(() => null);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
`;

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Static assets ──────────────────────────────────────────────────────
    if (url.pathname === "/healthz")       return new Response("ok");
    if (url.pathname === "/manifest.json") return new Response(MANIFEST_JSON, { headers: { "Content-Type": "application/manifest+json; charset=utf-8" } });
    if (url.pathname === "/sw.js")         return new Response(SW_JS, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Service-Worker-Allowed": "/" } });

    // ── App shells ──────────────────────────────────────────────────────────
    if (url.pathname === "/")                                    return new Response(HTML,         { headers: { "Content-Type": "text/html; charset=utf-8" } });
    if (url.pathname === "/desktop" || url.pathname === "/desktop/") return new Response(DESKTOP_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });

    // ── API ─────────────────────────────────────────────────────────────────
    if (url.pathname.startsWith("/api/")) {
      try {
        // Bootstrap
        if (url.pathname === "/api/d1/bootstrap" && request.method === "GET") {
          const result = await handleD1Bootstrap(env);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }

        // Read transactions
        if (url.pathname === "/api/d1/expenses" && request.method === "GET") {
          const result = await handleD1Expenses(env, url);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }

        // Summary totals
        if (url.pathname === "/api/d1/summary" && request.method === "GET") {
          const result = await handleD1Summary(env, url);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }

        // Create transaction
        if (url.pathname === "/api/d1/expense" && request.method === "POST") {
          const body = await request.json().catch(() => null);
          const result = await handleD1CreateTransaction(env, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }

        // Update transaction
        if (url.pathname.startsWith("/api/d1/expense/") && request.method === "PUT") {
          const id = url.pathname.slice("/api/d1/expense/".length);
          const body = await request.json().catch(() => null);
          const result = await handleD1UpdateTransaction(env, id, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }

        // Delete transaction
        if (url.pathname.startsWith("/api/d1/expense/") && request.method === "DELETE") {
          const id = url.pathname.slice("/api/d1/expense/".length);
          const txnType = url.searchParams.get("type") || "";
          const result = await handleD1DeleteTransaction(env, id, txnType);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }

        // CSV export
        if (url.pathname === "/api/d1/export" && request.method === "GET") {
          return handleD1Export(env, url);
        }

        // Entity rename + re-icon
        const entityMatch = url.pathname.match(/^\/api\/d1\/(categories|subcategories|accounts)\/([^/]+)$/);
        if (entityMatch && request.method === "PUT") {
          const [, table, id] = entityMatch;
          const body = await request.json().catch(() => null);
          const result = await handleD1UpdateEntity(env, table, id, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }

        return json({ error: "not found" }, 404);
      } catch (err) {
        return json({ error: err.message || "server error" }, err.status || 500);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
