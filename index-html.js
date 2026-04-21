// HTML + CSS + JS for the expense form. Served at GET /.
// Exported as a string so the Worker can ship as a single bundle.

export const HTML = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#0b0b0f" />
<title>Add Expense</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%92%B8%3C/text%3E%3C/svg%3E" />
<style>
  :root {
    --bg: #0b0b0f;
    --panel: #14141b;
    --panel-2: #1c1c26;
    --fg: #f2f2f5;
    --muted: #8b8b96;
    --accent: #ff7a59;
    --accent-dim: #ff7a5922;
    --danger: #ff4d4f;
    --ok: #3ddc97;
    --border: #2a2a36;
    --radius: 14px;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f7f7f8;
      --panel: #ffffff;
      --panel-2: #f1f1f4;
      --fg: #111;
      --muted: #6b6b75;
      --border: #e4e4ea;
    }
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  body {
    padding: env(safe-area-inset-top) 16px calc(env(safe-area-inset-bottom) + 16px);
    max-width: 560px;
    margin: 0 auto;
  }
  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 0 8px;
  }
  header h1 {
    font-size: 17px;
    margin: 0;
    font-weight: 600;
  }
  header .status {
    font-size: 12px;
    color: var(--muted);
  }
  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
    margin-bottom: 12px;
  }
  label {
    display: block;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .amount-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .amount-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--fg);
    font-size: 40px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    outline: none;
    width: 100%;
    padding: 4px 0;
  }
  .amount-input::placeholder { color: var(--border); }
  .currency {
    font-size: 22px;
    color: var(--muted);
    font-weight: 600;
  }
  input[type="text"], input[type="date"] {
    width: 100%;
    border: 1px solid var(--border);
    background: var(--panel-2);
    color: var(--fg);
    border-radius: 10px;
    padding: 12px;
    font-size: 16px;
    outline: none;
  }
  input[type="text"]:focus, input[type="date"]:focus {
    border-color: var(--accent);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
    min-height: 28px;
  }
  .chip {
    padding: 7px 12px;
    border-radius: 999px;
    background: var(--panel-2);
    color: var(--fg);
    font-size: 13px;
    border: 1px solid var(--border);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  .chip.selected {
    background: var(--accent);
    color: #111;
    border-color: var(--accent);
    font-weight: 600;
  }
  .chip.suggest {
    border-style: dashed;
    opacity: 0.85;
  }
  .chip .x {
    margin-left: 6px;
    opacity: 0.6;
  }
  .search-row {
    position: relative;
    margin-top: 8px;
  }
  .dropdown {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 4px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    max-height: 220px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }
  .dropdown-item {
    padding: 11px 12px;
    font-size: 15px;
    cursor: pointer;
    border-bottom: 1px solid var(--border);
  }
  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:hover, .dropdown-item.active {
    background: var(--accent-dim);
  }
  .dropdown-item.create {
    color: var(--accent);
    font-weight: 600;
  }
  .row-compact {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .row-compact input[type="date"] {
    flex: 1;
  }
  .btn {
    width: 100%;
    padding: 16px;
    border: none;
    background: var(--accent);
    color: #111;
    font-weight: 700;
    font-size: 17px;
    border-radius: var(--radius);
    cursor: pointer;
    margin-top: 6px;
    touch-action: manipulation;
  }
  .btn:active { transform: translateY(1px); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .toast {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: calc(env(safe-area-inset-bottom) + 16px);
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 14px;
    text-align: center;
    transform: translateY(120%);
    transition: transform 0.25s;
    z-index: 100;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }
  .toast.show { transform: translateY(0); }
  .toast.ok { color: var(--ok); }
  .toast.err { color: var(--danger); }
  .tiny {
    font-size: 12px;
    color: var(--muted);
    text-align: center;
    margin-top: 10px;
  }
  .auth-gate {
    padding: 24px 16px;
    text-align: center;
  }
  .hidden { display: none !important; }
</style>
</head>
<body>

<div id="authGate" class="auth-gate hidden">
  <h2>Unlock</h2>
  <p class="tiny">This form is private. Paste the shared secret to use it.</p>
  <input id="secretInput" type="text" placeholder="Shared secret" autocomplete="off" />
  <button class="btn" id="unlockBtn">Unlock</button>
</div>

<div id="app" class="hidden">
  <header>
    <h1>Add Expense</h1>
    <div class="status" id="statusLabel">…</div>
  </header>

  <!-- Amount + expense name -->
  <div class="card">
    <label for="amount">Amount</label>
    <div class="amount-row">
      <span class="currency">₹</span>
      <input
        id="amount"
        class="amount-input"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\\.?[0-9]*"
        placeholder="0"
        autocomplete="off"
      />
    </div>
  </div>

  <div class="card">
    <label for="expense">Expense</label>
    <input id="expense" type="text" placeholder="e.g. Swiggy lunch" autocomplete="off" />
  </div>

  <!-- Category -->
  <div class="card">
    <label>Category</label>
    <div class="chips" id="catChips"></div>
    <div class="search-row">
      <input id="catSearch" type="text" placeholder="Search or create…" autocomplete="off" />
      <div id="catDropdown" class="dropdown hidden"></div>
    </div>
  </div>

  <!-- Subcategory -->
  <div class="card">
    <label>Subcategory</label>
    <div class="chips" id="subChips"></div>
    <div class="search-row">
      <input id="subSearch" type="text" placeholder="Search or create…" autocomplete="off" />
      <div id="subDropdown" class="dropdown hidden"></div>
    </div>
  </div>

  <!-- Account -->
  <div class="card">
    <label>Account</label>
    <div class="chips" id="acctChips"></div>
    <div class="search-row">
      <input id="acctSearch" type="text" placeholder="Search or create…" autocomplete="off" />
      <div id="acctDropdown" class="dropdown hidden"></div>
    </div>
  </div>

  <!-- Date -->
  <div class="card">
    <label>Date</label>
    <div class="row-compact">
      <input id="date" type="date" />
    </div>
  </div>

  <button id="saveBtn" class="btn">Save expense</button>
  <div class="tiny" id="lastSaved">&nbsp;</div>
</div>

<div class="toast" id="toast"></div>

<script>
(() => {
  const LS_SECRET = "notion_expense_secret_v1";
  const LS_CACHE = "notion_expense_cache_v1";

  const $ = (id) => document.getElementById(id);
  const state = {
    data: null,              // bootstrap payload
    chosen: {
      categoryId: null, categoryName: null,
      subcategoryId: null, subcategoryName: null,
      accountId: null, accountName: null,
    },
    secret: null,
  };

  function toast(msg, kind) {
    const el = $("toast");
    el.textContent = msg;
    el.className = "toast show " + (kind || "");
    setTimeout(() => (el.className = "toast"), 2600);
  }

  function setStatus(txt) { $("statusLabel").textContent = txt; }

  // ---- secret bootstrapping ----
  function getSecret() {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("k");
    if (fromUrl) {
      localStorage.setItem(LS_SECRET, fromUrl);
      url.searchParams.delete("k");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : "") + url.hash);
      return fromUrl;
    }
    return localStorage.getItem(LS_SECRET);
  }

  async function api(path, opts = {}) {
    const headers = { "X-Auth": state.secret, "Content-Type": "application/json", ...(opts.headers || {}) };
    const resp = await fetch(path, { ...opts, headers });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const err = new Error(data.error || ("HTTP " + resp.status));
      err.data = data;
      err.status = resp.status;
      throw err;
    }
    return data;
  }

  // ---- bootstrap ----
  async function bootstrap(fromCache) {
    if (fromCache) {
      const cached = localStorage.getItem(LS_CACHE);
      if (cached) {
        try {
          state.data = JSON.parse(cached);
          renderAll();
          setStatus("cached");
        } catch {}
      }
    }
    try {
      setStatus("syncing…");
      const data = await api("/api/bootstrap");
      state.data = data;
      localStorage.setItem(LS_CACHE, JSON.stringify(data));
      renderAll();
      setStatus("ready");
    } catch (err) {
      if (err.status === 401) {
        showAuthGate();
        return;
      }
      setStatus("offline");
      if (!state.data) toast("Failed to load: " + err.message, "err");
    }
  }

  function showAuthGate() {
    $("authGate").classList.remove("hidden");
    $("app").classList.add("hidden");
    $("secretInput").focus();
  }
  function hideAuthGate() {
    $("authGate").classList.add("hidden");
    $("app").classList.remove("hidden");
  }

  // ---- rendering ----
  function byId(arr, id) { return arr.find((x) => x.id === id); }

  function renderAll() {
    renderChips("cat", "categoryId", "categoryName", state.data.categories, state.data.recent.categories);
    renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
    renderChips("acct", "accountId", "accountName", state.data.accounts, state.data.recent.accounts);
  }

  function suggestedSubs() {
    // If a category is chosen, rank subs by frequency with that category.
    const selCat = state.chosen.categoryId;
    if (!selCat) return state.data.recent.subcategories;
    const map = state.data.subcatByCategory?.[selCat];
    if (!map) return state.data.recent.subcategories;
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);
  }

  function renderChips(prefix, idField, nameField, fullList, recentIds) {
    const el = $(prefix + "Chips");
    el.innerHTML = "";

    // Chosen chip (if a custom name, or an existing item)
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
        if (idField === "categoryId") {
          // refresh sub suggestions
          renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
        }
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
      el.appendChild(chip);
      return; // When something is chosen, hide the suggestions — keeps UI tight
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
        if (idField === "categoryId") {
          renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
        }
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
      el.appendChild(chip);
    }
  }

  function wireSearch(prefix, idField, nameField, getList) {
    const input = $(prefix + "Search");
    const dd = $(prefix + "Dropdown");

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
          input.value = "";
          close();
          if (idField === "categoryId") {
            renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
          }
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
          input.value = "";
          close();
          renderChips(prefix, idField, nameField, items, recentFor(prefix));
        };
        dd.appendChild(row);
      }
      if (!dd.children.length) close();
      else dd.classList.remove("hidden");
    }

    input.addEventListener("input", () => open(getList(), input.value));
    input.addEventListener("focus", () => open(getList(), input.value));
    input.addEventListener("blur", () => setTimeout(close, 150));
  }

  function recentFor(prefix) {
    if (prefix === "cat") return state.data.recent.categories;
    if (prefix === "sub") return suggestedSubs();
    if (prefix === "acct") return state.data.recent.accounts;
    return [];
  }

  // ---- save ----
  async function save() {
    const amountStr = $("amount").value.trim();
    const expense = $("expense").value.trim();
    const dateVal = $("date").value;

    if (!expense) return toast("Add an expense name", "err");
    const amount = parseFloat(amountStr);
    if (!amountStr || isNaN(amount)) return toast("Enter an amount", "err");

    $("saveBtn").disabled = true;
    $("saveBtn").textContent = "Saving…";

    const payload = {
      expense,
      amount,
      date: dateVal || null,
      categoryId: state.chosen.categoryId,
      categoryName: state.chosen.categoryName,
      subcategoryId: state.chosen.subcategoryId,
      subcategoryName: state.chosen.subcategoryName,
      accountId: state.chosen.accountId,
      accountName: state.chosen.accountName,
    };

    try {
      const resp = await api("/api/expense", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast("Saved ✓", "ok");
      $("lastSaved").textContent = "Last saved at " + new Date().toLocaleTimeString();
      // Reset amount + name but keep category/account/subcategory for quick repeats
      $("amount").value = "";
      $("expense").value = "";
      $("amount").focus();
      // Re-bootstrap in background so recents update and any created items show up
      bootstrap(false);
    } catch (err) {
      toast("Save failed: " + err.message, "err");
    } finally {
      $("saveBtn").disabled = false;
      $("saveBtn").textContent = "Save expense";
    }
  }

  // ---- init ----
  function init() {
    // Default date = today
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    $("date").value = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());

    state.secret = getSecret();
    if (!state.secret) { showAuthGate(); }
    else { hideAuthGate(); }

    $("unlockBtn").onclick = () => {
      const v = $("secretInput").value.trim();
      if (!v) return;
      localStorage.setItem(LS_SECRET, v);
      state.secret = v;
      hideAuthGate();
      bootstrap(true);
    };
    $("secretInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") $("unlockBtn").click();
    });

    wireSearch("cat", "categoryId", "categoryName", () => state.data?.categories || []);
    wireSearch("sub", "subcategoryId", "subcategoryName", () => state.data?.subcategories || []);
    wireSearch("acct", "accountId", "accountName", () => state.data?.accounts || []);

    $("saveBtn").onclick = save;
    $("amount").addEventListener("keydown", (e) => {
      if (e.key === "Enter") $("expense").focus();
    });
    $("expense").addEventListener("keydown", (e) => {
      if (e.key === "Enter") save();
    });

    if (state.secret) bootstrap(true);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
</script>
</body>
</html>`;
