// HTML + CSS + JS for the expense form. Served at GET /.
// Exported as a string so the Worker can ship as a single bundle.

export const HTML = /* html */ `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" id="themeColorMeta" content="#191919" />
<title>Add Expense</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%92%B8%3C/text%3E%3C/svg%3E" />
<style>
  /* ── Notion Night (dark) theme ── */
  :root,
  [data-theme="dark"] {
    --bg:         #191919;
    --panel:      #202020;
    --panel-2:    #2f2f2f;
    --panel-3:    #373737;
    --fg:         rgba(255,255,255,0.87);
    --fg-sub:     rgba(255,255,255,0.60);
    --muted:      rgba(255,255,255,0.44);
    --accent:     #ff7369;
    --accent-dim: rgba(255,115,105,0.15);
    --accent-fg:  #fff;
    --danger:     #f46a6a;
    --ok:         #45d98e;
    --border:     rgba(255,255,255,0.08);
    --shadow:     0 2px 12px rgba(0,0,0,0.5);
    --radius:     12px;
    --theme-meta: #191919;
  }

  /* ── Notion Day (light) theme ── */
  [data-theme="light"] {
    --bg:         #ffffff;
    --panel:      #f7f6f3;
    --panel-2:    #ebebea;
    --panel-3:    #e3e2df;
    --fg:         #37352f;
    --fg-sub:     #6f6e69;
    --muted:      #9b9a97;
    --accent:     #eb5757;
    --accent-dim: rgba(235,87,87,0.10);
    --accent-fg:  #fff;
    --danger:     #e03e3e;
    --ok:         #0f9b75;
    --border:     rgba(55,53,47,0.09);
    --shadow:     0 1px 8px rgba(15,15,15,0.10);
    --theme-meta: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: var(--bg);
    color: var(--fg);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  body {
    padding:
      max(16px, env(safe-area-inset-top))
      max(16px, env(safe-area-inset-right))
      max(24px, calc(env(safe-area-inset-bottom) + 16px))
      max(16px, env(safe-area-inset-left));
    max-width: 520px;
    margin: 0 auto;
  }

  /* ── HEADER ── */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 14px;
    gap: 10px;
  }
  .header-left { display: flex; align-items: center; gap: 10px; }
  header h1 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: var(--fg);
  }
  .header-right { display: flex; align-items: center; gap: 8px; }
  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--muted); flex-shrink: 0;
    transition: background 0.3s;
  }
  .status-dot.ready { background: var(--ok); }
  .status-dot.syncing { background: var(--accent); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .icon-btn {
    background: var(--panel);
    border: 1px solid var(--border);
    color: var(--fg);
    border-radius: 10px;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 17px; flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
    box-shadow: var(--shadow);
  }
  .icon-btn:active { transform: scale(0.94); }

  /* ── CARDS ── */
  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 10px;
    box-shadow: var(--shadow);
  }
  .card-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .req-star { color: var(--accent); }
  .opt-tag { font-size: 11px; color: var(--muted); text-transform: none; letter-spacing: 0; font-weight: 400; }

  /* ── AMOUNT ── */
  .amount-row { display: flex; align-items: center; gap: 8px; }
  .currency { font-size: 26px; color: var(--muted); font-weight: 700; line-height: 1; }
  .amount-input {
    flex: 1; border: none; background: transparent;
    color: var(--fg); font-size: 44px; font-weight: 800;
    font-variant-numeric: tabular-nums;
    outline: none; width: 100%; padding: 4px 0;
    letter-spacing: -1px;
  }
  .amount-input::placeholder { color: var(--panel-3); }

  /* ── TEXT INPUTS ── */
  input[type="text"], input[type="date"], input[type="time"] {
    width: 100%;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--fg);
    border-radius: 9px;
    padding: 11px 13px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.15s;
    -webkit-appearance: none;
  }
  input[type="text"]:focus,
  input[type="date"]:focus,
  input[type="time"]:focus { border-color: var(--accent); }
  input[type="time"] { width: auto; flex-shrink: 0; min-width: 120px; }
  input::placeholder { color: var(--muted); }

  /* ── CHIPS ── */
  .chips {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-bottom: 10px; min-height: 32px;
  }
  .chip {
    padding: 6px 13px; border-radius: 999px;
    background: var(--panel-2); color: var(--fg-sub);
    font-size: 13px; border: 1px solid var(--border);
    cursor: pointer; user-select: none; white-space: nowrap;
    transition: all 0.15s; font-weight: 500;
  }
  .chip:active { transform: scale(0.95); }
  .chip.selected {
    background: var(--accent); color: var(--accent-fg);
    border-color: var(--accent); font-weight: 600;
  }
  .chip.suggest { border-style: dashed; }
  .chip .x { margin-left: 6px; opacity: 0.7; }

  /* ── SEARCH / DROPDOWN ── */
  .search-row { position: relative; }
  .dropdown {
    position: absolute; left: 0; right: 0; top: calc(100% + 4px);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    max-height: 200px; overflow-y: auto;
    z-index: 10;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  }
  .dropdown-item {
    padding: 11px 14px; font-size: 15px; cursor: pointer;
    border-bottom: 1px solid var(--border);
  }
  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:active, .dropdown-item.active { background: var(--accent-dim); }
  .dropdown-item.create { color: var(--accent); font-weight: 600; }

  /* ── DATE ROW ── */
  .row-compact { display: flex; gap: 8px; align-items: center; }
  .row-compact input[type="date"] { flex: 1; }

  /* ── SAVE BUTTON ── */
  .save-btn {
    width: 100%; padding: 17px; border: none;
    background: var(--accent); color: var(--accent-fg);
    font-weight: 700; font-size: 17px;
    border-radius: var(--radius); cursor: pointer;
    margin-top: 4px; touch-action: manipulation;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 16px rgba(235,87,87,0.35);
    transition: opacity 0.15s, transform 0.1s;
  }
  .save-btn:active { transform: translateY(1px); opacity: 0.9; }
  .save-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

  .tiny { font-size: 12px; color: var(--muted); text-align: center; margin-top: 10px; }

  /* ── TOAST ── */
  .toast {
    position: fixed;
    left: 16px; right: 16px;
    bottom: max(16px, calc(env(safe-area-inset-bottom) + 16px));
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 13px 16px; border-radius: 12px;
    font-size: 14px; font-weight: 500; text-align: center;
    transform: translateY(120%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    z-index: 200;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .toast.show { transform: translateY(0); }
  .toast.ok { color: var(--ok); }
  .toast.err { color: var(--danger); }

  /* ── SIDE PANEL OVERLAY ── */
  .side-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 50; opacity: 0;
    transition: opacity 0.28s;
    pointer-events: none;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  .side-overlay.open { opacity: 1; pointer-events: all; }

  /* ── SIDE PANEL ── */
  .side-panel {
    position: fixed; top: 0; right: 0;
    width: min(360px, 94vw); height: 100%;
    background: var(--panel);
    border-left: 1px solid var(--border);
    z-index: 60;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -4px 0 24px rgba(0,0,0,0.25);
  }
  .side-panel.open { transform: translateX(0); }

  /* DYNAMIC ISLAND / NOTCH FIX */
  .side-hdr {
    padding:
      max(20px, env(safe-area-inset-top))
      16px
      14px;
    border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: flex-end;
    background: var(--panel-2);
    flex-shrink: 0;
  }
  .side-hdr-title { font-weight: 700; font-size: 16px; color: var(--fg); }
  .side-hdr-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .side-hdr-actions { display: flex; align-items: center; gap: 8px; }

  .close-btn {
    background: var(--panel); border: 1px solid var(--border);
    color: var(--fg); border-radius: 8px;
    width: 30px; height: 30px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }

  .refresh-btn {
    background: var(--panel); border: 1px solid var(--border);
    color: var(--accent); border-radius: 8px;
    padding: 5px 11px; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: opacity .2s;
  }
  .refresh-btn:disabled { opacity: .4; cursor: not-allowed; }
  .refresh-btn .spin-sm {
    width: 12px; height: 12px;
    border: 2px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: spin .6s linear infinite; display: none;
  }
  .refresh-btn.loading .spin-sm { display: block; }
  .refresh-btn.loading .r-icon  { display: none; }

  /* ── PERIOD TABS ── */
  .period-tabs {
    display: flex; padding: 10px 12px; gap: 6px;
    border-bottom: 1px solid var(--border); flex-shrink: 0;
    background: var(--panel);
  }
  .ptab {
    flex: 1; padding: 8px 4px; border: 1px solid var(--border);
    border-radius: 8px; background: transparent;
    color: var(--muted); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .ptab.active { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }

  /* ── SUMMARY BAR ── */
  .side-summary {
    padding: 12px 16px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid var(--border);
    background: var(--panel-2); flex-shrink: 0;
  }
  .side-summary-lbl { font-size: 12px; color: var(--muted); font-weight: 500; }
  .side-summary-cnt { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .side-total { font-size: 24px; font-weight: 800; color: var(--accent); letter-spacing: -0.5px; }

  .cache-badge {
    font-size: 10px; color: var(--muted);
    padding: 3px 8px; border-radius: 100px;
    background: var(--panel-2); border: 1px solid var(--border);
    margin-top: 4px; display: inline-block;
  }
  .cache-badge.live { color: var(--ok); border-color: var(--ok); background: rgba(69,217,142,.08); }

  /* ── EXPENSE LIST ── */
  .side-list { flex: 1; overflow-y: auto; padding: 10px 12px; }
  .egrp-hdr {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.8px; color: var(--muted); padding: 8px 4px 5px;
  }

  /* ── EXPENSE CARD ── */
  .ecard {
    background: var(--panel-2); border: 1px solid var(--border);
    border-radius: 11px; padding: 10px 12px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 10px;
    transition: opacity 0.3s;
  }
  .ecard-ico {
    width: 36px; height: 36px; border-radius: 9px;
    background: var(--accent-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }
  .ecard-det { flex: 1; min-width: 0; }
  .ecard-name {
    font-size: 13px; font-weight: 600; color: var(--fg);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ecard-meta { display: flex; gap: 4px; margin-top: 3px; flex-wrap: wrap; }
  .echip {
    font-size: 10px; padding: 2px 7px; border-radius: 100px;
    font-weight: 600; white-space: nowrap;
  }
  .echip-cat { background: rgba(255,115,105,0.14); color: var(--accent); }
  .echip-sub { background: var(--panel-3); color: var(--muted); }
  .echip-acc { background: rgba(69,217,142,0.12); color: var(--ok); }
  .ecard-date { font-size: 10px; color: var(--muted); margin-top: 3px; }

  .ecard-right { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .ecard-amt { font-size: 15px; font-weight: 800; color: var(--fg); }

  /* ── ALWAYS-VISIBLE DELETE BUTTON ── */
  .del-btn {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(244,106,106,0.12);
    border: 1px solid rgba(244,106,106,0.25);
    color: var(--danger); font-size: 13px;
    cursor: pointer; flex-shrink: 0;
    transition: background 0.15s, transform 0.1s;
    line-height: 1;
  }
  .del-btn:active { transform: scale(0.92); background: rgba(244,106,106,0.25); }

  /* inline confirm row */
  .del-confirm {
    display: none; align-items: center; gap: 5px;
    font-size: 11px; color: var(--danger); font-weight: 600;
    white-space: nowrap;
  }
  .del-confirm.on { display: flex; }
  .del-confirm-btns { display: flex; gap: 4px; }
  .del-confirm button {
    padding: 4px 9px; border-radius: 6px; font-size: 11px;
    font-weight: 700; cursor: pointer; border: none;
  }
  .del-yes { background: var(--danger); color: #fff; }
  .del-no  { background: var(--panel-3); color: var(--fg); }
  .ecard.deleting { opacity: .3; pointer-events: none; }

  /* ── EMPTY / LOADING STATES ── */
  .side-state { text-align: center; padding: 40px 16px; color: var(--muted); font-size: 14px; }
  .side-state-ico { font-size: 40px; margin-bottom: 10px; }
  .spin {
    width: 26px; height: 26px;
    border: 3px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.7s linear infinite;
    margin: 0 auto 10px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .hidden { display: none !important; }
</style>
</head>
<body>

<!-- SIDE PANEL OVERLAY -->
<div id="sideOverlay" class="side-overlay hidden"></div>

<!-- SIDE PANEL -->
<div id="sidePanel" class="side-panel">
  <div class="side-hdr">
    <div>
      <div class="side-hdr-title">Expense History</div>
      <div class="side-hdr-sub">Notion Finance Tracker</div>
    </div>
    <div class="side-hdr-actions">
      <button class="refresh-btn" id="refreshBtn" title="Hard refresh from Notion">
        <span class="spin-sm"></span>
        <span class="r-icon">↻</span> Sync
      </button>
      <button class="close-btn" id="closeBtn">✕</button>
    </div>
  </div>
  <div class="period-tabs">
    <button class="ptab active" data-period="today">Today</button>
    <button class="ptab" data-period="week">This Week</button>
    <button class="ptab" data-period="month">This Month</button>
  </div>
  <div class="side-summary">
    <div>
      <div class="side-summary-lbl">Total Spent</div>
      <div class="side-summary-cnt" id="sideCnt">—</div>
    </div>
    <div style="text-align:right">
      <div class="side-total" id="sideTotal">₹—</div>
      <span class="cache-badge" id="cacheBadge" style="display:none"></span>
    </div>
  </div>
  <div class="side-list" id="sideList">
    <div class="side-state"><div class="spin"></div>Loading…</div>
  </div>
</div>

<!-- MAIN APP -->
<div id="app">
  <header>
    <div class="header-left">
      <button class="icon-btn" id="menuBtn" title="History">☰</button>
      <h1>Add Expense</h1>
    </div>
    <div class="header-right">
      <div class="status-dot" id="statusDot"></div>
      <button class="icon-btn" id="themeBtn" title="Toggle theme">☀️</button>
    </div>
  </header>

  <!-- Amount -->
  <div class="card">
    <div class="card-label">Amount <span class="req-star">*</span></div>
    <div class="amount-row">
      <span class="currency">₹</span>
      <input
        id="amount" class="amount-input"
        type="text" inputmode="decimal"
        pattern="[0-9]*\\.?[0-9]*"
        placeholder="0" autocomplete="off"
      />
    </div>
  </div>

  <!-- Expense name -->
  <div class="card">
    <div class="card-label">Expense name <span class="opt-tag">(optional)</span></div>
    <input id="expense" type="text" placeholder="e.g. Swiggy lunch" autocomplete="off" />
  </div>

  <!-- Category -->
  <div class="card">
    <div class="card-label">Category <span class="req-star">*</span></div>
    <div class="chips" id="catChips"></div>
    <div class="search-row">
      <input id="catSearch" type="text" placeholder="Search or create…" autocomplete="off" />
      <div id="catDropdown" class="dropdown hidden"></div>
    </div>
  </div>

  <!-- Subcategory -->
  <div class="card">
    <div class="card-label">Subcategory <span class="req-star">*</span></div>
    <div class="chips" id="subChips"></div>
    <div class="search-row">
      <input id="subSearch" type="text" placeholder="Search or create…" autocomplete="off" />
      <div id="subDropdown" class="dropdown hidden"></div>
    </div>
  </div>

  <!-- Account -->
  <div class="card">
    <div class="card-label">Account <span class="req-star">*</span></div>
    <div class="chips" id="acctChips"></div>
    <div class="search-row">
      <input id="acctSearch" type="text" placeholder="Search or create…" autocomplete="off" />
      <div id="acctDropdown" class="dropdown hidden"></div>
    </div>
  </div>

  <!-- Date & Time -->
  <div class="card">
    <div class="card-label">Date &amp; Time</div>
    <div class="row-compact">
      <input id="date" type="date" />
      <input id="time" type="time" />
    </div>
  </div>

  <button id="saveBtn" class="save-btn">Save Expense</button>
  <div class="tiny" id="lastSaved">&nbsp;</div>
</div>

<div class="toast" id="toast"></div>

<script>
(() => {
  const LS_CACHE  = "notion_expense_cache_v1";
  const LS_THEME  = "notion_expense_theme_v1";
  const $ = (id) => document.getElementById(id);

  const CAT_EMOJI = {
    'Food':'🍔','Transport':'🚗','Shopping':'🛍️','Entertainment':'🎬',
    'Health':'🏥','Household':'🏠','Education':'📚','Investment':'📈',
    'Beauty':'💄','Apparel':'👔','Subscription':'🔄','Social Life':'👥',
    'Gift':'🎁','Holiday':'🌴','Culture':'🎭','Miscellaneous':'📦',
    'Money Transfer':'💸','Salary':'💰','Other':'❓',
  };

  const state = {
    data: null,
    chosen: {
      categoryId: null, categoryName: null,
      subcategoryId: null, subcategoryName: null,
      accountId: null, accountName: null,
    },
  };

  // ── theme ──
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
    $("themeColorMeta").content = theme === "dark" ? "#191919" : "#ffffff";
    localStorage.setItem(LS_THEME, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
    $("themeBtn").onclick = () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    };
  }

  // ── helpers ──
  function toast(msg, kind) {
    const el = $("toast");
    el.textContent = msg;
    el.className = "toast show " + (kind || "");
    setTimeout(() => (el.className = "toast"), 2800);
  }

  function setStatus(state) {
    const dot = $("statusDot");
    dot.className = "status-dot " + state;
  }

  async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    const resp = await fetch(path, { ...opts, headers });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const err = new Error(data.error || ("HTTP " + resp.status));
      err.data = data; err.status = resp.status;
      throw err;
    }
    return data;
  }

  // ── bootstrap ──
  async function bootstrap(fromCache) {
    if (fromCache) {
      const cached = localStorage.getItem(LS_CACHE);
      if (cached) {
        try { state.data = JSON.parse(cached); renderAll(); setStatus("ready"); } catch {}
      }
    }
    try {
      setStatus("syncing");
      const data = await api("/api/bootstrap");
      state.data = data;
      localStorage.setItem(LS_CACHE, JSON.stringify(data));
      renderAll();
      setStatus("ready");
    } catch (err) {
      setStatus("");
      if (!state.data) toast("Failed to load: " + err.message, "err");
    }
  }

  // ── chips ──
  function byId(arr, id) { return arr.find((x) => x.id === id); }

  function renderAll() {
    renderChips("cat",  "categoryId",    "categoryName",    state.data.categories,    state.data.recent.categories);
    renderChips("sub",  "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
    renderChips("acct", "accountId",     "accountName",     state.data.accounts,      state.data.recent.accounts);
  }

  function suggestedSubs() {
    const selCat = state.chosen.categoryId;
    if (!selCat) return state.data.recent.subcategories;
    const map = state.data.subcatByCategory?.[selCat];
    if (!map) return state.data.recent.subcategories;
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,5).map(([id]) => id);
  }

  function renderChips(prefix, idField, nameField, fullList, recentIds) {
    const el = $(prefix + "Chips");
    el.innerHTML = "";
    if (state.chosen[idField] || state.chosen[nameField]) {
      const chip = document.createElement("div");
      chip.className = "chip selected";
      const name = state.chosen[idField]
        ? (byId(fullList, state.chosen[idField])?.name || state.chosen[nameField] || "")
        : state.chosen[nameField];
      chip.innerHTML = name + '<span class="x">✕</span>';
      chip.onclick = () => {
        state.chosen[idField] = null;
        state.chosen[nameField] = null;
        if (idField === "categoryId") renderChips("sub","subcategoryId","subcategoryName",state.data.subcategories,suggestedSubs());
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
      el.appendChild(chip);
      return;
    }
    for (const id of recentIds || []) {
      const item = byId(fullList, id);
      if (!item) continue;
      const chip = document.createElement("div");
      chip.className = "chip suggest";
      chip.textContent = item.name;
      chip.onclick = () => {
        state.chosen[idField] = item.id;
        state.chosen[nameField] = item.name;
        if (idField === "categoryId") renderChips("sub","subcategoryId","subcategoryName",state.data.subcategories,suggestedSubs());
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
      el.appendChild(chip);
    }
  }

  function wireSearch(prefix, idField, nameField, getList) {
    const input = $(prefix + "Search");
    const dd    = $(prefix + "Dropdown");
    function close() { dd.classList.add("hidden"); dd.innerHTML = ""; }
    function open(items, query) {
      dd.innerHTML = "";
      const q = (query || "").trim().toLowerCase();
      const matches = items.filter((it) => it.name.toLowerCase().includes(q)).slice(0, 8);
      for (const it of matches) {
        const row = document.createElement("div");
        row.className = "dropdown-item";
        row.textContent = it.name;
        row.onclick = () => {
          state.chosen[idField] = it.id;
          state.chosen[nameField] = it.name;
          input.value = ""; close();
          if (idField === "categoryId") renderChips("sub","subcategoryId","subcategoryName",state.data.subcategories,suggestedSubs());
          renderChips(prefix, idField, nameField, items, recentFor(prefix));
        };
        dd.appendChild(row);
      }
      const exact = matches.some((m) => m.name.toLowerCase() === q);
      if (q && !exact) {
        const row = document.createElement("div");
        row.className = "dropdown-item create";
        row.textContent = '+ Create "' + query.trim() + '"';
        row.onclick = () => {
          state.chosen[idField] = null;
          state.chosen[nameField] = query.trim();
          input.value = ""; close();
          renderChips(prefix, idField, nameField, items, recentFor(prefix));
        };
        dd.appendChild(row);
      }
      if (!dd.children.length) close(); else dd.classList.remove("hidden");
    }
    input.addEventListener("input",  () => open(getList(), input.value));
    input.addEventListener("focus",  () => open(getList(), input.value));
    input.addEventListener("blur",   () => setTimeout(close, 150));
  }

  function recentFor(prefix) {
    if (prefix === "cat")  return state.data.recent.categories;
    if (prefix === "sub")  return suggestedSubs();
    if (prefix === "acct") return state.data.recent.accounts;
    return [];
  }

  // ── save ──
  async function save() {
    const amountStr = $("amount").value.trim();
    const expense   = $("expense").value.trim();
    const dateVal   = $("date").value;
    const timeVal   = $("time").value;

    const amount = parseFloat(amountStr);
    if (!amountStr || isNaN(amount) || amount <= 0) return toast("Enter a valid amount", "err");
    if (!state.chosen.categoryId    && !state.chosen.categoryName)    return toast("Select a category", "err");
    if (!state.chosen.subcategoryId && !state.chosen.subcategoryName) return toast("Select a subcategory", "err");
    if (!state.chosen.accountId     && !state.chosen.accountName)     return toast("Select an account", "err");

    let dateStr = dateVal || null;
    if (dateStr && timeVal) dateStr = dateStr + "T" + timeVal + ":00";

    $("saveBtn").disabled = true;
    $("saveBtn").textContent = "Saving…";

    const payload = {
      expense, amount, date: dateStr,
      categoryId:      state.chosen.categoryId,
      categoryName:    state.chosen.categoryName,
      subcategoryId:   state.chosen.subcategoryId,
      subcategoryName: state.chosen.subcategoryName,
      accountId:       state.chosen.accountId,
      accountName:     state.chosen.accountName,
    };

    try {
      await api("/api/expense", { method: "POST", body: JSON.stringify(payload) });
      toast("Saved ✓", "ok");
      $("lastSaved").textContent = "Last saved at " + new Date().toLocaleTimeString();
      $("amount").value  = "";
      $("expense").value = "";
      $("amount").focus();
      bootstrap(false);
    } catch (err) {
      toast("Save failed: " + err.message, "err");
    } finally {
      $("saveBtn").disabled = false;
      $("saveBtn").textContent = "Save Expense";
    }
  }

  // ── side panel ──
  let sidePeriod  = "today";
  let sideLoading = false;

  function openSide() {
    $("sideOverlay").classList.remove("hidden");
    requestAnimationFrame(() => {
      $("sideOverlay").classList.add("open");
      $("sidePanel").classList.add("open");
    });
    loadSideExpenses(sidePeriod);
  }

  function closeSide() {
    $("sideOverlay").classList.remove("open");
    $("sidePanel").classList.remove("open");
    setTimeout(() => $("sideOverlay").classList.add("hidden"), 320);
  }

  function fmtDate(dateStr) {
    if (!dateStr) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const now = new Date();
    const todayStr = now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate());
    const yest = new Date(now); yest.setDate(now.getDate()-1);
    const yesterStr = yest.getFullYear()+"-"+pad(yest.getMonth()+1)+"-"+pad(yest.getDate());
    const d = dateStr.split("T")[0];
    if (d === todayStr)  return "Today";
    if (d === yesterStr) return "Yesterday";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day:"numeric", month:"short" });
  }

  function fmtTime(dateStr) {
    if (!dateStr || !dateStr.includes("T")) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
  }

  async function loadSideExpenses(period, hardRefresh = false) {
    if (sideLoading) return;
    sideLoading = true;
    const btn = $("refreshBtn");
    btn.disabled = true; btn.classList.add("loading");
    $("sideList").innerHTML = '<div class="side-state"><div class="spin"></div>Loading…</div>';
    $("sideTotal").textContent = "₹—";
    $("sideCnt").textContent   = "—";
    $("cacheBadge").style.display = "none";
    try {
      const data = await api("/api/expenses?period=" + period + (hardRefresh ? "&refresh=1" : ""));
      renderSideExpenses(data);
    } catch {
      $("sideList").innerHTML = '<div class="side-state"><div class="side-state-ico">⚠️</div>Failed to load expenses</div>';
    } finally {
      sideLoading = false;
      btn.disabled = false; btn.classList.remove("loading");
    }
  }

  function renderSideExpenses({ expenses, total, cached, cachedAt }) {
    $("sideTotal").textContent = "₹" + (total || 0).toLocaleString("en-IN");
    $("sideCnt").textContent   = expenses.length + " expense" + (expenses.length !== 1 ? "s" : "");

    const badge = $("cacheBadge");
    if (cached && cachedAt) {
      const mins = Math.round((Date.now() - cachedAt) / 60000);
      badge.textContent = mins < 1 ? "cached · just now" : \`cached · \${mins}m ago\`;
      badge.className   = "cache-badge";
    } else {
      badge.textContent = "live";
      badge.className   = "cache-badge live";
    }
    badge.style.display = "inline-block";

    if (!expenses.length) {
      $("sideList").innerHTML = '<div class="side-state"><div class="side-state-ico">💸</div>No expenses yet</div>';
      return;
    }

    const groups = {};
    expenses.forEach((e) => {
      const dk = (e.date || "").split("T")[0];
      (groups[dk] = groups[dk] || []).push(e);
    });

    const list = $("sideList");
    list.innerHTML = "";

    Object.keys(groups).sort((a,b) => b.localeCompare(a)).forEach((dk) => {
      const dayTotal = groups[dk].reduce((s,e) => s + e.amount, 0);
      const hdr = document.createElement("div");
      hdr.className = "egrp-hdr";
      hdr.textContent = fmtDate(dk) + "  ·  ₹" + dayTotal.toLocaleString("en-IN");
      list.appendChild(hdr);

      groups[dk].forEach((e) => {
        const emoji   = CAT_EMOJI[e.category] || "💰";
        const name    = e.name || e.subcategory || e.category || "Expense";
        const timeStr = e.date.includes("T") ? " · " + fmtTime(e.date) : "";

        const card = document.createElement("div");
        card.className = "ecard";
        card.dataset.id = e.id;
        card.innerHTML = \`
          <div class="ecard-ico">\${emoji}</div>
          <div class="ecard-det">
            <div class="ecard-name">\${name}</div>
            <div class="ecard-meta">
              \${e.category    ? \`<span class="echip echip-cat">\${e.category}</span>\`    : ""}
              \${e.subcategory ? \`<span class="echip echip-sub">\${e.subcategory}</span>\` : ""}
              \${e.account     ? \`<span class="echip echip-acc">\${e.account}</span>\`     : ""}
            </div>
            <div class="ecard-date">\${fmtDate(e.date)}\${timeStr}</div>
          </div>
          <div class="ecard-right">
            <div style="display:flex;align-items:center;gap:6px">
              <div class="ecard-amt">₹\${(e.amount || 0).toLocaleString("en-IN")}</div>
              <button class="del-btn" title="Delete expense">🗑</button>
            </div>
            <div class="del-confirm">
              Delete?
              <div class="del-confirm-btns">
                <button class="del-yes">Yes</button>
                <button class="del-no">No</button>
              </div>
            </div>
          </div>\`;

        const delBtn  = card.querySelector(".del-btn");
        const confirm = card.querySelector(".del-confirm");
        const yesBtn  = card.querySelector(".del-yes");
        const noBtn   = card.querySelector(".del-no");

        delBtn.addEventListener("click", () => {
          delBtn.style.display = "none";
          confirm.classList.add("on");
        });
        noBtn.addEventListener("click", () => {
          confirm.classList.remove("on");
          delBtn.style.display = "";
        });
        yesBtn.addEventListener("click", async () => {
          card.classList.add("deleting");
          try {
            await api("/api/expense/" + e.id, { method: "DELETE" });
            card.style.transition = "max-height .3s, opacity .3s, margin .3s, padding .3s";
            card.style.maxHeight  = card.offsetHeight + "px";
            card.style.overflow   = "hidden";
            requestAnimationFrame(() => {
              card.style.maxHeight    = "0";
              card.style.opacity      = "0";
              card.style.marginBottom = "0";
              card.style.paddingTop   = "0";
              card.style.paddingBottom = "0";
            });
            setTimeout(() => {
              card.remove();
              const allAmts = [...list.querySelectorAll(".ecard-amt")].map(
                (el) => parseFloat(el.textContent.replace(/[₹,]/g, "")) || 0
              );
              const newTotal = allAmts.reduce((s, a) => s + a, 0);
              $("sideTotal").textContent = "₹" + newTotal.toLocaleString("en-IN");
              const cnt = list.querySelectorAll(".ecard[data-id]").length;
              $("sideCnt").textContent = cnt + " expense" + (cnt !== 1 ? "s" : "");
              toast("Deleted ✓", "ok");
            }, 320);
          } catch (err) {
            card.classList.remove("deleting");
            confirm.classList.remove("on");
            delBtn.style.display = "";
            toast("Delete failed: " + err.message, "err");
          }
        });

        list.appendChild(card);
      });
    });
  }

  // ── init ──
  function init() {
    initTheme();

    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    $("date").value = d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate());
    $("time").value = pad(d.getHours()) + ":" + pad(d.getMinutes());

    wireSearch("cat",  "categoryId",    "categoryName",    () => state.data?.categories    || []);
    wireSearch("sub",  "subcategoryId", "subcategoryName", () => state.data?.subcategories || []);
    wireSearch("acct", "accountId",     "accountName",     () => state.data?.accounts      || []);

    $("saveBtn").onclick = save;
    $("amount").addEventListener("keydown", (e) => { if (e.key === "Enter") $("expense").focus(); });
    $("expense").addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });

    $("menuBtn").onclick     = openSide;
    $("closeBtn").onclick    = closeSide;
    $("sideOverlay").onclick = closeSide;
    $("refreshBtn").onclick  = () => loadSideExpenses(sidePeriod, true);

    document.querySelectorAll(".ptab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".ptab").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        sidePeriod = btn.dataset.period;
        loadSideExpenses(sidePeriod, false);
      });
    });

    bootstrap(true);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
</script>
</body>
</html>`;
