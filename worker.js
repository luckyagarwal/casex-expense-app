/**
 * Notion Expense PWA — Cloudflare Worker
 *
 * Endpoints:
 *   GET  /                          → HTML PWA shell (auth-gated)
 *   GET  /login                     → PIN login page
 *   POST /login                     → validate PIN, set session cookie
 *   GET  /logout                    → clear session cookie
 *   GET  /api/bootstrap[?refresh=1] → categories, subcategories, accounts, recents
 *   GET  /api/expenses?period=today|week|month[&refresh=1][&timeZone=...]
 *   GET  /api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD[&categoryId=...][&accountId=...][&timeZone=...]
 *                                   → expense list for period or custom range
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

function partsInTimeZone(timeZone, date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: parts.weekday,
  };
}

function ymd({ year, month, day }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function shiftDate(dateStr, deltaDays) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return ymd({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  });
}

function isoWeekKey(dateStr) {
  const thursday = shiftDate(dateStr, 3 - ((new Date(`${dateStr}T00:00:00Z`).getUTCDay() + 6) % 7));
  const [year] = thursday.split("-").map(Number);
  const jan4 = `${year}-01-04`;
  const jan4Date = new Date(`${jan4}T00:00:00Z`);
  const thursdayDate = new Date(`${thursday}T00:00:00Z`);
  const jan4Weekday = (jan4Date.getUTCDay() + 6) % 7;
  const week = 1 + Math.round(((thursdayDate - jan4Date) / 86400000 - 3 + jan4Weekday) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function rangeForPeriod(period, timeZone) {
  const localNow = partsInTimeZone(timeZone);
  const today = ymd(localNow);
  if (period === "today") {
    return { startDate: today, endDate: today };
  }
  if (period === "week") {
    const weekdayMap = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
    const dayOffset = weekdayMap[localNow.weekday] ?? 0;
    const startDate = shiftDate(today, -dayOffset);
    const endDate = shiftDate(startDate, 6);
    return { startDate, endDate };
  }
  if (period === "month") {
    const startDate = `${localNow.year}-${String(localNow.month).padStart(2, "0")}-01`;
    const nextMonth = localNow.month === 12
      ? `${localNow.year + 1}-01-01`
      : `${localNow.year}-${String(localNow.month + 1).padStart(2, "0")}-01`;
    const endDate = shiftDate(nextMonth, -1);
    return { startDate, endDate };
  }
  return { startDate: today, endDate: today };
}

// Deterministic KV keys that auto-rotate when the period rolls over
function periodKey(period, timeZone) {
  const tzKey = (timeZone || "UTC").replace(/[^a-zA-Z0-9_-]/g, "_");
  const { startDate } = rangeForPeriod(period, timeZone);
  if (period === "today") return `expenses:today:${tzKey}:${startDate}`;
  if (period === "week") return `expenses:week:${tzKey}:${isoWeekKey(startDate)}`;
  if (period === "month") return `expenses:month:${tzKey}:${startDate.slice(0, 7)}`;
  return `expenses:${tzKey}:${period}`;
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
function iconOf(page) {
  const icon = page?.icon;
  if (!icon) return null;
  if (icon.type === "emoji") {
    return { type: "emoji", value: icon.emoji };
  }
  if (icon.type === "external" && icon.external?.url) {
    return { type: "image", value: icon.external.url };
  }
  if (icon.type === "file" && icon.file?.url) {
    return { type: "image", value: icon.file.url };
  }
  return null;
}
function relationIdsOf(page, prop) {
  return (page.properties?.[prop]?.relation || []).map((r) => r.id);
}
function numberOf(page, prop)    { return page.properties?.[prop]?.number  ?? null; }
function dateStartOf(page, prop) { return page.properties?.[prop]?.date?.start ?? null; }
function selectOf(page, prop)    { return page.properties?.[prop]?.select?.name ?? null; }

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

  const categoryList = categories.map((p) => ({
    id: p.id,
    name: titleOf(p, "Category"),
    icon: iconOf(p),
  }));
  const subcategoryList = subcategories.map((p) => ({
    id: p.id,
    name: titleOf(p, "Subcategory"),
    icon: iconOf(p),
  }));
  const accountList = accounts.map((p) => ({
    id: p.id,
    name: titleOf(p, "Account"),
    icon: iconOf(p),
  }));

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

function expenseMatches(expense, filters) {
  const dateOnly = (expense.date || "").split("T")[0];
  if (filters.from && dateOnly < filters.from) return false;
  if (filters.to && dateOnly > filters.to) return false;
  if (filters.categoryId && expense.categoryId !== filters.categoryId) return false;
  if (filters.accountId && expense.accountId !== filters.accountId) return false;
  return true;
}

async function handleGetExpenses(env, url) {
  const period = url.searchParams.get("period") || "month";
  const refresh = url.searchParams.get("refresh") === "1";
  const timeZone = url.searchParams.get("timeZone") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const categoryId = url.searchParams.get("categoryId") || "";
  const accountId = url.searchParams.get("accountId") || "";
  const filteredQuery = Boolean(from || to || categoryId || accountId);
  const range = filteredQuery
    ? { startDate: from || "0000-01-01", endDate: to || "9999-12-31" }
    : rangeForPeriod(period, timeZone);
  const KEY = filteredQuery ? null : periodKey(period, timeZone);

  if (KEY && !refresh) {
    const cached = await kvGet(env, KEY);
    if (cached) return { ...cached, cached: true };
  }

  // Build Notion query filters
  const andFilters = [{ property: "Date", date: { on_or_after: range.startDate } }];
  if (range.endDate)  andFilters.push({ property: "Date",     date:     { on_or_before: range.endDate } });
  if (categoryId)     andFilters.push({ property: "Category", relation: { contains: categoryId } });
  if (accountId)      andFilters.push({ property: "Account",  relation: { contains: accountId  } });
  const notionFilter = andFilters.length === 1 ? andFilters[0] : { and: andFilters };
  const dateSorts    = [{ property: "Date", direction: "descending" }];
  const fallbackSort = [{ timestamp: "created_time", direction: "descending" }];

  // Fetch expenses and (if configured) income in parallel
  let expensesRaw, incomeRaw;
  try {
    [expensesRaw, incomeRaw] = await Promise.all([
      queryAll(env, env.EXPENSES_DB_ID, { filter: notionFilter, sorts: dateSorts }, 200),
      env.INCOME_DB_ID
        ? queryAll(env, env.INCOME_DB_ID, { filter: notionFilter, sorts: dateSorts }, 200)
        : Promise.resolve([]),
    ]);
  } catch {
    [expensesRaw, incomeRaw] = await Promise.all([
      queryAll(env, env.EXPENSES_DB_ID, { sorts: fallbackSort }, 200),
      env.INCOME_DB_ID
        ? queryAll(env, env.INCOME_DB_ID, { sorts: fallbackSort }, 200)
        : Promise.resolve([]),
    ]);
  }

  const [categories, subcategories, accounts] = await Promise.all([
    queryAll(env, env.CATEGORIES_DB_ID,    {}),
    queryAll(env, env.SUBCATEGORIES_DB_ID, {}),
    queryAll(env, env.ACCOUNTS_DB_ID,      {}),
  ]);

  const catById = Object.fromEntries(categories.map((p) => [p.id, {
    name: titleOf(p, "Category"),
    icon: iconOf(p),
  }]));
  const subById = Object.fromEntries(subcategories.map((p) => [p.id, {
    name: titleOf(p, "Subcategory"),
    icon: iconOf(p),
  }]));
  const accById = Object.fromEntries(accounts.map((p) => [p.id, {
    name: titleOf(p, "Account"),
    icon: iconOf(p),
  }]));

  const mapExpense = (p) => {
    const date = dateStartOf(p, "Date") || "";
    return {
      id:              p.id,
      name:            titleOf(p, "Expense") || "",
      amount:          numberOf(p, "Amount") || 0,
      date,
      categoryId:      relationIdsOf(p, "Category").filter(Boolean)[0] || "",
      category:        relationIdsOf(p, "Category").map((id) => catById[id]?.name).filter(Boolean)[0] || "",
      categoryIcon:    relationIdsOf(p, "Category").map((id) => catById[id]?.icon).filter(Boolean)[0] || null,
      subcategoryIds:  relationIdsOf(p, "Subcategory").filter(Boolean),
      subcategory:     relationIdsOf(p, "Subcategory").map((id) => subById[id]?.name).filter(Boolean).join(", "),
      subcategoryIcons:relationIdsOf(p, "Subcategory").map((id) => subById[id]?.icon).filter(Boolean),
      accountId:       relationIdsOf(p, "Account").filter(Boolean)[0] || "",
      account:         relationIdsOf(p, "Account").map((id) => accById[id]?.name).filter(Boolean)[0] || "",
      accountIcon:     relationIdsOf(p, "Account").map((id) => accById[id]?.icon).filter(Boolean)[0] || null,
      txnType:         selectOf(p, "Type") || "expense",
    };
  };

  const mapIncome = (p) => {
    const date = dateStartOf(p, "Date") || "";
    return {
      id:              p.id,
      name:            titleOf(p, "Income") || titleOf(p, "Name") || "",
      amount:          numberOf(p, "Amount") || 0,
      date,
      categoryId:      relationIdsOf(p, "Category").filter(Boolean)[0] || "",
      category:        relationIdsOf(p, "Category").map((id) => catById[id]?.name).filter(Boolean)[0] || "",
      categoryIcon:    relationIdsOf(p, "Category").map((id) => catById[id]?.icon).filter(Boolean)[0] || null,
      subcategoryIds:  [],
      subcategory:     "",
      subcategoryIcons:[],
      accountId:       relationIdsOf(p, "Account").filter(Boolean)[0] || "",
      account:         relationIdsOf(p, "Account").map((id) => accById[id]?.name).filter(Boolean)[0] || "",
      accountIcon:     relationIdsOf(p, "Account").map((id) => accById[id]?.icon).filter(Boolean)[0] || null,
      txnType:         "income",
    };
  };

  const filters = { from: range.startDate, to: range.endDate, categoryId, accountId };
  const expenses = [
    ...expensesRaw.map(mapExpense),
    ...incomeRaw.map(mapIncome),
  ]
    .filter((e) => e.date)
    .filter((e) => expenseMatches(e, filters))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const total  = expenses.reduce((s, e) => s + e.amount, 0);
  const result = {
    expenses,
    total,
    period: filteredQuery ? "range" : period,
    startDate: range.startDate,
    endDate: range.endDate,
    filters: { from: from || "", to: to || "", categoryId, accountId },
  };
  if (KEY) await kvSet(env, KEY, result, TTL[period] || 1800);
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
          subcategoryId, subcategoryName, accountId, accountName, txnType } = body || {};

  if (amount === undefined || amount === null || isNaN(Number(amount)))
    return { error: "Amount required and must be a number", status: 400 };

  const isIncome = txnType === "income";
  const targetDbId = isIncome && env.INCOME_DB_ID ? env.INCOME_DB_ID : env.EXPENSES_DB_ID;
  const titleProp  = isIncome && env.INCOME_DB_ID ? "Income" : "Expense";

  const [catId, subId, acctId] = await Promise.all([
    resolveOrCreate(env, env.CATEGORIES_DB_ID,    "Category",    categoryId,    categoryName),
    isIncome ? Promise.resolve(null)
             : resolveOrCreate(env, env.SUBCATEGORIES_DB_ID, "Subcategory", subcategoryId, subcategoryName),
    resolveOrCreate(env, env.ACCOUNTS_DB_ID,      "Account",     accountId,     accountName),
  ]);

  const properties = {
    [titleProp]: { title: [{ text: { content: (expense || "").trim() } }] },
    Amount:      { number: Number(amount) },
  };
  if (date)              properties.Date        = { date:     { start: date } };
  if (catId)             properties.Category    = { relation: [{ id: catId  }] };
  if (subId)             properties.Subcategory = { relation: [{ id: subId  }] };
  if (acctId)            properties.Account     = { relation: [{ id: acctId }] };
  // Only set Type select when saving to the shared expenses DB (income DB implies type)
  if (isIncome && !env.INCOME_DB_ID) properties.Type = { select: { name: "income" } };

  const page = await notion(env, "POST", "/pages", {
    parent: { database_id: targetDbId },
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

async function handleUpdateExpense(env, pageId, body) {
  if (!pageId) return { error: "Page ID required", status: 400 };

  const { expense, amount, date, categoryId, categoryName,
          subcategoryId, subcategoryName, accountId, accountName, txnType } = body || {};

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
  if (date)              properties.Date        = { date:     { start: date } };
  if (catId)             properties.Category    = { relation: [{ id: catId  }] };
  if (subId)             properties.Subcategory = { relation: [{ id: subId  }] };
  if (acctId)            properties.Account     = { relation: [{ id: acctId }] };
  if (txnType)           properties.Type        = { select:   { name: txnType } };

  const page = await notion(env, "PATCH", `/pages/${pageId}`, {
    properties,
  });

  // Bust all cached periods
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
// Create account transfer — saves to ACCOUNT_TRANSFERS_DB_ID
// ----------------------------------------------------------------------------

async function handleCreateTransfer(env, body) {
  if (!env.ACCOUNT_TRANSFERS_DB_ID)
    return { error: "ACCOUNT_TRANSFERS_DB_ID not configured in wrangler.toml", status: 400 };

  const { note, amount, date, fromAccountId, fromAccountName, toAccountId, toAccountName } = body || {};

  if (amount === undefined || amount === null || isNaN(Number(amount)))
    return { error: "Amount required and must be a number", status: 400 };
  if ((!fromAccountId && !fromAccountName) || (!toAccountId && !toAccountName))
    return { error: "From and To accounts required", status: 400 };

  const [fromId, toId] = await Promise.all([
    resolveOrCreate(env, env.ACCOUNTS_DB_ID, "Account", fromAccountId, fromAccountName),
    resolveOrCreate(env, env.ACCOUNTS_DB_ID, "Account", toAccountId,   toAccountName),
  ]);

  const properties = {
    Note:   { title: [{ text: { content: (note || "").trim() } }] },
    Amount: { number: Number(amount) },
  };
  if (date)   properties.Date = { date:     { start: date } };
  if (fromId) properties.From = { relation: [{ id: fromId }] };
  if (toId)   properties.To   = { relation: [{ id: toId   }] };

  const page = await notion(env, "POST", "/pages", {
    parent: { database_id: env.ACCOUNT_TRANSFERS_DB_ID },
    properties,
  });

  await kvDel(env,
    periodKey("today"), periodKey("week"), periodKey("month"),
    "bootstrap",
  );

  return { ok: true, pageId: page.id, url: page.url };
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

// A2: Notion → D1 migration (last 3 months, idempotent via INSERT OR IGNORE)
async function handleMigrate(env) {
  if (!env.DB) return { error: "D1 database not configured", status: 500 };

  const threeMonthsAgo = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split("T")[0];
  })();

  const dateSorts   = [{ property: "Date", direction: "descending" }];
  const fallback    = [{ timestamp: "created_time", direction: "descending" }];
  const dateFilter  = { property: "Date", date: { on_or_after: threeMonthsAgo } };

  const [categories, subcategories, accounts, expensesRaw, incomeRaw] = await Promise.all([
    queryAll(env, env.CATEGORIES_DB_ID,    { sorts: [{ property: "Category",    direction: "ascending" }] }),
    queryAll(env, env.SUBCATEGORIES_DB_ID, { sorts: [{ property: "Subcategory", direction: "ascending" }] }),
    queryAll(env, env.ACCOUNTS_DB_ID,      { sorts: [{ property: "Account",     direction: "ascending" }] }),
    queryAll(env, env.EXPENSES_DB_ID, { filter: dateFilter, sorts: dateSorts }, 200)
      .catch(() => queryAll(env, env.EXPENSES_DB_ID, { sorts: fallback }, 200)),
    env.INCOME_DB_ID
      ? queryAll(env, env.INCOME_DB_ID, { filter: dateFilter, sorts: dateSorts }, 200)
          .catch(() => queryAll(env, env.INCOME_DB_ID, { sorts: fallback }, 200))
      : Promise.resolve([]),
  ]);

  let transfersRaw = [];
  if (env.ACCOUNT_TRANSFERS_DB_ID) {
    transfersRaw = await queryAll(env, env.ACCOUNT_TRANSFERS_DB_ID, { sorts: dateSorts }, 200).catch(() => []);
  }

  const counts = { categories: 0, subcategories: 0, accounts: 0, expenses: 0, income: 0, transfers: 0 };
  const errors = [];

  // Helper: run a list of prepared statements in batches, catch errors per batch
  async function runBatch(stmts) {
    const BATCH = 100;
    for (let i = 0; i < stmts.length; i += BATCH) {
      await env.DB.batch(stmts.slice(i, i + BATCH)).catch(e => errors.push(e.message));
    }
  }

  // 1. Insert lookup tables first (no FK dependencies)
  const lookupStmts = [];
  for (const p of categories) {
    const name = titleOf(p, "Category"); if (!name) continue;
    lookupStmts.push(env.DB.prepare("INSERT OR IGNORE INTO categories (id,name,emoji,type) VALUES (?,?,?,?)")
      .bind(p.id, name, iconOf(p)?.value || "", "expense"));
    counts.categories++;
  }
  for (const p of subcategories) {
    const name = titleOf(p, "Subcategory"); if (!name) continue;
    lookupStmts.push(env.DB.prepare("INSERT OR IGNORE INTO subcategories (id,name,category_id) VALUES (?,?,?)")
      .bind(p.id, name, relationIdsOf(p, "Category")[0] || null));
    counts.subcategories++;
  }
  for (const p of accounts) {
    const name = titleOf(p, "Account"); if (!name) continue;
    lookupStmts.push(env.DB.prepare("INSERT OR IGNORE INTO accounts (id,name,emoji) VALUES (?,?,?)")
      .bind(p.id, name, iconOf(p)?.value || ""));
    counts.accounts++;
  }
  await runBatch(lookupStmts);

  // Build set of valid IDs now in D1 (for FK safety)
  const validCatIds  = new Set((await d1All(env.DB, "SELECT id FROM categories")).map(r => r.id));
  const validSubIds  = new Set((await d1All(env.DB, "SELECT id FROM subcategories")).map(r => r.id));
  const validAcctIds = new Set((await d1All(env.DB, "SELECT id FROM accounts")).map(r => r.id));

  // 2. Expenses — null-out any FK that doesn't exist in D1
  const expStmts = [];
  for (const p of expensesRaw) {
    const date = dateStartOf(p, "Date"); if (!date) continue;
    const catId  = relationIdsOf(p, "Category")[0]    || null;
    const subId  = relationIdsOf(p, "Subcategory")[0]  || null;
    const acctId = relationIdsOf(p, "Account")[0]      || null;
    expStmts.push(env.DB.prepare(
      "INSERT OR IGNORE INTO expenses (id,date,amount,note,category_id,subcategory_id,account_id) VALUES (?,?,?,?,?,?,?)"
    ).bind(p.id, date, numberOf(p, "Amount") || 0, titleOf(p, "Expense") || "",
      catId  && validCatIds.has(catId)   ? catId  : null,
      subId  && validSubIds.has(subId)   ? subId  : null,
      acctId && validAcctIds.has(acctId) ? acctId : null));
    counts.expenses++;
  }
  await runBatch(expStmts);

  // 3. Income
  const incStmts = [];
  for (const p of incomeRaw) {
    const date = dateStartOf(p, "Date"); if (!date) continue;
    const note   = titleOf(p, "Income") || titleOf(p, "Name") || "";
    const acctId = relationIdsOf(p, "Account")[0] || null;
    incStmts.push(env.DB.prepare(
      "INSERT OR IGNORE INTO income (id,date,amount,note,source,account_id) VALUES (?,?,?,?,?,?)"
    ).bind(p.id, date, numberOf(p, "Amount") || 0, note, note,
      acctId && validAcctIds.has(acctId) ? acctId : null));
    counts.income++;
  }
  await runBatch(incStmts);

  // 4. Transfers
  const xferStmts = [];
  for (const p of transfersRaw) {
    const date   = dateStartOf(p, "Date"); if (!date) continue;
    const fromId = relationIdsOf(p, "From")[0] || null;
    const toId   = relationIdsOf(p, "To")[0]   || null;
    xferStmts.push(env.DB.prepare(
      "INSERT OR IGNORE INTO transfers (id,date,amount,note,from_account_id,to_account_id) VALUES (?,?,?,?,?,?)"
    ).bind(p.id, date, numberOf(p, "Amount") || 0,
      titleOf(p, "Note") || titleOf(p, "Name") || "",
      fromId && validAcctIds.has(fromId) ? fromId : null,
      toId   && validAcctIds.has(toId)   ? toId   : null));
    counts.transfers++;
  }
  await runBatch(xferStmts);

  return { ok: true, counts, errors, since: threeMonthsAgo };
}

// A3: Bootstrap from D1
async function handleD1Bootstrap(env) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };

  const [categories, subcategories, accounts] = await Promise.all([
    d1All(env.DB, "SELECT id,name,emoji FROM categories ORDER BY name"),
    d1All(env.DB, "SELECT id,name,category_id FROM subcategories ORDER BY name"),
    d1All(env.DB, "SELECT id,name,emoji FROM accounts ORDER BY name"),
  ]);

  const mkIcon = (emoji) => emoji ? { type: "emoji", value: emoji } : null;
  return {
    categories:   categories.map(c => ({ id: c.id, name: c.name, icon: mkIcon(c.emoji) })),
    subcategories: subcategories.map(s => ({ id: s.id, name: s.name, categoryId: s.category_id })),
    accounts:     accounts.map(a => ({ id: a.id, name: a.name, icon: mkIcon(a.emoji) })),
    recent:       { categories: [], subcategories: [], accounts: [] },
    subcatByCategory: {},
  };
}

// A4: Read transactions from D1
async function handleD1Expenses(env, url) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };

  const period    = url.searchParams.get("period") || "month";
  const type      = url.searchParams.get("type") || "";
  const catFilter = url.searchParams.get("category") || "";
  const from      = url.searchParams.get("from") || "";
  const to        = url.searchParams.get("to") || "";
  const q         = url.searchParams.get("q") || "";
  const timeZone  = url.searchParams.get("timeZone") || "";

  const filteredQuery = Boolean(from || to || catFilter || q);
  const range = filteredQuery
    ? { startDate: from || "0000-01-01", endDate: to || "9999-12-31" }
    : rangeForPeriod(period, timeZone);
  const { startDate, endDate } = range;

  const mkIcon = (emoji) => emoji ? { type: "emoji", value: emoji } : null;
  let expenses = [], incomeRows = [];

  if (!type || type === "expense") {
    let sql = `SELECT e.*,c.name as cat_name,c.emoji as cat_emoji,
      s.name as sub_name,a.name as acct_name,a.emoji as acct_emoji
      FROM expenses e
      LEFT JOIN categories c ON e.category_id=c.id
      LEFT JOIN subcategories s ON e.subcategory_id=s.id
      LEFT JOIN accounts a ON e.account_id=a.id
      WHERE e.date>=? AND e.date<=?`;
    const p = [startDate, endDate];
    if (catFilter) { sql += " AND e.category_id=?"; p.push(catFilter); }
    if (q) {
      sql += " AND (LOWER(e.note) LIKE ? OR LOWER(c.name) LIKE ? OR LOWER(a.name) LIKE ?)";
      const lq = `%${q.toLowerCase()}%`; p.push(lq, lq, lq);
    }
    sql += " ORDER BY e.date DESC";
    expenses = await d1All(env.DB, sql, p);
  }

  if (!type || type === "income") {
    let sql = `SELECT i.*,a.name as acct_name,a.emoji as acct_emoji
      FROM income i
      LEFT JOIN accounts a ON i.account_id=a.id
      WHERE i.date>=? AND i.date<=?`;
    const p = [startDate, endDate];
    if (q) {
      sql += " AND (LOWER(i.note) LIKE ? OR LOWER(i.source) LIKE ? OR LOWER(a.name) LIKE ?)";
      const lq = `%${q.toLowerCase()}%`; p.push(lq, lq, lq);
    }
    sql += " ORDER BY i.date DESC";
    incomeRows = await d1All(env.DB, sql, p);
  }

  const mapExp = (r) => ({
    id: r.id, name: r.note || "", amount: r.amount, date: r.date,
    categoryId: r.category_id || "", category: r.cat_name || "",
    categoryIcon: mkIcon(r.cat_emoji),
    subcategoryIds: r.subcategory_id ? [r.subcategory_id] : [],
    subcategory: r.sub_name || "", subcategoryIcons: [],
    accountId: r.account_id || "", account: r.acct_name || "",
    accountIcon: mkIcon(r.acct_emoji), txnType: "expense",
  });

  const mapInc = (r) => ({
    id: r.id, name: r.note || r.source || "", amount: r.amount, date: r.date,
    categoryId: "", category: "", categoryIcon: null,
    subcategoryIds: [], subcategory: "", subcategoryIcons: [],
    accountId: r.account_id || "", account: r.acct_name || "",
    accountIcon: mkIcon(r.acct_emoji), txnType: "income",
  });

  const all = [...expenses.map(mapExp), ...incomeRows.map(mapInc)]
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    expenses: all,
    total: all.reduce((s, e) => s + e.amount, 0),
    period: filteredQuery ? "range" : period,
    startDate, endDate, cached: false,
  };
}

async function handleD1Summary(env, url) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };

  const period   = url.searchParams.get("period") || "month";
  const timeZone = url.searchParams.get("timeZone") || "";
  const { startDate, endDate } = rangeForPeriod(period, timeZone);

  const [expSum, incSum] = await Promise.all([
    d1First(env.DB, "SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE date>=? AND date<=?", [startDate, endDate]),
    d1First(env.DB, "SELECT COALESCE(SUM(amount),0) as total FROM income WHERE date>=? AND date<=?",   [startDate, endDate]),
  ]);

  const totalExpenses = expSum?.total || 0;
  const totalIncome   = incSum?.total || 0;
  return { balance: totalIncome - totalExpenses, totalIncome, totalExpenses, startDate, endDate };
}

// A5: Write routes for D1
async function handleD1CreateTransaction(env, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  const { note, amount, date, categoryId, subcategoryId, accountId, txnType,
          fromAccountId, toAccountId } = body || {};
  if (amount === undefined || isNaN(Number(amount))) return { error: "Amount required", status: 400 };

  const id = crypto.randomUUID();
  const d  = date || new Date().toISOString().split("T")[0];

  if (txnType === "income") {
    await d1Run(env.DB,
      "INSERT INTO income (id,date,amount,note,source,account_id) VALUES (?,?,?,?,?,?)",
      [id, d, Number(amount), note || "", note || "", accountId || null]);
  } else if (txnType === "transfer") {
    if (!fromAccountId || !toAccountId) return { error: "From and To accounts required", status: 400 };
    await d1Run(env.DB,
      "INSERT INTO transfers (id,date,amount,note,from_account_id,to_account_id) VALUES (?,?,?,?,?,?)",
      [id, d, Number(amount), note || "", fromAccountId, toAccountId]);
  } else {
    await d1Run(env.DB,
      "INSERT INTO expenses (id,date,amount,note,category_id,subcategory_id,account_id) VALUES (?,?,?,?,?,?,?)",
      [id, d, Number(amount), note || "", categoryId || null, subcategoryId || null, accountId || null]);
  }
  return { ok: true, id };
}

async function handleD1UpdateTransaction(env, id, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!id) return { error: "ID required", status: 400 };
  const { note, amount, date, categoryId, subcategoryId, accountId, txnType } = body || {};
  if (amount === undefined || isNaN(Number(amount))) return { error: "Amount required", status: 400 };

  if (txnType === "income") {
    await d1Run(env.DB,
      "UPDATE income SET date=?,amount=?,note=?,source=?,account_id=? WHERE id=?",
      [date, Number(amount), note || "", note || "", accountId || null, id]);
  } else {
    await d1Run(env.DB,
      "UPDATE expenses SET date=?,amount=?,note=?,category_id=?,subcategory_id=?,account_id=? WHERE id=?",
      [date, Number(amount), note || "", categoryId || null, subcategoryId || null, accountId || null, id]);
  }
  return { ok: true, id };
}

async function handleD1DeleteTransaction(env, id, txnType) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!id) return { error: "ID required", status: 400 };
  const table = txnType === "income" ? "income" : "expenses";
  await d1Run(env.DB, `DELETE FROM ${table} WHERE id=?`, [id]);
  return { ok: true, id };
}

// A6: CSV export from D1
async function handleD1Export(env, url) {
  if (!env.DB) return new Response(JSON.stringify({ error: "D1 not configured" }), { status: 500 });

  const type     = url.searchParams.get("type") || "expense";
  const period   = url.searchParams.get("period") || "month";
  const timeZone = url.searchParams.get("timeZone") || "";
  const { startDate, endDate } = rangeForPeriod(period, timeZone);

  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  let csv;
  if (type === "income") {
    const rows = await d1All(env.DB,
      "SELECT i.date,i.note,i.source,i.amount,a.name as account FROM income i LEFT JOIN accounts a ON i.account_id=a.id WHERE i.date>=? AND i.date<=? ORDER BY i.date DESC",
      [startDate, endDate]);
    csv = "Date,Source,Amount,Account\n" +
      rows.map(r => [r.date, r.note || r.source, r.amount, r.account].map(esc).join(",")).join("\n");
  } else {
    const rows = await d1All(env.DB,
      "SELECT e.date,e.note,e.amount,c.name as category,s.name as subcategory,a.name as account FROM expenses e LEFT JOIN categories c ON e.category_id=c.id LEFT JOIN subcategories s ON e.subcategory_id=s.id LEFT JOIN accounts a ON e.account_id=a.id WHERE e.date>=? AND e.date<=? ORDER BY e.date DESC",
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

// PIN fallback — session cookie
const SESS_COOKIE = "ne_sess";
const SESS_TTL    = 10 * 365 * 24 * 60 * 60; // 10 years in seconds

async function makeSessionCookie(secret) {
  const ts  = Date.now().toString();
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = btoa(String.fromCharCode(
    ...new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ts)))
  ));
  return `${SESS_COOKIE}=${btoa(ts + "|" + sig)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESS_TTL}`;
}

async function hasValidSession(request, secret) {
  const raw = getCookie(request, SESS_COOKIE);
  if (!raw) return false;
  try {
    const decoded = atob(raw);
    const bar = decoded.indexOf("|");
    const ts  = decoded.slice(0, bar);
    const sig = decoded.slice(bar + 1);
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const expected = btoa(String.fromCharCode(
      ...new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ts)))
    ));
    return sig === expected;
  } catch { return false; }
}

async function isAuthorized(request, env) {
  // 1. Valid PIN session cookie → always allow
  const sessSecret = env.SESSION_SECRET || "ne-default-secret";
  if (await hasValidSession(request, sessSecret)) return true;

  // 2. Valid Cloudflare Access JWT → allow
  if (env.CF_ACCESS_TEAM && env.CF_ACCESS_AUD) {
    const token = request.headers.get("Cf-Access-Jwt-Assertion")
               || getCookie(request, "CF_Authorization");
    if (token && await verifyAccessJWT(token, env.CF_ACCESS_TEAM, env.CF_ACCESS_AUD)) return true;
  }

  // 3. No auth configured at all → open access
  if (!env.PIN && !env.CF_ACCESS_TEAM) return true;

  return false;
}

const LOGIN_HTML = (err) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="theme-color" content="#191919"/>
<title>Expense Tracker</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#191919;color:rgba(255,255,255,.87);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;
    padding:max(24px,env(safe-area-inset-top)) 16px max(24px,env(safe-area-inset-bottom));}
  .box{width:100%;max-width:320px;background:#202020;
    border:1px solid rgba(255,255,255,.08);border-radius:16px;
    padding:32px 24px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.5);}
  .icon{font-size:44px;margin-bottom:16px}
  h1{font-size:20px;font-weight:700;margin-bottom:6px}
  .sub{font-size:13px;color:rgba(255,255,255,.44);margin-bottom:24px}
  input{width:100%;background:#2f2f2f;border:1px solid rgba(255,255,255,.08);
    color:rgba(255,255,255,.87);border-radius:10px;padding:14px;
    font-size:24px;text-align:center;letter-spacing:10px;
    outline:none;margin-bottom:14px;-webkit-text-security:disc;}
  input:focus{border-color:#ff7369}
  button{width:100%;background:#ff7369;color:#fff;border:none;
    border-radius:10px;padding:15px;font-size:16px;font-weight:700;cursor:pointer;}
  button:active{opacity:.85}
  .err{color:#f46a6a;font-size:13px;margin-bottom:14px;font-weight:500}
</style></head>
<body><div class="box">
  <div class="icon">💸</div>
  <h1>Expense Tracker</h1>
  <p class="sub">Enter your access code</p>
  ${err ? '<div class="err">Incorrect code. Try again.</div>' : ""}
  <form method="POST" action="/login">
    <input type="tel" name="pin" inputmode="numeric" placeholder="••••••••" autofocus autocomplete="one-time-code"/>
    <button type="submit">Unlock →</button>
  </form>
</div></body></html>`;

// ----------------------------------------------------------------------------
// HTML shell
// ----------------------------------------------------------------------------

import { HTML } from "./index-html.js";
import { DESKTOP_HTML } from "./desktop-html.js";

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const MANIFEST_JSON = JSON.stringify({
  name: "Notion Expense Tracker",
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
const CACHE_NAME = "ne-pwa-v2";
const OFFLINE_URLS = ["/"];

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

  // Bootstrap: stale-while-revalidate — return cached immediately, refresh in background
  if (url.pathname === "/api/bootstrap" && !url.searchParams.has("refresh")) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      const networkFetch = fetch(event.request).then((res) => {
        if (res.ok) cache.put(event.request, res.clone());
        return res;
      }).catch(() => null);
      return cached || networkFetch;
    })());
    return;
  }

  // Other API Requests: Network First, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: "Offline mode", cached: true, offline: true }), {
          status: 200, headers: { "Content-Type": "application/json" }
        });
      })
    );
    return;
  }

  // App Shell: Stale-While-Revalidate
  if (url.pathname === "/") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        }).catch(() => null);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") return new Response("ok");
    
    // ── PWA Assets (No Auth Required) ──
    if (url.pathname === "/manifest.json") {
      return new Response(MANIFEST_JSON, { headers: { "Content-Type": "application/manifest+json; charset=utf-8" } });
    }
    if (url.pathname === "/sw.js") {
      return new Response(SW_JS, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Service-Worker-Allowed": "/" } });
    }

    // ── PIN login ──
    if (url.pathname === "/login") {
      if (request.method === "GET") {
        return new Response(LOGIN_HTML(false), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
      if (request.method === "POST") {
        const form = await request.formData().catch(() => null);
        const pin  = (form?.get("pin") || "").trim();
        const valid = env.PIN ? pin === env.PIN : pin === "34501829";
        if (valid) {
          const cookie = await makeSessionCookie(env.SESSION_SECRET || "ne-default-secret");
          return new Response(null, { status: 302, headers: { Location: "/", "Set-Cookie": cookie } });
        }
        return new Response(LOGIN_HTML(true), { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
    }

    // ── Logout ──
    if (url.pathname === "/logout") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login", "Set-Cookie": `${SESS_COOKIE}=; Path=/; Max-Age=0` },
      });
    }

    // ── Auth gate ──
    if (!(await isAuthorized(request, env))) {
      if (url.pathname.startsWith("/api/")) return json({ error: "unauthorized" }, 401);
      return new Response(null, { status: 302, headers: { Location: "/login" } });
    }

    // ── App shells ──
    if (url.pathname === "/") {
      return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (url.pathname === "/desktop" || url.pathname === "/desktop/") {
      return new Response(DESKTOP_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ── API routes ──
    if (url.pathname.startsWith("/api/")) {
      try {
        if (url.pathname === "/api/bootstrap" && request.method === "GET") {
          const refresh = url.searchParams.get("refresh") === "1";
          const data = await handleBootstrap(env, refresh);
          return new Response(JSON.stringify(data), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "private, max-age=300, stale-while-revalidate=1800",
            },
          });
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
        if (url.pathname.startsWith("/api/expense/") && request.method === "PATCH") {
          const pageId = url.pathname.slice("/api/expense/".length);
          const body = await request.json().catch(() => null);
          const result = await handleUpdateExpense(env, pageId, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        if (url.pathname === "/api/transfer" && request.method === "POST") {
          const body = await request.json().catch(() => null);
          const result = await handleCreateTransfer(env, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }

        // ── D1 routes ──
        if (url.pathname === "/api/migrate" && request.method === "GET") {
          const result = await handleMigrate(env);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }
        if (url.pathname === "/api/d1/bootstrap" && request.method === "GET") {
          const result = await handleD1Bootstrap(env);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }
        if (url.pathname === "/api/d1/expenses" && request.method === "GET") {
          const result = await handleD1Expenses(env, url);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }
        if (url.pathname === "/api/d1/summary" && request.method === "GET") {
          const result = await handleD1Summary(env, url);
          if (result.error) return json(result, result.status || 500);
          return json(result);
        }
        if (url.pathname === "/api/d1/expense" && request.method === "POST") {
          const body = await request.json().catch(() => null);
          const result = await handleD1CreateTransaction(env, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        if (url.pathname.startsWith("/api/d1/expense/") && request.method === "PUT") {
          const id = url.pathname.slice("/api/d1/expense/".length);
          const body = await request.json().catch(() => null);
          const result = await handleD1UpdateTransaction(env, id, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        if (url.pathname.startsWith("/api/d1/expense/") && request.method === "DELETE") {
          const id = url.pathname.slice("/api/d1/expense/".length);
          const txnType = url.searchParams.get("type") || "expense";
          const result = await handleD1DeleteTransaction(env, id, txnType);
          if (result.error) return json(result, result.status || 400);
          return json(result);
        }
        if (url.pathname === "/api/d1/export" && request.method === "GET") {
          return handleD1Export(env, url);
        }

        return json({ error: "not found" }, 404);
      } catch (err) {
        return json({ error: err.message || "server error", details: err.body || null }, err.status || 500);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
