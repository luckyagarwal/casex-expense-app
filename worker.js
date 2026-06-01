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
    d1All(env.DB, "SELECT id,name,icon_url FROM subcategories ORDER BY name"),
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
      return { type: "emoji", value: iconUrl };
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
// Entity CRUD — categories, subcategories, accounts
// ----------------------------------------------------------------------------

async function handleD1CreateEntity(env, table, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!["categories", "subcategories", "accounts"].includes(table))
    return { error: "Invalid table", status: 400 };
  const name = (body?.name || "").trim();
  if (!name) return { error: "Name required", status: 400 };

  const emoji   = body?.emoji   || null;
  const iconUrl = body?.iconUrl || null;
  const id = crypto.randomUUID();

  if (table === "subcategories") {
    const subIconUrl = iconUrl || emoji || null;
    await d1Run(env.DB, "INSERT INTO subcategories (id,name,icon_url) VALUES (?,?,?)", [id, name, subIconUrl]);
  } else if (table === "categories") {
    await d1Run(env.DB, "INSERT INTO categories (id,name,emoji,icon_url,type) VALUES (?,?,?,?,?)", [id, name, emoji, iconUrl, "expense"]);
  } else {
    // accounts
    await d1Run(env.DB, "INSERT INTO accounts (id,name,emoji,icon_url) VALUES (?,?,?,?)", [id, name, emoji, iconUrl]);
  }
  return { ok: true, id };
}

async function handleD1DeleteEntity(env, table, id) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  if (!id) return { error: "ID required", status: 400 };
  if (!["categories", "subcategories", "accounts"].includes(table))
    return { error: "Invalid table", status: 400 };

  await d1Run(env.DB, `DELETE FROM ${table} WHERE id=?`, [id]);
  return { ok: true, id };
}

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
  if (table === "subcategories") {
    // subcategories has no emoji column; emoji maps to icon_url
    // iconUrl wins only when non-null; otherwise fall back to emoji value
    const hasEmoji   = "emoji"   in (body || {});
    const hasIconUrl = "iconUrl" in (body || {});
    if (hasEmoji || hasIconUrl) {
      const finalIcon = (hasIconUrl && body.iconUrl != null) ? body.iconUrl
                      : (hasEmoji  && body.emoji   != null) ? body.emoji
                      : null;
      sets.push("icon_url=?"); params.push(finalIcon);
    }
  } else {
    if (body && "emoji" in body) {
      sets.push("emoji=?"); params.push(typeof body.emoji === "string" ? body.emoji : "");
    }
    if (body && "iconUrl" in body) {
      sets.push("icon_url=?"); params.push(body.iconUrl || null);
    }
  }
  if (!sets.length) return { error: "Nothing to update", status: 400 };

  params.push(id);
  const sql = `UPDATE ${table} SET ${sets.join(",")} WHERE id=?`;
  const r = await env.DB.prepare(sql).bind(...params).run();
  // r.meta?.changes can be unreliable on D1 local — treat 0 as success
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
      return { type: "emoji", value: iconUrl };
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
// Natural Language Parser (Workers AI + Heuristic Fallback)
// ----------------------------------------------------------------------------

async function parseNaturalLanguage(env, text, categories, subcategories, accounts, localDateTime) {
  const currentDate = localDateTime || new Date().toISOString().slice(0, 16);

  if (!env.AI) {
    console.warn("AI binding not configured. Falling back to heuristic parser.");
    return parseHeuristicNaturalLanguage(env, text, categories, subcategories, accounts, currentDate);
  }
  
  const systemPrompt = `You are a precise transaction parser for an expense tracker application.
Analyze the user's natural language input and extract transaction details.
You will be provided a JSON input containing:
{
  "text": "the user's transaction description",
  "currentDateTime": "YYYY-MM-DDTHH:mm representing the reference time context"
}

You MUST output a valid JSON object ONLY matching the format below. Do not include any explanations, markdown code blocks, or formatting.

JSON Output Format:
{
  "amount": number,
  "note": string,
  "txnType": "expense" or "income",
  "date": string (ISO-like string YYYY-MM-DDTHH:mm representing the transaction time. Resolve relative terms like "today", "yesterday", "at 3pm", "3:30 pm" based on the "currentDateTime" provided in the input),
  "categoryId": string,
  "subcategoryId": string or null,
  "accountId": string
}

Valid Categories:
${JSON.stringify(categories.map(c => ({ id: c.id, name: c.name })))}

Valid Subcategories:
${JSON.stringify(subcategories.map(s => ({ id: s.id, name: s.name })))}

Valid Accounts:
${JSON.stringify(accounts.map(a => ({ id: a.id, name: a.name })))}

Be extremely accurate:
1. Parse relative days (yesterday, today) and specific times (at 3pm) correctly based on currentDateTime.
2. Select the closest category/subcategory.
3. Map transaction type correctly. Income is money received (e.g. "earned", "salary received", "received salary", "freelance gig"). Expense is money spent or paid out (e.g. "paid salary to kajal", "salary paid", "rent paid", "bought lunch"). "Salary" by itself is income, but "salary paid" or "paid salary" is an expense.
4. The "note" field should be the specific noun, subject, person, or item of the transaction (e.g. "Kajal", "Internet bill", "Keyboard", "Freelance gig"). Do NOT throw away specific names, nouns, or subjects. Only if no custom subject or specific noun is present, default to the matched subcategory name or category name. Do NOT include amounts, dates, times, relative terms (like "now", "today", "5pm"), or filler words (like "spend", "paid", "using").
5. Map account names accurately. Inputs like "yes bank" or "yes" match "YES BANK R" or "YES BANK I". Inputs like "icici" or "icici bank" match "ICICI Bank" or "ICICI MMT". Map to the closest available account name.`;

  try {
    const inputPayload = {
      text: text,
      currentDateTime: currentDate
    };

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(inputPayload, null, 2) }
      ]
    });

    let resultText = "";
    if (typeof aiResponse === "string") {
      resultText = aiResponse;
    } else if (aiResponse.response) {
      resultText = aiResponse.response;
    } else if (aiResponse.result) {
      resultText = aiResponse.result;
    } else {
      resultText = JSON.stringify(aiResponse);
    }

    let cleanedText = resultText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleanedText);

    const resolvedCat = categories.find(c => c.id === parsed.categoryId);
    const resolvedSub = subcategories.find(s => s.id === parsed.subcategoryId);
    const resolvedAcc = accounts.find(a => a.id === parsed.accountId);

    const defaultAcc = accounts.find(a => a.name.toLowerCase().includes("cash")) || accounts[0];

    return {
      amount: parsed.amount || 0,
      note: parsed.note || (resolvedSub ? resolvedSub.name : (resolvedCat ? resolvedCat.name : "Expense")),
      txnType: parsed.txnType || "expense",
      date: parsed.date || currentDate,
      categoryId: resolvedCat ? resolvedCat.id : (categories[0] ? categories[0].id : null),
      category: resolvedCat ? resolvedCat.name : (categories[0] ? categories[0].name : ""),
      subcategoryId: resolvedSub ? resolvedSub.id : null,
      subcategory: resolvedSub ? resolvedSub.name : "",
      accountId: resolvedAcc ? resolvedAcc.id : (defaultAcc ? defaultAcc.id : null),
      account: resolvedAcc ? resolvedAcc.name : (defaultAcc ? defaultAcc.name : "")
    };
  } catch (err) {
    console.error("Workers AI failed, using heuristic fallback", err);
    return parseHeuristicNaturalLanguage(env, text, categories, subcategories, accounts, currentDate);
  }
}

async function parseHeuristicNaturalLanguage(env, text, categories, subcategories, accounts, localDateTime) {
  const textLower = text.toLowerCase().trim();

  // 1. Extract Amount
  const amountRegex = /(?:rs\.?|inr|₹|\$)?\s*(\d+(?:\.\d+)?)/i;
  const amtMatch = textLower.match(amountRegex);
  const amount = amtMatch ? parseFloat(amtMatch[1]) : 0;

  let cleanText = textLower;
  if (amtMatch) {
    cleanText = cleanText.replace(amtMatch[0], "");
  }

  // 2. Extract transaction type (income vs expense)
  const incomeKeywords = ["earned", "salary received", "received salary", "income", "received", "refund", "gifted", "deposit"];
  const expenseKeywords = ["paid", "spent", "spends", "gave", "sent", "bought", "cost", "purchase", "bill"];
  
  let txnType = "expense";
  const hasIncomeKw = incomeKeywords.some(kw => cleanText.includes(kw)) || (cleanText.includes("salary") && !expenseKeywords.some(kw => cleanText.includes(kw)));
  if (hasIncomeKw) {
    txnType = "income";
  }

  // 3. Extract Time
  let parsedHour = null;
  let parsedMinute = 0;
  
  const specificTimeMatch = cleanText.match(/\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i) || 
                             cleanText.match(/\b(?:at\s+)(\d{1,2})(?::(\d{2}))?\b/i) ||
                             cleanText.match(/\b(\d{1,2}):(\d{2})\b/i);
  if (specificTimeMatch) {
    let hr = parseInt(specificTimeMatch[1], 10);
    const min = specificTimeMatch[2] ? parseInt(specificTimeMatch[2], 10) : 0;
    const ampm = specificTimeMatch[3] ? specificTimeMatch[3].toLowerCase() : null;
    
    if (ampm === "pm" && hr < 12) hr += 12;
    if (ampm === "am" && hr === 12) hr = 0;
    
    parsedHour = hr;
    parsedMinute = min;
    
    cleanText = cleanText.replace(specificTimeMatch[0], "");
  }

  // 4. Extract Date
  let targetDate = localDateTime ? new Date(localDateTime) : new Date();
  if (cleanText.includes("yesterday")) {
    targetDate.setDate(targetDate.getDate() - 1);
    cleanText = cleanText.replace("yesterday", "");
  } else if (cleanText.includes("today")) {
    cleanText = cleanText.replace("today", "");
  } else if (cleanText.includes("2 days ago")) {
    targetDate.setDate(targetDate.getDate() - 2);
    cleanText = cleanText.replace("2 days ago", "");
  } else {
    const months = [
      "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"
    ];
    const shortMonths = [
      "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    
    for (let mIdx = 0; mIdx < 12; mIdx++) {
      const mName = months[mIdx];
      const mShort = shortMonths[mIdx];
      const monthPattern = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${mName}|${mShort})\\b|\\b(${mName}|${mShort})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`, "i");
      const mMatch = cleanText.match(monthPattern);
      if (mMatch) {
        const dayStr = mMatch[1] || mMatch[4];
        const dayNum = parseInt(dayStr, 10);
        targetDate.setMonth(mIdx);
        targetDate.setDate(dayNum);
        cleanText = cleanText.replace(mMatch[0], "");
        break;
      }
    }
  }

  if (parsedHour !== null) {
    targetDate.setHours(parsedHour, parsedMinute, 0, 0);
  }

  const pad = n => String(n).padStart(2, "0");
  const dateStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(targetDate.getDate())}T${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}:00`;

  // 5. Match Category & Subcategory
  let categoryId = null;
  let subcategoryId = null;
  let categoryName = "";
  let subcategoryName = "";

  const words = cleanText.split(/[^a-zA-Z0-9]/).map(w => w.trim()).filter(w => w.length > 0);
  const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Sort subcategories by length descending to match longer specific names first
  const sortedSubcategories = [...subcategories].sort((a, b) => b.name.length - a.name.length);
  let bestSub = null;
  for (const s of sortedSubcategories) {
    const sName = s.name.toLowerCase();
    if (words.includes(sName)) {
      bestSub = s;
      break;
    }
  }
  if (!bestSub) {
    for (const s of sortedSubcategories) {
      const sName = s.name.toLowerCase();
      const subRegex = new RegExp(`\\b${escapeRegExp(sName)}\\b`, "i");
      if (subRegex.test(cleanText)) {
        bestSub = s;
        break;
      }
    }
  }
  if (!bestSub) {
    for (const s of sortedSubcategories) {
      const sName = s.name.toLowerCase();
      if (cleanText.includes(sName)) {
        bestSub = s;
        break;
      }
    }
  }

  if (bestSub) {
    subcategoryId = bestSub.id;
    subcategoryName = bestSub.name;
    
    // Check D1 recent associations first
    const association = await d1First(env.DB, 
      "SELECT category_id FROM expenses WHERE subcategory_id = ? ORDER BY date DESC LIMIT 1", 
      [bestSub.id]
    );
    if (association && association.category_id) {
      const parentCat = categories.find(c => c.id === association.category_id);
      if (parentCat) {
        categoryId = parentCat.id;
        categoryName = parentCat.name;
      }
    }
    
    // Heuristic fallback mapping
    if (!categoryId) {
      const SUB_TO_CAT_MAP = {
        "lunch": "food", "dinner": "food", "beverages": "food", "eating out": "food", "snacking": "food", "swiggy": "food",
        "amazon": "household", "appliances": "household", "blinkit": "household", "country delight": "household",
        "fruits": "household", "grocery": "household", "instamart": "household", "kitchen": "household",
        "vegetables": "household", "zepto": "household",
        "cab": "transport", "fuel": "transport", "metro": "transport", "tax": "transport",
        "cosmetics": "beauty", "haircut": "health", "medicine": "health", "entertainment": "subscription",
        "mobile recharge": "subscription", "wifi": "subscription", "movie": "culture", "stay": "holiday",
        "travel": "holiday", "school supplies": "education", "salary": "salary", "clothing": "shopping"
      };
      const catKey = SUB_TO_CAT_MAP[subcategoryName.toLowerCase()];
      if (catKey) {
        const parentCat = categories.find(c => c.name.toLowerCase() === catKey);
        if (parentCat) {
          categoryId = parentCat.id;
          categoryName = parentCat.name;
        }
      }
    }
  }

  if (!categoryId) {
    let bestCat = null;
    const sortedCategories = [...categories].sort((a, b) => b.name.length - a.name.length);
    for (const c of sortedCategories) {
      const cName = c.name.toLowerCase();
      if (words.includes(cName)) {
        bestCat = c;
        break;
      }
    }
    if (!bestCat) {
      for (const c of sortedCategories) {
        const cName = c.name.toLowerCase();
        const catRegex = new RegExp(`\\b${escapeRegExp(cName)}\\b`, "i");
        if (catRegex.test(cleanText)) {
          bestCat = c;
          break;
        }
      }
    }
    if (!bestCat) {
      for (const c of sortedCategories) {
        const cName = c.name.toLowerCase();
        if (cleanText.includes(cName)) {
          bestCat = c;
          break;
        }
      }
    }
    if (bestCat) {
      categoryId = bestCat.id;
      categoryName = bestCat.name;
    }
  }

  // 6. Match Account
  let accountId = null;
  let accountName = "";
  let bestAcc = null;

  // Helper to generate search aliases for an account name
  const getAccountAliases = name => {
    const lower = name.toLowerCase();
    const list = [lower];
    if (lower.includes("yes bank")) {
      list.push("yes bank");
      list.push("yes");
    }
    if (lower.includes("icici")) {
      list.push("icici");
      if (lower.includes("mmt")) {
        list.push("icici mmt");
        list.push("mmt");
      }
      if (lower.includes("coral")) {
        list.push("icici coral");
        list.push("coral");
      }
    }
    if (lower.includes("axis")) {
      list.push("axis");
      list.push("flipkart");
    }
    if (lower.includes("cred")) {
      list.push("cred");
    }
    return list;
  };

  const accountMatches = [];
  for (const a of accounts) {
    const aliases = getAccountAliases(a.name);
    for (const alias of aliases) {
      accountMatches.push({ account: a, alias: alias });
    }
  }
  // Sort by alias length descending
  accountMatches.sort((a, b) => b.alias.length - a.alias.length);

  for (const m of accountMatches) {
    const aliasPat = new RegExp(`\\b${escapeRegExp(m.alias)}\\b`, "i");
    if (aliasPat.test(cleanText)) {
      bestAcc = m.account;
      break;
    }
  }
  if (!bestAcc) {
    for (const m of accountMatches) {
      if (cleanText.includes(m.alias)) {
        bestAcc = m.account;
        break;
      }
    }
  }
  if (bestAcc) {
    accountId = bestAcc.id;
    accountName = bestAcc.name;
  } else {
    if (accounts.length > 0) {
      const cashAcc = accounts.find(a => a.name.toLowerCase().includes("cash"));
      const defaultAcc = cashAcc || accounts[0];
      accountId = defaultAcc.id;
      accountName = defaultAcc.name;
    }
  }

  // 7. Note/Description Extraction
  let noteText = cleanText;
  const fillers = [
    /\bspends?\b/gi, /\bspent\b/gi, /\bpaid\b/gi, /\bbought\b/gi,
    /\bfor\b/gi, /\bon\b/gi, /\bfrom\b/gi, /\bat\b/gi, /\bin\b/gi,
    /\bto\b/gi, /\bwith\b/gi, /\bvia\b/gi, /\bthrough\b/gi, /\busing\b/gi,
    /\bunder\b/gi, /\bnow\b/gi, /\btoday\b/gi, /\byesterday\b/gi, /\btomorrow\b/gi,
    /\btonight\b/gi, /\brupees?\b/gi, /\brs\.?\b/gi, /\binr\b/gi, /\bbucks\b/gi,
    /\bamt\b/gi, /\bamount\b/gi, /\band\b/gi, /\ba\b/gi, /\ban\b/gi, /\bthe\b/gi
  ];
  for (const filler of fillers) {
    noteText = noteText.replace(filler, "");
  }

  if (categoryName) {
    const catWords = categoryName.toLowerCase().split(/[^a-z0-9]/).filter(w => w.length > 0);
    for (const w of catWords) {
      noteText = noteText.replace(new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi"), "");
    }
  }
  if (subcategoryName) {
    const subWords = subcategoryName.toLowerCase().split(/[^a-z0-9]/).filter(w => w.length > 0);
    for (const w of subWords) {
      noteText = noteText.replace(new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi"), "");
    }
  }
  if (accountName) {
    const accWords = accountName.toLowerCase().split(/[^a-z0-9]/).filter(w => w.length > 0);
    for (const w of accWords) {
      noteText = noteText.replace(new RegExp(`\\b${escapeRegExp(w)}\\b`, "gi"), "");
    }
  }

  noteText = noteText.replace(/\s+/g, " ").trim();
  noteText = noteText.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();

  let note = noteText ? noteText.charAt(0).toUpperCase() + noteText.slice(1) : "";
  
  const cleanNoteLower = note.toLowerCase().trim();
  const rubbishWords = ["now", "today", "yesterday", "tomorrow", "tonight", "rupee", "rupees", "rs", "inr", "bucks", "pm", "am", "under", "r"];
  if (!note || note.length <= 2 || rubbishWords.includes(cleanNoteLower)) {
    note = subcategoryName || categoryName || (txnType === "income" ? "Income" : "Expense");
  }

  if (!categoryId && categories.length > 0) {
    if (txnType === "income") {
      const salaryCat = categories.find(c => c.name.toLowerCase() === "salary");
      const otherCat = salaryCat || categories.find(c => c.name.toLowerCase() === "other") || categories[0];
      categoryId = otherCat.id;
      categoryName = otherCat.name;
    } else {
      const otherCat = categories.find(c => c.name.toLowerCase() === "other") || 
                       categories.find(c => c.name.toLowerCase() === "miscellaneous") || 
                       categories[0];
      categoryId = otherCat.id;
      categoryName = otherCat.name;
    }
  }

  return {
    amount,
    note,
    txnType,
    date: dateStr,
    categoryId,
    category: categoryName,
    subcategoryId,
    subcategory: subcategoryName,
    accountId,
    account: accountName
  };
}

async function handleD1QuickAdd(env, body) {
  if (!env.DB) return { error: "D1 not configured", status: 500 };
  const { text, localDateTime } = body || {};
  if (!text || !text.trim()) return { error: "Text required", status: 400 };

  const [categories, subcategories, accounts] = await Promise.all([
    d1All(env.DB, "SELECT id,name,emoji,icon_url FROM categories"),
    d1All(env.DB, "SELECT id,name,icon_url FROM subcategories"),
    d1All(env.DB, "SELECT id,name,emoji,icon_url FROM accounts"),
  ]);

  const parsed = await parseNaturalLanguage(env, text, categories, subcategories, accounts, localDateTime);
  
  const createResult = await handleD1CreateTransaction(env, parsed);
  if (createResult.error) return createResult;
  
  return { ok: true, id: createResult.id, parsed };
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
const CACHE_NAME = "ne-pwa-v21";
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
      (async () => {
        const cachedResponse = await caches.match(event.request);
        try {
          const networkResponse = await fetch(event.request);
          const ct = networkResponse.headers.get("Content-Type") || "";
          if (networkResponse.ok && ct.includes("text/html"))
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          return networkResponse;
        } catch (e) {
          return cachedResponse || Response.error();
        }
      })()
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

        // Quick add via natural language
        if (url.pathname === "/api/d1/quick-add" && request.method === "POST") {
          const body = await request.json().catch(() => null);
          const result = await handleD1QuickAdd(env, body);
          if (result.error) return json(result, result.status || 400);
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

        // Entity create
        const entityCreateMatch = url.pathname.match(/^\/api\/d1\/(categories|subcategories|accounts)$/);
        if (entityCreateMatch && request.method === "POST") {
          const [, table] = entityCreateMatch;
          const body = await request.json().catch(() => null);
          const result = await handleD1CreateEntity(env, table, body);
          if (result.error) return json(result, result.status || 400);
          return json(result);
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

        // Entity delete
        if (entityMatch && request.method === "DELETE") {
          const [, table, id] = entityMatch;
          const result = await handleD1DeleteEntity(env, table, id);
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
