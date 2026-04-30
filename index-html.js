// HTML + CSS + JS for the expense app. Served at GET /.
// Exported as a string so the Worker can ship as a single bundle.

export const HTML = /* html */ `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="format-detection" content="telephone=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" id="themeColorMeta" content="#121212" />
<link rel="manifest" href="/manifest.json" />
<title>Expense Tracker</title>
<style>
  :root,
  [data-theme="dark"] {
    --bg: #111111;
    --bg-accent: radial-gradient(circle at top left, rgba(229, 117, 82, 0.16), transparent 34%),
                 radial-gradient(circle at top right, rgba(79, 184, 171, 0.1), transparent 26%);
    --surface: rgba(28, 28, 28, 0.9);
    --surface-2: rgba(33, 33, 33, 0.96);
    --surface-3: rgba(40, 40, 40, 0.98);
    --surface-4: rgba(255, 255, 255, 0.05);
    --fg: rgba(249, 246, 242, 0.94);
    --fg-soft: rgba(232, 227, 221, 0.76);
    --fg-muted: rgba(218, 212, 205, 0.5);
    --border: rgba(255, 255, 255, 0.07);
    --shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
    --shadow-soft: 0 8px 22px rgba(0, 0, 0, 0.16);
    --accent: #eb7c55;
    --accent-2: #53bdb0;
    --accent-3: #d8af54;
    --positive: #66c68c;
    --danger: #f46a6a;
    --pill: rgba(255, 255, 255, 0.055);
    --nav-bg: rgba(20, 20, 20, 0.88);
    --backdrop: rgba(5, 5, 5, 0.38);
  }

  [data-theme="light"] {
    --bg: #f6f1e9;
    --bg-accent: radial-gradient(circle at top left, rgba(235, 124, 85, 0.1), transparent 30%),
                 radial-gradient(circle at top right, rgba(83, 189, 176, 0.1), transparent 26%);
    --surface: rgba(255, 252, 247, 0.92);
    --surface-2: rgba(250, 245, 238, 0.97);
    --surface-3: rgba(242, 235, 226, 0.98);
    --surface-4: rgba(22, 20, 18, 0.04);
    --fg: #201c18;
    --fg-soft: #5f564c;
    --fg-muted: #8e8478;
    --border: rgba(31, 26, 23, 0.07);
    --shadow: 0 14px 32px rgba(67, 51, 36, 0.1);
    --shadow-soft: 0 8px 18px rgba(67, 51, 36, 0.06);
    --accent: #e87750;
    --accent-2: #1d9d90;
    --accent-3: #c49a3c;
    --positive: #2a9d68;
    --danger: #d64f4f;
    --pill: rgba(31, 26, 23, 0.045);
    --nav-bg: rgba(255, 252, 247, 0.92);
    --backdrop: rgba(255, 255, 255, 0.34);
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    min-height: 100%;
    background: var(--bg);
    color: var(--fg);
    font-family: "SF Pro Text", "SF Pro Display", "Segoe UI Variable Text", "Inter", "Avenir Next", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
    overscroll-behavior: none;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    touch-action: manipulation;
  }

  /* Prevent iOS from auto-zooming when focusing inputs (requires ≥16px) */
  input, select, textarea {
    font-size: 16px;
  }

  body {
    background-color: var(--bg);
    background-image: var(--bg-accent);
    background-attachment: fixed;
  }

  button, input {
    font: inherit;
  }

  button {
    color: inherit;
  }

  .app-shell {
    min-height: 100vh;
    min-height: 100dvh;
    position: relative;
    overflow-x: hidden;
    background: transparent;
  }

  .view {
    display: none;
    min-height: 100vh;
    min-height: 100dvh;
    padding:
      max(20px, env(safe-area-inset-top))
      18px
      calc(88px + env(safe-area-inset-bottom));
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
    background: transparent;
  }

  .view.active {
    display: block;
  }

  .view.add-view {
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    min-height: 44px;
  }

  .eyebrow {
    display: none;
  }

  .screen-title {
    font-family: "SF Pro Display", "Segoe UI Variable Display", "Inter", system-ui, sans-serif;
    font-size: 28px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin: 0;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* iOS-style nav: back button + title on the left as a group */
  .topbar-leading {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  /* Only shrink the title when paired with a back button (subpages) */
  .topbar-leading .back-btn ~ .screen-title,
  .topbar-leading:has(.back-btn) .screen-title {
    font-size: 20px;
    letter-spacing: -0.03em;
  }

  .screen-subtitle {
    display: none;
  }

  /* Right-side action bar: single horizontal row */
  .topbar-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .topbar-icon-row {
    display: contents; /* dissolve wrapper, children join parent flex row */
  }

  .icon-btn {
    width: 42px;
    height: 42px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface);
    box-shadow: var(--shadow-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--fg-soft);
    font-size: 18px;
  }

  .search-capsule {
    border: 1px solid var(--border);
    border-radius: 999px;
    background: linear-gradient(180deg, var(--surface-2), var(--surface));
    box-shadow: var(--shadow-soft);
    padding: 10px 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    color: var(--fg-soft);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    cursor: pointer;
    white-space: nowrap;
  }

  .search-capsule .sicon {
    font-size: 17px;
    color: var(--accent);
    line-height: 1;
  }

  .hero-card,
  .surface-card,
  .summary-card,
  .expense-card,
  .chart-card,
  .legend-card,
  .input-card {
    border: 1px solid var(--border);
    border-radius: 24px;
    background: var(--surface);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .hero-card {
    padding: 20px;
    margin-bottom: 16px;
    background:
      linear-gradient(135deg, rgba(235, 124, 85, 0.12), transparent 52%),
      linear-gradient(180deg, var(--surface-2), var(--surface));
  }

  .hero-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
  }

  .hero-value {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin-top: 6px;
    font-variant-numeric: tabular-nums;
  }

  .hero-meta {
    color: var(--fg-soft);
    font-size: 13px;
    margin-top: 6px;
  }

  .hero-badge {
    align-self: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(235, 124, 85, 0.12);
    color: var(--accent);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .period-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 18px;
  }

  .period-tab {
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--fg-soft);
    border-radius: 16px;
    padding: 12px 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .period-tab.active {
    background: linear-gradient(135deg, var(--accent), #f39a63);
    color: #fff;
    border-color: transparent;
  }

  .section-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 18px 0 12px;
  }

  .section-label h2 {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .section-label .hint {
    font-size: 12px;
    color: var(--fg-muted);
  }

  .list-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .day-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .day-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 4px;
  }

  .day-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--fg-muted);
    font-weight: 600;
  }

  .day-total {
    font-size: 13px;
    color: var(--fg-soft);
    font-weight: 500;
  }

  .expense-card {
    padding: 15px;
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 12px;
    background: linear-gradient(180deg, var(--surface-2), var(--surface));
  }

  .expense-icon,
  .circle-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: var(--surface-4);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .expense-icon img,
  .circle-icon img,
  .chip-icon img,
  .legend-swatch img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon-emoji {
    font-size: 23px;
    line-height: 1;
  }

  .expense-name {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 2px 0 0;
  }

  .expense-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
    color: var(--fg-soft);
    background: var(--pill);
    border: 1px solid var(--border);
  }

  .pill.category-pill {
    color: var(--accent);
  }

  .pill.account-pill {
    color: var(--positive);
  }

  .expense-date {
    margin-top: 8px;
    color: var(--fg-muted);
    font-size: 12px;
  }

  .expense-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .expense-amount {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  .delete-btn, .edit-btn {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 1;
    padding: 0;
  }
  
  .delete-btn {
    border: 1px solid rgba(244, 106, 106, 0.28);
    background: rgba(244, 106, 106, 0.12);
    color: var(--danger);
  }

  .edit-btn {
    border: 1px solid var(--border);
    background: var(--surface-3);
    color: var(--fg-soft);
  }

  .empty-state,
  .loader-state {
    padding: 32px 20px;
    text-align: center;
    color: var(--fg-soft);
  }

  .empty-state .big,
  .loader-state .big {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 18px;
  }

  .summary-card {
    padding: 18px;
    background: linear-gradient(180deg, var(--surface-2), var(--surface));
  }

  .back-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--fg-soft);
    box-shadow: var(--shadow-soft);
    border-radius: 14px;
    padding: 9px 13px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .summary-kicker {
    font-size: 11px;
    color: var(--fg-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .summary-value {
    margin-top: 6px;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  .summary-note {
    margin-top: 6px;
    font-size: 12px;
    color: var(--fg-soft);
  }

  .chart-card {
    padding: 18px;
    margin-bottom: 18px;
    background:
      linear-gradient(180deg, rgba(83, 189, 176, 0.1), transparent 42%),
      linear-gradient(180deg, var(--surface-2), var(--surface));
  }

  .chart-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .chart-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
  }

  .chart-subtitle {
    margin: 4px 0 0;
    color: var(--fg-soft);
    font-size: 12px;
  }

  .chart-shell {
    border-radius: 18px;
    background: var(--surface-4);
    padding: 18px 14px 10px;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .chart-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .legend-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: linear-gradient(180deg, var(--surface-2), var(--surface));
  }

  .legend-row {
    display: grid;
    grid-template-columns: 32px 1fr auto 16px;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .legend-chevron {
    color: var(--fg-muted);
    font-size: 14px;
    line-height: 1;
    opacity: 0.7;
  }

  .legend-swatch {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  }

  .legend-name {
    font-size: 14px;
    font-weight: 600;
  }

  .legend-sub {
    margin-top: 3px;
    font-size: 12px;
    color: var(--fg-soft);
  }

  .legend-value {
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .input-card {
    padding: 18px;
    margin-bottom: 14px;
    background: linear-gradient(180deg, var(--surface-2), var(--surface));
    position: relative;
    z-index: 1;
  }

  /* When a dropdown inside is open, elevate the entire card above siblings */
  .input-card.dropdown-open {
    z-index: 50;
  }

  .field-label {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--fg-muted);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .required-dot {
    color: var(--accent);
  }

  .field-optional {
    color: var(--fg-muted);
    text-transform: none;
    letter-spacing: 0;
    font-weight: 500;
    opacity: 0.75;
  }

  .amount-shell {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .amount-symbol {
    font-size: 24px;
    color: var(--fg-muted);
    font-weight: 720;
    margin-top: 6px;
  }

  .amount-input {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--fg);
    font-size: 52px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 700;
    outline: none;
    font-variant-numeric: tabular-nums;
  }

  .text-input,
  .date-input,
  .time-input,
  .select-input {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: var(--surface-3);
    color: var(--fg);
    padding: 14px 15px;
    outline: none;
    font-size: 16px;
    box-sizing: border-box;
  }

  .date-input,
  .time-input {
    -webkit-appearance: none;
    appearance: none;
    text-align: center;
  }

  .select-input {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%238b8b8b' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    background-repeat: no-repeat;
    background-position: right 15px center;
    padding-right: 38px;
    cursor: pointer;
  }

  .text-input::placeholder,
  .amount-input::placeholder {
    color: var(--fg-muted);
  }

  /* Expand/collapse toggle for chip sections */
  .expand-toggle {
    appearance: none;
    border: none;
    background: transparent;
    color: var(--accent);
    font-size: 13px;
    font-weight: 600;
    padding: 6px 0 2px;
    cursor: pointer;
    letter-spacing: 0.01em;
  }
  .expand-toggle:hover { opacity: 0.85; }
  .expand-toggle[hidden] { display: none; }

  .search-row[hidden] { display: none; }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 132px;
    gap: 10px;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 42px;
    margin-bottom: 12px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    border-radius: 999px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    color: var(--fg-soft);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .chip.selected {
    background: linear-gradient(135deg, var(--accent), #f39a63);
    color: #fff;
    border-color: transparent;
  }

  .chip.suggest {
    border-style: dashed;
  }

  .chip-icon {
    width: 20px;
    height: 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.12);
    font-size: 14px;
    flex-shrink: 0;
  }

  .chip-remove {
    font-size: 12px;
    opacity: 0.8;
  }

  .search-row {
    position: relative;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 20;
    border: 1px solid var(--border);
    background: var(--surface-2);
    border-radius: 18px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .dropdown.hidden {
    display: none;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 14px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }

  .dropdown-item:last-child {
    border-bottom: none;
  }

  .dropdown-item.create {
    color: var(--accent);
    font-weight: 600;
  }

  .save-btn {
    width: 100%;
    padding: 16px 18px;
    border: none;
    border-radius: 22px;
    color: #fff;
    background: linear-gradient(135deg, var(--accent), #f39a63);
    box-shadow: 0 10px 22px rgba(235, 124, 85, 0.2);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    cursor: pointer;
  }

  .save-btn:disabled {
    opacity: 0.5;
    box-shadow: none;
  }

  .helper-text {
    margin-top: 12px;
    text-align: center;
    color: var(--fg-muted);
    font-size: 12px;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr);
    gap: 12px;
  }

  .filter-grid.three {
    grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);
  }

  /* ── Consolidated search filter card ── */
  .filter-card {
    padding: 6px 18px 14px;
  }
  .filter-block {
    padding: 14px 0 6px;
    border-top: 1px solid var(--border);
  }
  .filter-block:first-child {
    border-top: none;
    padding-top: 6px;
  }
  .date-grid {
    display: grid;
    grid-template-columns: minmax(0,1fr) minmax(0,1fr);
    gap: 10px;
    min-width: 0;
  }
  .date-grid > .date-input {
    min-width: 0;
    width: 100%;
  }
  .chips.chips-inline {
    margin-bottom: 0;
    min-height: 0;
  }

  .filter-select {
    width: 100%;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: var(--surface-3);
    color: var(--fg);
    padding: 14px 15px;
    outline: none;
    font-size: 15px;
    appearance: none;
    -webkit-appearance: none;
  }

  /* ── Side menu ── */
  .side-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0,0,0,0.42);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .side-overlay.open {
    opacity: 1;
    pointer-events: all;
  }
  .side-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(270px, 78vw);
    z-index: 70;
    background: var(--surface-2);
    border-right: 1px solid var(--border);
    box-shadow: 24px 0 60px rgba(0,0,0,0.26);
    display: flex;
    flex-direction: column;
    padding-top: max(20px, env(safe-area-inset-top));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
    transform: translateX(-110%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .side-menu.open {
    transform: translateX(0);
  }
  .side-hdr {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 20px 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 10px;
  }
  .side-logo {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), #f39a63);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .side-app-name {
    font-size: 16px;
    font-weight: 600;
    flex: 1;
    letter-spacing: -0.01em;
  }
  .side-close-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--fg-muted);
    border-radius: 10px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
  }
  .side-nav {
    flex: 1;
    padding: 4px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
  }
  .side-nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 16px;
    border: none;
    background: transparent;
    color: var(--fg-soft);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background 0.15s ease;
  }
  .side-nav-item:active {
    background: var(--surface-3);
  }
  .side-nav-item.active {
    background: var(--surface-3);
    color: var(--accent);
    font-weight: 600;
  }
  .side-nav-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }
  .side-footer {
    padding: 8px 12px 4px;
    border-top: 1px solid var(--border);
  }
  .side-theme-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 16px;
    border-radius: 16px;
    border: none;
    background: transparent;
    color: var(--fg-soft);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
  }

  /* ── Floating add button ── */
  .float-fab {
    position: fixed;
    right: 20px;
    bottom: calc(22px + env(safe-area-inset-bottom));
    width: 58px;
    height: 58px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(135deg, var(--accent), #f39a63);
    color: #fff;
    font-size: 30px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 28px rgba(235, 124, 85, 0.38);
    z-index: 45;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .float-fab:active {
    transform: scale(0.93);
    box-shadow: 0 6px 16px rgba(235, 124, 85, 0.3);
  }
  .float-fab.hidden {
    display: none;
  }

  .toast {
    position: fixed;
    left: 18px;
    right: 18px;
    bottom: calc(96px + env(safe-area-inset-bottom));
    border-radius: 18px;
    padding: 14px 16px;
    text-align: center;
    background: var(--surface-2);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(12px);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0.2s;
    z-index: 50;
  }

  .toast.show {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0s;
  }

  .toast.ok {
    color: var(--positive);
  }

  .toast.err {
    color: var(--danger);
  }

  #pageLoader {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: var(--bg);
    background-image: var(--bg-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 18px;
    transition: opacity 0.35s ease;
  }

  #pageLoader.hidden {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  #pageLoader.fade-out {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  .loader-mark {
    width: 76px;
    height: 76px;
    border-radius: 28px;
    background: linear-gradient(135deg, var(--accent), #f39a63);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 16px 28px rgba(235, 124, 85, 0.24);
    font-size: 36px;
  }

  .currency-value {
    white-space: nowrap;
  }

  .currency-symbol {
    margin-right: 0.24em;
    opacity: 0.92;
  }

  .loader-ring {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (min-width: 720px) {
    .app-shell {
      max-width: 460px;
      margin: 0 auto;
    }

  }

  @media (max-width: 420px) {
    .topbar {
      align-items: flex-start;
    }

    .screen-title {
      font-size: 24px;
    }

    /* On small screens, hide the "Search" text label, keep just the icon */
    .search-capsule span:not(.sicon) {
      display: none;
    }

    .search-capsule {
      padding: 10px 12px;
    }

    .summary-grid {
      grid-template-columns: 1fr;
    }

    .filter-grid {
      grid-template-columns: 1fr;
    }

    .filter-grid.three {
      grid-template-columns: 1fr;
    }

    .period-tab {
      font-size: 12px;
    }

    .legend-row {
      grid-template-columns: 28px 1fr auto 16px;
      gap: 10px;
    }

    .legend-value {
      font-size: 13px;
    }
  }

  /* ── Sort box ── */
  .sort-box {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .sort-box-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .5px;
    text-transform: uppercase;
    color: rgba(255,255,255,.38);
  }
  .sort-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sort-axis {
    font-size: 11px;
    color: rgba(255,255,255,.5);
    width: 46px;
    flex-shrink: 0;
  }
  .sort-opts {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  .sort-opt {
    background: transparent;
    border: 1px solid var(--border);
    color: rgba(255,255,255,.45);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.5;
  }
  .sort-opt.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    font-weight: 600;
  }
</style>
</head>
<body>
<div id="pageLoader">
  <div class="loader-mark">+</div>
  <div class="loader-ring"></div>
  <div class="screen-subtitle" id="pageLoaderText">Syncing your Notion workspace...</div>
</div>

<div class="app-shell">
  <section class="view active" id="expensesView" data-view="expenses">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="icon-btn menu-open-btn" title="Menu" aria-label="Menu">☰</button>
        <h1 class="screen-title">Expenses</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="refreshExpensesBtn" title="Refresh">↻</button>
        <button class="search-capsule" id="openSearchBtn" title="Search expenses"><span class="sicon">⌕</span><span>Search</span></button>
      </div>
    </div>

    <div class="hero-card">
      <div class="hero-row">
        <div>
          <div class="eyebrow">Total Spent</div>
          <div class="hero-value" id="expensesHeroTotal">₹ 0</div>
          <div class="hero-meta" id="expensesHeroMeta">Loading your entries...</div>
        </div>
        <div class="hero-badge" id="expensesHeroBadge">Live</div>
      </div>
    </div>

    <div class="period-tabs" id="expensesTabs">
      <button class="period-tab active" data-scope="expenses" data-period="today">Day</button>
      <button class="period-tab" data-scope="expenses" data-period="week">Weekly</button>
      <button class="period-tab" data-scope="expenses" data-period="month">Monthly</button>
    </div>

    <div id="expSortBox" class="sort-box" style="margin: 8px 16px 0;"></div>

    <div class="section-label">
      <h2>Recent activity</h2>
      <div class="hint" id="expensesCount">0 entries</div>
    </div>
    <div class="list-stack" id="expensesList">
      <div class="loader-state"><div class="big">...</div>Loading expenses...</div>
    </div>
  </section>

  <section class="view add-view" id="addView" data-view="add">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="icon-btn menu-open-btn" id="addMenuBtn" title="Menu" aria-label="Menu">☰</button>
        <button class="back-btn" id="cancelEditBtn" style="display: none;">Cancel</button>
        <h1 class="screen-title">Add Expense</h1>
      </div>
      <div class="topbar-actions">
        <button class="search-capsule" id="openSearchFromAddBtn" title="Search expenses"><span class="sicon">⌕</span><span>Search</span></button>
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Amount <span class="required-dot">*</span></div>
      <div class="amount-shell">
        <div class="amount-symbol">₹</div>
        <input id="amount" class="amount-input" type="text" inputmode="decimal" placeholder="0" autocomplete="off" />
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Expense Name</div>
      <input id="expense" class="text-input" type="text" placeholder="Coffee, Uber, groceries..." autocomplete="off" />
    </div>

    <div class="input-card" id="catCard">
      <div class="field-label">Category <span class="required-dot">*</span></div>
      <div class="chips" id="catChips"></div>
      <button type="button" class="expand-toggle" id="catExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="catSearchRow" hidden>
        <input id="catSearch" class="text-input" type="text" placeholder="Search or create category..." autocomplete="off" />
        <div id="catDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card" id="subCard">
      <div class="field-label">Subcategory <span class="field-optional">(optional)</span></div>
      <div class="chips" id="subChips"></div>
      <button type="button" class="expand-toggle" id="subExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="subSearchRow" hidden>
        <input id="subSearch" class="text-input" type="text" placeholder="Search or create subcategory..." autocomplete="off" />
        <div id="subDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card" id="acctCard">
      <div class="field-label">Account <span class="required-dot">*</span></div>
      <div class="chips" id="acctChips"></div>
      <button type="button" class="expand-toggle" id="acctExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="acctSearchRow" hidden>
        <input id="acctSearch" class="text-input" type="text" placeholder="Search or create account..." autocomplete="off" />
        <div id="acctDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Date And Time</div>
      <div class="input-row">
        <input id="date" class="date-input" type="date" />
        <input id="time" class="time-input" type="time" />
      </div>
    </div>

    <button id="saveBtn" class="save-btn">Save Expense</button>
    <div class="helper-text" id="lastSaved">Choose a category and account to save. Subcategory is optional.</div>
  </section>

  <section class="view" id="analyticsView" data-view="analytics">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="icon-btn menu-open-btn" title="Menu" aria-label="Menu">☰</button>
        <h1 class="screen-title">Breakdown</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="refreshAnalyticsBtn" title="Refresh">↻</button>
        <button class="search-capsule" id="openSearchFromAnalyticsBtn" title="Search expenses"><span class="sicon">⌕</span><span>Search</span></button>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-kicker">Total</div>
        <div class="summary-value" id="analyticsTotal">₹ 0</div>
        <div class="summary-note" id="analyticsCount">0 entries</div>
      </div>
      <div class="summary-card">
        <div class="summary-kicker">Top Category</div>
        <div class="summary-value" id="analyticsTopCategory">-</div>
        <div class="summary-note" id="analyticsTopCategoryNote">Waiting for expense data</div>
      </div>
    </div>

    <div class="period-tabs" id="analyticsTabs">
      <button class="period-tab active" data-scope="analytics" data-period="today">Day</button>
      <button class="period-tab" data-scope="analytics" data-period="week">Weekly</button>
      <button class="period-tab" data-scope="analytics" data-period="month">Monthly</button>
    </div>

    <div class="chart-card">
      <div class="chart-head">
        <div>
          <h2 class="chart-title">Category Breakdown</h2>
          <p class="chart-subtitle" id="analyticsSubtitle">Loading spending distribution...</p>
        </div>
      </div>
      <div class="chart-shell" id="chartShell">
        <svg class="chart-svg" id="chartSvg" viewBox="0 0 320 280" preserveAspectRatio="xMidYMid meet"></svg>
      </div>
    </div>

    <div class="legend-card" id="legendList">
      <div class="loader-state"><div class="big">...</div>Loading analytics...</div>
    </div>
  </section>

  <section class="view" id="searchView" data-view="search">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="back-btn" id="searchBackBtn">‹ Back</button>
        <h1 class="screen-title">Search</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="searchThemeBtn" title="Toggle theme">☀</button>
      </div>
    </div>

    <div class="input-card filter-card">
      <div class="filter-block">
        <div class="field-label">Range</div>
        <div class="date-grid">
          <input id="searchFrom" class="date-input" type="date" />
          <input id="searchTo" class="date-input" type="date" />
        </div>
      </div>

      <div class="filter-block">
        <div id="searchSortBox" class="sort-box"></div>
      </div>

      <div class="filter-block">
        <div class="field-label">Category</div>
        <select id="searchCategorySelect" class="select-input">
          <option value="">All categories</option>
        </select>
      </div>

      <div class="filter-block">
        <div class="field-label">Subcategory</div>
        <select id="searchSubcategorySelect" class="select-input">
          <option value="">All subcategories</option>
        </select>
      </div>

      <div class="filter-block">
        <div class="field-label">Account</div>
        <select id="searchAccountSelect" class="select-input">
          <option value="">All accounts</option>
        </select>
      </div>
    </div>

    <button id="runSearchBtn" class="save-btn">Search Expenses</button>

    <div class="section-label">
      <h2>Results</h2>
      <div style="text-align:right;">
        <div class="hint" id="searchCount">0 entries</div>
        <div id="searchTotal" style="display:none; font-size:15px; font-weight:700; color:var(--c-text, rgba(255,255,255,.87));"></div>
      </div>
    </div>
    <div class="list-stack" id="searchResults">
      <div class="empty-state"><div class="big">⌕</div>Choose a range to begin.</div>
    </div>
  </section>

  <section class="view" id="categoryDetailView" data-view="categoryDetail">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="back-btn" id="categoryDetailBackBtn">‹ Back</button>
        <h1 class="screen-title" id="categoryDetailTitle">Category</h1>
      </div>
      <div class="topbar-actions">
        <button class="search-capsule" id="openSearchFromDetailBtn" title="Search expenses"><span class="sicon">⌕</span><span>Search</span></button>
      </div>
    </div>

    <div class="hero-card">
      <div class="hero-row">
        <div>
          <div class="eyebrow">Total</div>
          <div class="hero-value" id="categoryDetailTotal">₹ 0</div>
          <div class="hero-meta" id="categoryDetailMeta">0 entries</div>
        </div>
      </div>
    </div>

    <div id="catDetailSortBox" class="sort-box" style="margin: 8px 16px 0;"></div>

    <div class="list-stack" id="categoryDetailList">
      <div class="empty-state"><div class="big">#</div>No expenses in this category.</div>
    </div>
  </section>

  <button class="float-fab" id="floatFab" aria-label="Add expense">+</button>
</div>

<div id="sideOverlay" class="side-overlay"></div>
<aside id="sideMenu" class="side-menu">
  <div class="side-hdr">
    <div class="side-logo">+</div>
    <div class="side-app-name">Expense Tracker</div>
    <button class="side-close-btn" id="sideCloseBtn">✕</button>
  </div>
  <nav class="side-nav">
    <button class="side-nav-item active" data-side-view="expenses">
      <span class="side-nav-icon">≡</span>
      <span>Expenses</span>
    </button>
    <button class="side-nav-item" data-side-view="add">
      <span class="side-nav-icon">+</span>
      <span>Add Expense</span>
    </button>
    <button class="side-nav-item" data-side-view="analytics">
      <span class="side-nav-icon">▥</span>
      <span>Analytics</span>
    </button>
  </nav>
  <div class="side-footer">
    <button class="side-theme-row" id="sideThemeBtn">
      <span class="side-nav-icon" id="sideThemeIcon">☀</span>
      <span>Toggle Theme</span>
    </button>
  </div>
</aside>

<div class="toast" id="toast"></div>

<script>
(() => {
  const LS_CACHE = "notion_expense_cache_v2";
  const LS_CACHE_AT = "notion_expense_cache_at_v2";
  const LS_THEME = "notion_expense_theme_v2";
  const SUGGESTIONS_TTL_MS = 24 * 60 * 60 * 1000; // 24h
  const EXP_LS_TTL = { today: 2 * 60 * 1000, week: 10 * 60 * 1000, month: 20 * 60 * 1000 };
  const PERIOD_LABELS = { today: "day", week: "weekly", month: "monthly" };
  const COLOR_PALETTE = ["#ff7a59", "#5ad6c9", "#f2c14e", "#7f8cff", "#c46cff", "#ff5f9e", "#58b368", "#ff9f43"];
  const USER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const $ = (id) => document.getElementById(id);

  const state = {
    data: null,
    currentView: "expenses",
    expensesPeriod: "today",
    analyticsPeriod: "today",
    expensesByPeriod: {},
    analyticsByPeriod: {},
    searchResults: null,
    lastNonDetailView: "analytics",
    lastNonSearchView: "expenses",
    navHidden: false,
    expensesSort: "desc",
    categoryDetailSort: "desc",
    searchFilter: { categoryId: null, subcategoryId: null, accountId: null, sort: "desc" },
    expanded: { cat: false, sub: false, acct: false },
    editingExpenseId: null,
    viewBeforeEdit: null,
    chosen: {
      categoryId: null, categoryName: null,
      subcategoryId: null, subcategoryName: null,
      accountId: null, accountName: null,
    },
    scrollPositions: {
      expenses: 0,
      add: 0,
      analytics: 0,
      search: 0,
      categoryDetail: 0,
    },
  };

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeColorMeta").content = theme === "dark" ? "#121212" : "#fffdf7";
    const icon = theme === "dark" ? "☀" : "☾";
    ["themeBtn","addThemeBtn","analyticsThemeBtn","searchThemeBtn"].forEach(id => { const el = $(id); if (el) el.textContent = icon; });
    const si = $("sideThemeIcon"); if (si) si.textContent = icon;
    localStorage.setItem(LS_THEME, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
    ["themeBtn","addThemeBtn","analyticsThemeBtn","searchThemeBtn"].forEach(id => { const el = $(id); if (el) el.onclick = () => toggleTheme(); });
    const stb = $("sideThemeBtn"); if (stb) stb.onclick = () => toggleTheme();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
    if (state.analyticsByPeriod[state.analyticsPeriod]) renderAnalytics(state.analyticsByPeriod[state.analyticsPeriod]);
  }

  function toast(message, kind) {
    const el = $("toast");
    el.textContent = message;
    el.className = "toast show " + (kind || "");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.className = "toast";
    }, 2800);
  }

  async function api(path, opts) {
    const response = await fetch(path, {
      ...(opts || {}),
      headers: {
        "Content-Type": "application/json",
        ...((opts && opts.headers) || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(data.error || ("HTTP " + response.status));
      err.status = response.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function hideLoader() {
    const loader = $("pageLoader");
    if (!loader) return;
    loader.classList.remove("fade-out");
    loader.classList.add("hidden");
  }

  function showLoader(message) {
    const loader = $("pageLoader");
    if (!loader) return;
    $("pageLoaderText").textContent = message || "Loading...";
    loader.classList.remove("hidden", "fade-out");
  }

  function formatCurrency(value) {
    return "₹ " + Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function formatCurrencyParts(value) {
    return '<span class="currency-value"><span class="currency-symbol">₹</span>' +
      Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }) +
      '</span>';
  }

  function byId(arr, id) {
    return (arr || []).find((item) => item.id === id);
  }

  function renderIcon(icon, fallback, className) {
    const cls = className || "";
    if (icon && icon.type === "image" && icon.value) {
      return '<img src="' + icon.value + '" alt="" class="' + cls + '" />';
    }
    return '<span class="icon-emoji ' + cls + '">' + (icon && icon.type === "emoji" ? icon.value : (fallback || "*")) + '</span>';
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initialFor(name) {
    return (name || "?").trim().charAt(0).toUpperCase() || "?";
  }

  function colorForCategory(name) {
    let hash = 0;
    const text = String(name || "other");
    for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash) + text.charCodeAt(i);
    return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
  }

  function setActiveView(view) {
    state.currentView = view;
    ["expenses", "add", "analytics", "search", "categoryDetail"].forEach((key) => {
      const node = $(key + "View");
      if (!node) return;
      node.classList.toggle("active", key === view);
    });

    // Update side menu active state
    document.querySelectorAll("[data-side-view]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.sideView === view);
    });

    // Float FAB: hide on add, search, categoryDetail
    const fab = $("floatFab");
    if (fab) fab.classList.toggle("hidden", view === "add" || view === "search" || view === "categoryDetail");

    if (view !== "categoryDetail") state.lastNonDetailView = view;
    if (view !== "search" && view !== "categoryDetail") state.lastNonSearchView = view;

    if (view === "expenses") {
      ensureExpensesLoaded(state.expensesPeriod).catch((err) => {
        toast("Failed to load expenses: " + err.message, "err");
      });
    }
    if (view === "analytics") {
      ensureAnalyticsLoaded(state.analyticsPeriod).catch((err) => {
        toast("Failed to load analytics: " + err.message, "err");
      });
    }
    if (view === "search") {
      populateSearchChips();
    }
  }

  function openSideMenu() {
    $("sideMenu").classList.add("open");
    $("sideOverlay").classList.add("open");
  }

  function closeSideMenu() {
    $("sideMenu").classList.remove("open");
    $("sideOverlay").classList.remove("open");
  }

  function attachScrollBehavior() {
    document.querySelectorAll(".view").forEach((viewEl) => {
      viewEl.addEventListener("scroll", () => {
        state.scrollPositions[viewEl.dataset.view] = viewEl.scrollTop;
      }, { passive: true });
    });
  }

  async function bootstrap() {
    // Render from localStorage immediately (instant on return visits)
    const cached = localStorage.getItem(LS_CACHE);
    let hadCache = false;
    if (cached) {
      try {
        state.data = JSON.parse(cached);
        renderFormChips();
        hadCache = true;
      } catch {}
    }

    const netFetch = api("/api/bootstrap").then((data) => {
      state.data = data;
      localStorage.setItem(LS_CACHE, JSON.stringify(data));
      localStorage.setItem(LS_CACHE_AT, String(Date.now()));
      renderFormChips();
    }).catch((err) => {
      if (!state.data) toast("Failed to load Notion data: " + err.message, "err");
    });

    if (hadCache) {
      hideLoader(); // cached data ready — don't block on network
    } else {
      await netFetch; // first visit: must wait for network
      hideLoader();
    }
  }

  function suggestionsStale() {
    const at = parseInt(localStorage.getItem(LS_CACHE_AT) || "0", 10);
    if (!at) return true;
    return (Date.now() - at) > SUGGESTIONS_TTL_MS;
  }

  function lsExpKey(period) { return "ne_exp_v1_" + period; }
  function lsExpAtKey(period) { return "ne_exp_at_v1_" + period; }

  function saveExpCache(period, data) {
    try {
      localStorage.setItem(lsExpKey(period), JSON.stringify(data));
      localStorage.setItem(lsExpAtKey(period), String(Date.now()));
    } catch {}
  }

  function loadExpCache(period) {
    try {
      const at = parseInt(localStorage.getItem(lsExpAtKey(period)) || "0", 10);
      const ttl = EXP_LS_TTL[period] || 2 * 60 * 1000;
      if (!at || (Date.now() - at) > ttl) return null;
      const raw = localStorage.getItem(lsExpKey(period));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function clearExpCache() {
    ["today", "week", "month"].forEach((p) => {
      localStorage.removeItem(lsExpKey(p));
      localStorage.removeItem(lsExpAtKey(p));
    });
  }

  function renderFormChips() {
    if (!state.data) return;
    renderChips("cat", "categoryId", "categoryName", state.data.categories, state.data.recent.categories);
    renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
    renderChips("acct", "accountId", "accountName", state.data.accounts, state.data.recent.accounts);
  }

  function suggestedSubs() {
    const selected = state.chosen.categoryId;
    const fallback = (state.data && state.data.recent && state.data.recent.subcategories) || [];
    if (!selected) return fallback;
    const map = state.data.subcatByCategory && state.data.subcatByCategory[selected];
    if (!map) return fallback;
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map((entry) => entry[0]);
  }

  function renderChipLabel(item, fallback) {
    const icon = item && item.icon ? renderIcon(item.icon, fallback) : '<span class="chip-icon">' + escapeHtml(fallback || "*") + '</span>';
    const wrappedIcon = item && item.icon
      ? '<span class="chip-icon">' + renderIcon(item.icon, fallback) + '</span>'
      : '<span class="chip-icon">' + escapeHtml(fallback || "*") + '</span>';
    return wrappedIcon + '<span>' + escapeHtml(item ? item.name : fallback) + '</span>';
  }

  function renderChips(prefix, idField, nameField, fullList, recentIds) {
    const el = $(prefix + "Chips");
    const expandBtn = $(prefix + "ExpandBtn");
    const searchRow = $(prefix + "SearchRow");
    el.innerHTML = "";

    // SELECTED STATE: show only the chosen chip with × to clear.
    if (state.chosen[idField] || state.chosen[nameField]) {
      const chosenItem = state.chosen[idField] ? byId(fullList, state.chosen[idField]) : null;
      const fallback = state.chosen[nameField] || chosenItem && chosenItem.name || "?";
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip selected";
      chip.innerHTML = renderChipLabel(chosenItem || { name: fallback, icon: chosenItem && chosenItem.icon }, initialFor(fallback)) +
        '<span class="chip-remove">x</span>';
      chip.onclick = () => {
        state.chosen[idField] = null;
        state.chosen[nameField] = null;
        if (idField === "categoryId") {
          state.chosen.subcategoryId = null;
          state.chosen.subcategoryName = null;
          renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
        }
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
      el.appendChild(chip);
      if (expandBtn) expandBtn.hidden = true;
      if (searchRow) searchRow.hidden = true;
      return;
    }

    const expanded = !!state.expanded[prefix];
    const suggestedIds = (recentIds || []).filter((id) => byId(fullList, id));
    const suggestedSet = new Set(suggestedIds);
    const pickChip = (item, suggest) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (suggest ? " suggest" : "");
      chip.innerHTML = renderChipLabel(item, initialFor(item.name));
      chip.onclick = () => {
        state.chosen[idField] = item.id;
        state.chosen[nameField] = item.name;
        if (idField === "categoryId") {
          state.chosen.subcategoryId = null;
          state.chosen.subcategoryName = null;
          renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
        }
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
      return chip;
    };

    if (!expanded) {
      // Collapsed: show suggested/recent chips only.
      suggestedIds.slice(0, 6).forEach((id) => {
        const item = byId(fullList, id);
        if (item) el.appendChild(pickChip(item, true));
      });
    } else {
      // Expanded: suggested first (marked), then all remaining alphabetically.
      suggestedIds.forEach((id) => {
        const item = byId(fullList, id);
        if (item) el.appendChild(pickChip(item, true));
      });
      const rest = (fullList || [])
        .filter((item) => item && !suggestedSet.has(item.id))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      rest.forEach((item) => el.appendChild(pickChip(item, false)));
    }

    // Toggle + search row visibility.
    const hasMore = (fullList || []).length > suggestedIds.slice(0, 6).length;
    if (expandBtn) {
      expandBtn.hidden = false;
      expandBtn.textContent = expanded ? "Show less ⌃" : hasMore ? "Show all ⌄" : "Search / Add ⌄";
      expandBtn.onclick = () => {
        state.expanded[prefix] = !state.expanded[prefix];
        renderChips(prefix, idField, nameField, fullList, recentIds);
      };
    }
    if (searchRow) {
      searchRow.hidden = !expanded;
    }
  }

  function recentFor(prefix) {
    if (!state.data || !state.data.recent) return [];
    if (prefix === "cat") return state.data.recent.categories || [];
    if (prefix === "sub") return suggestedSubs();
    return state.data.recent.accounts || [];
  }

  function wireSearch(prefix, idField, nameField, getList) {
    const input = $(prefix + "Search");
    const dropdown = $(prefix + "Dropdown");
    const card = input.closest(".input-card");

    function close() {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      if (card) card.classList.remove("dropdown-open");
    }

    function open(items, query) {
      dropdown.innerHTML = "";
      const normalized = String(query || "").trim().toLowerCase();
      const matches = items.filter((item) => item.name.toLowerCase().includes(normalized)).slice(0, 8);

      matches.forEach((item) => {
        const row = document.createElement("div");
        row.className = "dropdown-item";
        row.innerHTML =
          '<span class="chip-icon">' + renderIcon(item.icon, initialFor(item.name)) + '</span>' +
          '<span>' + escapeHtml(item.name) + '</span>';
        row.onclick = () => {
          state.chosen[idField] = item.id;
          state.chosen[nameField] = item.name;
          input.value = "";
          close();
          if (idField === "categoryId") {
            state.chosen.subcategoryId = null;
            state.chosen.subcategoryName = null;
            renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
          }
          renderChips(prefix, idField, nameField, items, recentFor(prefix));
        };
        dropdown.appendChild(row);
      });

      const exact = matches.some((item) => item.name.toLowerCase() === normalized);
      if (normalized && !exact) {
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
        dropdown.appendChild(row);
      }

      const isOpen = !!dropdown.children.length;
      dropdown.classList.toggle("hidden", !isOpen);
      if (card) card.classList.toggle("dropdown-open", isOpen);
    }

    input.addEventListener("input", () => open(getList(), input.value));
    input.addEventListener("focus", () => open(getList(), input.value));
    input.addEventListener("blur", () => setTimeout(close, 140));
  }

  function findExpenseById(id) {
    for (const p in state.expensesByPeriod) {
      const found = state.expensesByPeriod[p]?.expenses?.find(e => e.id === id);
      if (found) return found;
    }
    const foundSearch = state.searchResults?.find(e => e.id === id);
    if (foundSearch) return foundSearch;
    const foundDetail = state.categoryDetailExpenses?.find(e => e.id === id);
    if (foundDetail) return foundDetail;
    return null;
  }

  function editExpense(id) {
    const expense = findExpenseById(id);
    if (!expense) return toast("Expense not found locally", "err");
    
    state.editingExpenseId = id;
    $("amount").value = expense.amount || "";
    $("expense").value = expense.name || "";
    if (expense.date) {
      const parts = expense.date.split("T");
      $("date").value = parts[0] || "";
      if (parts[1]) $("time").value = parts[1].slice(0, 5) || "";
    }
    
    state.chosen.categoryId = expense.categoryId || null;
    state.chosen.categoryName = expense.category || null;
    state.chosen.subcategoryId = expense.subcategoryIds?.[0] || null;
    state.chosen.subcategoryName = expense.subcategory || null;
    state.chosen.accountId = expense.accountId || null;
    state.chosen.accountName = expense.account || null;

    const addTitle = $("addView").querySelector(".screen-title");
    if (addTitle) addTitle.textContent = "Edit Expense";
    $("addMenuBtn").style.display = "none";
    $("cancelEditBtn").style.display = "inline-flex";
    
    if (state.data) {
      renderChips("cat", "categoryId", "categoryName", state.data.categories || [], recentFor("cat"));
      renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories || [], suggestedSubs());
      renderChips("acct", "accountId", "accountName", state.data.accounts || [], recentFor("acct"));
    }

    state.viewBeforeEdit = state.currentView;
    setActiveView("add");
  }

  async function syncPendingExpenses() {
    const pendingStr = localStorage.getItem("pendingExpenses");
    if (!pendingStr) return;
    const pending = JSON.parse(pendingStr);
    if (!pending.length) return;

    if (!navigator.onLine) return;

    toast("Syncing " + pending.length + " pending offline expenses...", "ok");
    const failed = [];
    let synced = 0;

    for (const payload of pending) {
      try {
        const sendPayload = { ...payload };
        delete sendPayload._tempId;
        await api("/api/expense", {
          method: "POST",
          body: JSON.stringify(sendPayload),
        });
        synced++;
      } catch (err) {
        failed.push(payload);
      }
    }

    if (failed.length) {
      localStorage.setItem("pendingExpenses", JSON.stringify(failed));
      if (synced > 0) toast("Synced " + synced + " expenses. " + failed.length + " failed.", "err");
    } else {
      localStorage.removeItem("pendingExpenses");
      toast("All offline expenses synced!", "ok");
      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
      clearExpCache();
      ensureExpensesLoaded(state.expensesPeriod, true).catch(() => {});
      ensureAnalyticsLoaded(state.analyticsPeriod, true).catch(() => {});
    }
  }

  async function saveExpense() {
    const amountText = $("amount").value.trim();
    const expense = $("expense").value.trim();
    const dateVal = $("date").value;
    const timeVal = $("time").value;
    const amount = parseFloat(amountText);

    if (!amountText || isNaN(amount) || amount <= 0) {
      return toast("Enter a valid amount", "err");
    }
    if (!state.chosen.categoryId && !state.chosen.categoryName) {
      return toast("Select a category", "err");
    }
    if (!state.chosen.accountId && !state.chosen.accountName) {
      return toast("Select an account", "err");
    }

    let date = dateVal || null;
    if (date && timeVal) {
      const off = -new Date().getTimezoneOffset();
      const sign = off >= 0 ? "+" : "-";
      const absOff = Math.abs(off);
      const tzHH = String(Math.floor(absOff / 60)).padStart(2, "0");
      const tzMM = String(absOff % 60).padStart(2, "0");
      date = date + "T" + timeVal + ":00" + sign + tzHH + ":" + tzMM;
    }

    $("saveBtn").disabled = true;
    $("saveBtn").textContent = "Saving...";

    const payload = {
      expense: expense,
      amount: amount,
      date: date,
      categoryId: state.chosen.categoryId,
      categoryName: state.chosen.categoryName,
      subcategoryId: state.chosen.subcategoryId,
      subcategoryName: state.chosen.subcategoryName,
      accountId: state.chosen.accountId,
      accountName: state.chosen.accountName,
    };

    const isEditing = !!state.editingExpenseId;
    const endpoint = isEditing ? "/api/expense/" + state.editingExpenseId : "/api/expense";
    const method = isEditing ? "PATCH" : "POST";

    let offlineQueued = false;
    try {
      if (!navigator.onLine) throw new Error("Offline");
      
      await api(endpoint, {
        method: method,
        body: JSON.stringify(payload),
      });

      toast(isEditing ? "Expense updated" : "Expense saved", "ok");
    } catch (err) {
      if (!navigator.onLine || err.message.includes("Offline") || err.message.includes("fetch")) {
        if (isEditing) {
          toast("Cannot edit while offline.", "err");
          $("saveBtn").disabled = false;
          $("saveBtn").textContent = "Save Expense";
          return;
        } else {
          const pending = JSON.parse(localStorage.getItem("pendingExpenses") || "[]");
          const tempId = "offline_" + Date.now();
          payload._tempId = tempId;
          pending.push(payload);
          localStorage.setItem("pendingExpenses", JSON.stringify(pending));
          toast("Offline mode: Expense queued for sync", "ok");
          offlineQueued = true;
          
          const optimisticExpense = {
            id: tempId,
            name: payload.expense || "Expense",
            amount: payload.amount,
            date: payload.date || new Date().toISOString(),
            categoryId: payload.categoryId,
            category: payload.categoryName || "",
            subcategoryIds: payload.subcategoryId ? [payload.subcategoryId] : [],
            subcategory: payload.subcategoryName || "",
            accountId: payload.accountId,
            account: payload.accountName || "",
            isOffline: true
          };
          
          if (state.expensesByPeriod[state.expensesPeriod]) {
            state.expensesByPeriod[state.expensesPeriod].expenses.unshift(optimisticExpense);
          } else {
            state.expensesByPeriod[state.expensesPeriod] = { expenses: [optimisticExpense], total: optimisticExpense.amount };
          }
        }
      } else {
        toast("Save failed: " + err.message, "err");
        $("saveBtn").disabled = false;
        $("saveBtn").textContent = "Save Expense";
        return;
      }
    }

    $("amount").value = "";
    $("expense").value = "";
    $("lastSaved").textContent = "Saved at " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    
    state.editingExpenseId = null;
    const addTitle = $("addView").querySelector(".screen-title");
    if (addTitle) addTitle.textContent = "Add Expense";
    $("addMenuBtn").style.display = "inline-flex";
    $("cancelEditBtn").style.display = "none";

    const nextView = state.viewBeforeEdit || "expenses";
    state.viewBeforeEdit = null;

    if (!offlineQueued) {
      // Invalidate caches and navigate immediately
      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
      clearExpCache();
    }
    
    setActiveView(nextView);

    if (!offlineQueued && navigator.onLine) {
      Promise.all([
        ensureExpensesLoaded(state.expensesPeriod, true),
        ensureAnalyticsLoaded(state.analyticsPeriod, true)
      ]).then(() => {
        if (nextView === "categoryDetail") {
          openCategoryDetail($("categoryDetailTitle").textContent);
        } else if (nextView === "search" && $("searchFrom").value && $("searchTo").value) {
          runSearch(true).catch(() => {});
        }
      }).catch(() => {});
      if (suggestionsStale()) bootstrap(false).catch(() => {});
    }
    
    $("saveBtn").disabled = false;
    $("saveBtn").textContent = "Save Expense";
  }

  async function fetchExpenses(period, hardRefresh, extraParams) {
    const params = new URLSearchParams();
    if (period) params.set("period", period);
    if (USER_TIME_ZONE) params.set("timeZone", USER_TIME_ZONE);
    if (hardRefresh) params.set("refresh", "1");
    Object.entries(extraParams || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, value);
    });
    return api("/api/expenses?" + params.toString());
  }

  async function ensureExpensesLoaded(period, hardRefresh) {
    if (!hardRefresh && state.expensesByPeriod[period]) {
      renderExpenses(state.expensesByPeriod[period]);
      return state.expensesByPeriod[period];
    }

    // Stale-while-revalidate: serve LS cache instantly, refresh in background
    if (!hardRefresh) {
      const cached = loadExpCache(period);
      if (cached) {
        state.expensesByPeriod[period] = cached;
        if (!state.analyticsByPeriod[period]) state.analyticsByPeriod[period] = cached;
        renderExpenses(cached);
        fetchExpenses(period, false).then((data) => {
          state.expensesByPeriod[period] = data;
          state.analyticsByPeriod[period] = data;
          saveExpCache(period, data);
          renderExpenses(data);
          if (state.currentView === "analytics" && state.analyticsPeriod === period) {
            renderAnalytics(data);
          }
        }).catch(() => {});
        return cached;
      }
    }

    showLoader("Loading " + PERIOD_LABELS[period] + " expenses...");
    try {
      const data = await fetchExpenses(period, hardRefresh);
      state.expensesByPeriod[period] = data;
      if (!state.analyticsByPeriod[period]) state.analyticsByPeriod[period] = data;
      saveExpCache(period, data);
      renderExpenses(data);
      return data;
    } finally {
      hideLoader();
    }
  }

  async function ensureAnalyticsLoaded(period, hardRefresh) {
    if (!hardRefresh && state.analyticsByPeriod[period]) {
      renderAnalytics(state.analyticsByPeriod[period]);
      return state.analyticsByPeriod[period];
    }

    // Reuse already-fetched expenses data for same period (avoid duplicate network call)
    if (!hardRefresh && state.expensesByPeriod[period]) {
      const data = state.expensesByPeriod[period];
      state.analyticsByPeriod[period] = data;
      renderAnalytics(data);
      return data;
    }

    showLoader("Loading " + PERIOD_LABELS[period] + " analytics...");
    try {
      const data = await fetchExpenses(period, hardRefresh);
      state.analyticsByPeriod[period] = data;
      if (!state.expensesByPeriod[period]) {
        state.expensesByPeriod[period] = data;
        saveExpCache(period, data);
      }
      renderAnalytics(data);
      return data;
    } finally {
      hideLoader();
    }
  }

  function formatDay(dateStr) {
    if (!dateStr) return "No date";
    const dateOnly = dateStr.split("T")[0];
    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const todayText = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayText = yesterday.getFullYear() + "-" + pad(yesterday.getMonth() + 1) + "-" + pad(yesterday.getDate());
    if (dateOnly === todayText) return "Today";
    if (dateOnly === yesterdayText) return "Yesterday";
    return new Date(dateOnly + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }

  function formatTime(dateStr) {
    if (!dateStr || dateStr.indexOf("T") === -1) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  function groupByDay(expenses) {
    const grouped = {};
    (expenses || []).forEach((expense) => {
      const key = (expense.date || "").split("T")[0] || "undated";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(expense);
    });
    return grouped;
  }

  function renderExpenseCard(expense) {
    const icon = expense.categoryIcon || (expense.accountIcon ? expense.accountIcon : null);
    const title = expense.name || expense.subcategory || expense.category || "Expense";
    const time = formatTime(expense.date);
    const offlineIndicator = expense.isOffline ? '<span class="pill" style="border: 1px dashed var(--fg-soft); color: var(--fg-soft);">⏳ Syncing</span>' : '';
    const categoryPill = expense.category
      ? '<span class="pill category-pill">' + escapeHtml(expense.category) + '</span>'
      : "";
    const subcategoryPill = expense.subcategory
      ? '<span class="pill">' + escapeHtml(expense.subcategory) + '</span>'
      : "";
    const accountPill = expense.account
      ? '<span class="pill account-pill">' + escapeHtml(expense.account) + '</span>'
      : "";

    return '' +
      '<div class="expense-card" data-expense-id="' + expense.id + '"' + (expense.isOffline ? ' style="opacity: 0.7;"' : '') + '>' +
        '<div class="expense-icon">' + renderIcon(icon, initialFor(title)) + '</div>' +
        '<div>' +
          '<div class="expense-name">' + escapeHtml(title) + '</div>' +
          '<div class="expense-meta">' + offlineIndicator + categoryPill + subcategoryPill + accountPill + '</div>' +
          '<div class="expense-date">' + escapeHtml(formatDay(expense.date)) + (time ? " - " + escapeHtml(time) : "") + '</div>' +
        '</div>' +
        '<div class="expense-right">' +
          '<div class="expense-amount">' + formatCurrencyParts(expense.amount) + '</div>' +
          '<div style="display: flex; gap: 6px;">' +
            '<button class="edit-btn" data-edit-id="' + expense.id + '" title="Edit" aria-label="Edit">✏️</button>' +
            '<button class="delete-btn" data-delete-id="' + expense.id + '" title="Delete" aria-label="Delete">🗑️</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderExpenseGroups(expenses, emptyMessage, sortOrder) {
    if (!expenses.length) {
      return '<div class="empty-state"><div class="big">+</div>' + escapeHtml(emptyMessage) + '</div>';
    }

    const isAmt = sortOrder === "amount-desc" || sortOrder === "amount-asc";

    // Sort expenses first, then re-group preserving sorted order (so day order follows sort)
    const sorted = expenses.slice().sort((a, b) => {
      if (isAmt) {
        return sortOrder === "amount-desc"
          ? Number(b.amount || 0) - Number(a.amount || 0)
          : Number(a.amount || 0) - Number(b.amount || 0);
      }
      const left = a.date || "";
      const right = b.date || "";
      return sortOrder === "asc" ? left.localeCompare(right) : right.localeCompare(left);
    });

    // Group preserving sorted insertion order (first seen = first rendered)
    const dayOrder = [];
    const grouped = {};
    sorted.forEach((expense) => {
      const day = (expense.date || "").split("T")[0] || "undated";
      if (!grouped[day]) { grouped[day] = []; dayOrder.push(day); }
      grouped[day].push(expense);
    });

    let html = "";
    dayOrder.forEach((day) => {
      const dayExpenses = grouped[day];
      const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      html += '<div class="day-group">';
      html += '<div class="day-header"><div class="day-title">' + escapeHtml(formatDay(day)) + '</div><div class="day-total">' + formatCurrency(dayTotal) + '</div></div>';
      dayExpenses.forEach((expense) => { html += renderExpenseCard(expense); });
      html += '</div>';
    });
    return html;
  }

  function renderExpenses(data) {
    const expenses = (data && data.expenses) || [];
    $("expensesHeroTotal").textContent = formatCurrency(data.total);
    $("expensesHeroMeta").textContent = expenses.length + " entries in your " + PERIOD_LABELS[data.period] + " view";
    $("expensesHeroBadge").textContent = data.cached ? "Cached" : "Live";
    $("expensesCount").textContent = expenses.length + " entries";
    $("expensesList").innerHTML = renderExpenseGroups(expenses, "No expenses recorded for this " + PERIOD_LABELS[data.period] + " yet.", state.expensesSort);
  }

  function populateSearchChips() {
    if (!state.data) return;
    populateSearchCategorySelect();
    populateSearchSubcategorySelect();
    populateSearchAccountSelect();
  }

  function optionsHTML(items, currentVal, placeholder) {
    return '<option value="">' + escapeHtml(placeholder) + "</option>" +
      (items || []).map((item) =>
        '<option value="' + escapeHtml(item.id) + '"' + (item.id === currentVal ? " selected" : "") + ">" + escapeHtml(item.name) + "</option>"
      ).join("");
  }

  function populateSearchCategorySelect() {
    const sel = $("searchCategorySelect");
    if (!sel || !state.data) return;
    const currentVal = state.searchFilter.categoryId || "";
    sel.innerHTML = optionsHTML(state.data.categories || [], currentVal, "All categories");
    sel.onchange = () => {
      state.searchFilter.categoryId = sel.value || null;
      // Reset subcategory when category changes, then repopulate narrowed list.
      state.searchFilter.subcategoryId = null;
      populateSearchSubcategorySelect();
    };
  }

  function populateSearchSubcategorySelect() {
    const sel = $("searchSubcategorySelect");
    if (!sel || !state.data) return;
    const currentVal = state.searchFilter.subcategoryId || "";
    const categoryId = state.searchFilter.categoryId;
    let subs = state.data.subcategories || [];

    // If a category is chosen, narrow subcategories to those used with it.
    if (categoryId && state.data.subcatByCategory) {
      const allowed = state.data.subcatByCategory[categoryId];
      if (allowed) {
        const allowedIds = new Set(Object.keys(allowed));
        const narrowed = subs.filter((s) => allowedIds.has(s.id));
        if (narrowed.length) subs = narrowed;
      }
    }

    sel.innerHTML = optionsHTML(subs, currentVal, "All subcategories");
    sel.onchange = () => {
      state.searchFilter.subcategoryId = sel.value || null;
    };
  }

  function populateSearchAccountSelect() {
    const sel = $("searchAccountSelect");
    if (!sel || !state.data) return;
    const currentVal = state.searchFilter.accountId || "";
    sel.innerHTML = optionsHTML(state.data.accounts || [], currentVal, "All accounts");
    sel.onchange = () => {
      state.searchFilter.accountId = sel.value || null;
    };
  }

  async function runSearch(hardRefresh) {
    const from = $("searchFrom").value;
    const to = $("searchTo").value;
    const categoryId = state.searchFilter.categoryId || "";
    const subcategoryId = state.searchFilter.subcategoryId || "";
    const accountId = state.searchFilter.accountId || "";
    const sort = state.searchFilter.sort || "desc";

    if (!from || !to) return toast("Choose both From and To dates", "err");
    if (from > to) return toast("From date must be before To date", "err");

    showLoader("Searching expenses...");
    try {
      const data = await fetchExpenses(null, hardRefresh, { from, to, categoryId, accountId });

      // Subcategory filter applied client-side (backend doesn't support it).
      if (subcategoryId) {
        data.expenses = data.expenses.filter((e) => {
          if (Array.isArray(e.subcategoryIds)) return e.subcategoryIds.includes(subcategoryId);
          return false;
        });
      }

      state.searchResults = data;
      const filteredTotal = data.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      $("searchCount").textContent = data.expenses.length + " entries";
      const totalEl = $("searchTotal");
      if (totalEl) {
        totalEl.textContent = formatCurrency(filteredTotal);
        totalEl.style.display = data.expenses.length ? "" : "none";
      }
      $("searchResults").innerHTML = renderExpenseGroups(data.expenses, "No expenses matched this search.", sort);
    } finally {
      hideLoader();
    }
  }

  function summarizeAnalytics(expenses) {
    const totals = {};
    const icons = {};
    const counts = {};

    expenses.forEach((expense) => {
      const key = expense.category || "Uncategorized";
      totals[key] = (totals[key] || 0) + Number(expense.amount || 0);
      counts[key] = (counts[key] || 0) + 1;
      if (!icons[key] && expense.categoryIcon) icons[key] = expense.categoryIcon;
    });

    const rows = Object.keys(totals).map((name) => ({
      name: name,
      total: totals[name],
      count: counts[name],
      color: colorForCategory(name),
      icon: icons[name] || null,
    })).sort((a, b) => b.total - a.total);

    return rows;
  }

  function buildChart(rows) {
    const svg = $("chartSvg");
    if (!rows.length) {
      svg.innerHTML = '<text x="160" y="140" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="14">No data for this period</text>';
      return;
    }

    const topRows = rows.slice(0, 6);
    const max = Math.max.apply(null, topRows.map((row) => row.total));
    // viewBox is 320 × 280. Reserve bottom 80px for rotated labels.
    const width = 320;
    const chartHeight = 150;
    const chartBottom = 180;   // baseline of bars
    const left = 26;
    const right = 10;
    const usable = width - left - right;
    const slot = usable / topRows.length;
    const barWidth = Math.min(40, Math.max(18, slot - 14));

    let svgText = "";

    // Horizontal grid lines
    [0.25, 0.5, 0.75, 1].forEach((fraction) => {
      const y = chartBottom - (chartHeight * fraction);
      const valAtFraction = max * fraction;
      const gridLabel = valAtFraction >= 1000
        ? (valAtFraction / 1000).toFixed(1).replace(/\.0$/, "") + "k"
        : String(Math.round(valAtFraction));
      svgText += '<line x1="' + left + '" y1="' + y + '" x2="' + (width - right) + '" y2="' + y + '" stroke="currentColor" opacity="0.1" />';
      svgText += '<text x="' + (left - 4) + '" y="' + (y + 4) + '" text-anchor="end" fill="currentColor" font-size="8.5" opacity="0.45">' + gridLabel + '</text>';
    });
    // Baseline
    svgText += '<line x1="' + left + '" y1="' + chartBottom + '" x2="' + (width - right) + '" y2="' + chartBottom + '" stroke="currentColor" opacity="0.2" />';

    topRows.forEach((row, index) => {
      const barHeight = max ? (row.total / max) * chartHeight : 4;
      const x = left + (slot * index) + ((slot - barWidth) / 2);
      const y = chartBottom - barHeight;
      const valueLabel = row.total >= 1000 ? (row.total / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(Math.round(row.total));
      const categoryName = escapeHtml(row.name);
      // Truncate label at 11 chars to avoid overflow; full name shown in legend
      const displayLabel = row.name.length > 11 ? row.name.slice(0, 10) + "…" : row.name;
      const labelX = x + barWidth / 2;
      const labelY = chartBottom + 8;  // just below baseline

      svgText += '<g data-bar-category="' + categoryName + '" style="cursor:pointer">';
      // Bar with rounded top
      svgText += '<rect x="' + x + '" y="' + y + '" width="' + barWidth + '" height="' + barHeight + '" rx="8" fill="' + row.color + '" />';
      // Value above bar
      const valueY = Math.max(14, y - 5);
      svgText += '<text x="' + (x + barWidth / 2) + '" y="' + valueY + '" text-anchor="middle" fill="currentColor" font-size="10" font-weight="700">' + valueLabel + '</text>';
      // Label rotated 40° below baseline — anchored at start so text goes right-and-down
      svgText += '<text x="' + labelX + '" y="' + labelY + '" text-anchor="end" fill="currentColor" font-size="10" opacity="0.8" transform="rotate(-40 ' + labelX + ' ' + labelY + ')">' + escapeHtml(displayLabel) + '</text>';
      svgText += '</g>';
    });

    svg.innerHTML = svgText;
  }

  function renderAnalytics(data) {
    const expenses = (data && data.expenses) || [];
    const rows = summarizeAnalytics(expenses);
    const top = rows[0];

    $("analyticsTotal").textContent = formatCurrency(data.total);
    $("analyticsCount").textContent = expenses.length + " entries in this " + PERIOD_LABELS[data.period];
    $("analyticsTopCategory").textContent = top ? top.name : "-";
    $("analyticsTopCategoryNote").textContent = top ? formatCurrency(top.total) + " across " + top.count + " expenses" : "Waiting for expense data";
    $("analyticsSubtitle").textContent = rows.length
      ? "Color coded categories for your " + PERIOD_LABELS[data.period] + " spending."
      : "No expenses available yet for this period.";

    buildChart(rows);

    if (!rows.length) {
      $("legendList").innerHTML = '<div class="empty-state"><div class="big">#</div>No category totals yet.</div>';
      return;
    }

    $("legendList").innerHTML = rows.map((row) => {
      const share = data.total ? Math.round((row.total / data.total) * 100) : 0;
      const swatch = row.icon
        ? renderIcon(row.icon, initialFor(row.name))
        : '<span>' + escapeHtml(initialFor(row.name)) + '</span>';
      return '' +
        '<div class="legend-row" data-analytics-category="' + escapeHtml(row.name) + '">' +
          '<div class="legend-swatch" style="background:' + row.color + ';">' + swatch + '</div>' +
          '<div>' +
            '<div class="legend-name">' + escapeHtml(row.name) + '</div>' +
            '<div class="legend-sub">' + row.count + ' expense' + (row.count !== 1 ? "s" : "") + ' - ' + share + '% share</div>' +
          '</div>' +
          '<div class="legend-value">' + formatCurrency(row.total) + '</div>' +
          '<div class="legend-chevron">›</div>' +
        '</div>';
    }).join("");
  }

  function openCategoryDetail(categoryName) {
    const data = state.analyticsByPeriod[state.analyticsPeriod];
    if (!data) return;
    const expenses = (data.expenses || []).filter((expense) => expense.category === categoryName);
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    $("categoryDetailTitle").textContent = categoryName;
    $("categoryDetailTotal").textContent = formatCurrency(total);
    $("categoryDetailMeta").textContent = expenses.length + " entries";
    $("categoryDetailList").innerHTML = renderExpenseGroups(expenses, "No expenses in this category.", state.categoryDetailSort);
    setActiveView("categoryDetail");
  }

  async function deleteExpense(pageId) {
    try {
      await api("/api/expense/" + pageId, { method: "DELETE" });
      toast("Expense deleted", "ok");
      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
      clearExpCache();
      await Promise.all([
        ensureExpensesLoaded(state.expensesPeriod, true),
        ensureAnalyticsLoaded(state.analyticsPeriod, true),
      ]);
      if ($("searchFrom").value && $("searchTo").value && state.searchResults) {
        await runSearch(true);
      }
      if (state.currentView === "categoryDetail") {
        openCategoryDetail($("categoryDetailTitle").textContent);
      }
    } catch (err) {
      toast("Delete failed: " + err.message, "err");
    }
  }

  function wireExpenseActions() {
    ["expensesList", "searchResults", "categoryDetailList"].forEach((id) => $(id).addEventListener("click", (event) => {
      const editBtn = event.target.closest("[data-edit-id]");
      if (editBtn) {
        const id = editBtn.getAttribute("data-edit-id");
        if (id) editExpense(id);
        return;
      }
      
      const delBtn = event.target.closest("[data-delete-id]");
      if (!delBtn) return;
      const id = delBtn.getAttribute("data-delete-id");
      if (!id) return;
      if (!window.confirm("Delete this expense from Notion?")) return;
      deleteExpense(id);
    }));
  }

  function wireAnalyticsDrilldown() {
    $("legendList").addEventListener("click", (event) => {
      const row = event.target.closest("[data-analytics-category]");
      if (!row) return;
      openCategoryDetail(row.getAttribute("data-analytics-category"));
    });

    $("chartSvg").addEventListener("click", (event) => {
      const row = event.target.closest("[data-bar-category]");
      if (!row) return;
      openCategoryDetail(row.getAttribute("data-bar-category"));
    });

    $("categoryDetailBackBtn").onclick = () => setActiveView(state.lastNonDetailView || "analytics");
  }

  function wireNav() {
    // Side menu open (hamburger buttons)
    document.querySelectorAll(".menu-open-btn").forEach((btn) => {
      btn.addEventListener("click", openSideMenu);
    });
    $("sideOverlay").onclick = closeSideMenu;
    $("sideCloseBtn").onclick = closeSideMenu;

    // Side nav items
    document.querySelectorAll("[data-side-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveView(btn.dataset.sideView);
        closeSideMenu();
      });
    });

    // Float FAB
    $("floatFab").onclick = () => {
      state.viewBeforeEdit = state.currentView;
      state.editingExpenseId = null;
      const addTitle = $("addView").querySelector(".screen-title");
      if (addTitle) addTitle.textContent = "Add Expense";
      $("addMenuBtn").style.display = "inline-flex";
      $("cancelEditBtn").style.display = "none";
      $("amount").value = "";
      $("expense").value = "";
      state.chosen = {
        categoryId: null, categoryName: null,
        subcategoryId: null, subcategoryName: null,
        accountId: null, accountName: null,
      };
      if (state.data) {
        renderChips("cat", "categoryId", "categoryName", state.data.categories || [], recentFor("cat"));
        renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories || [], suggestedSubs());
        renderChips("acct", "accountId", "accountName", state.data.accounts || [], recentFor("acct"));
      }
      setActiveView("add");
    };

    $("cancelEditBtn").onclick = () => {
      const nextView = state.viewBeforeEdit || "expenses";
      state.viewBeforeEdit = null;
      state.editingExpenseId = null;
      const addTitle = $("addView").querySelector(".screen-title");
      if (addTitle) addTitle.textContent = "Add Expense";
      $("addMenuBtn").style.display = "inline-flex";
      $("cancelEditBtn").style.display = "none";
      $("amount").value = "";
      $("expense").value = "";
      setActiveView(nextView);
    };

    // Old search capsule buttons still work
    ["openSearchBtn", "openSearchFromAddBtn", "openSearchFromAnalyticsBtn", "openSearchFromDetailBtn"].forEach((id) => {
      const el = $(id);
      if (el) el.onclick = () => setActiveView("search");
    });
  }

  function wirePeriods() {
    document.querySelectorAll(".period-tab").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const scope = btn.dataset.scope;
        const period = btn.dataset.period;
        document.querySelectorAll('.period-tab[data-scope="' + scope + '"]').forEach((node) => {
          node.classList.toggle("active", node === btn);
        });

        if (scope === "expenses") {
          state.expensesPeriod = period;
          showLoader("Loading " + PERIOD_LABELS[period] + " expenses...");
          try {
            await ensureExpensesLoaded(period, false);
          } catch (err) {
            toast("Failed to load expenses: " + err.message, "err");
          } finally {
            hideLoader();
          }
        } else {
          state.analyticsPeriod = period;
          showLoader("Loading " + PERIOD_LABELS[period] + " analytics...");
          try {
            await ensureAnalyticsLoaded(period, false);
          } catch (err) {
            toast("Failed to load analytics: " + err.message, "err");
          } finally {
            hideLoader();
          }
        }
      });
    });
  }

  function initDateDefaults() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const today = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    const monthStart = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-01";
    $("date").value = today;
    $("time").value = pad(now.getHours()) + ":" + pad(now.getMinutes());
    $("searchFrom").value = monthStart;
    $("searchTo").value = today;
  }

  function initFormShortcuts() {
    $("saveBtn").onclick = saveExpense;
    $("amount").addEventListener("keydown", (event) => {
      if (event.key === "Enter") $("expense").focus();
    });
    $("expense").addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveExpense();
    });
  }

  function initRefreshButtons() {
    $("refreshExpensesBtn").onclick = async () => {
      try {
        await ensureExpensesLoaded(state.expensesPeriod, true);
      } catch (err) {
        toast("Refresh failed: " + err.message, "err");
      }
    };
    $("refreshAnalyticsBtn").onclick = async () => {
      try {
        await ensureAnalyticsLoaded(state.analyticsPeriod, true);
      } catch (err) {
        toast("Refresh failed: " + err.message, "err");
      }
    };
  }

  // ── Sort box (inline pill buttons, module-level) ──────────────────────
  function makeSortBox(id, onDateChange, onAmtChange) {
    const el = $(id);
    if (!el) return;

    el.innerHTML =
      '<div class="sort-box-title">Sort By</div>' +
      '<div class="sort-row">' +
        '<span class="sort-axis">Date</span>' +
        '<div class="sort-opts">' +
          '<button type="button" class="sort-opt active" data-val="desc">New → Old</button>' +
          '<button type="button" class="sort-opt" data-val="asc">Old → New</button>' +
        '</div>' +
      '</div>' +
      '<div class="sort-row">' +
        '<span class="sort-axis">Amount</span>' +
        '<div class="sort-opts">' +
          '<button type="button" class="sort-opt active" data-val="">Default</button>' +
          '<button type="button" class="sort-opt" data-val="amount-desc">High → Low</button>' +
          '<button type="button" class="sort-opt" data-val="amount-asc">Low → High</button>' +
        '</div>' +
      '</div>';

    const [dateRow, amtRow] = el.querySelectorAll(".sort-opts");
    function wireRow(row, onChange) {
      row.querySelectorAll(".sort-opt").forEach((btn) => {
        btn.onclick = () => {
          row.querySelectorAll(".sort-opt").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          onChange(btn.dataset.val);
        };
      });
    }
    wireRow(dateRow, onDateChange);
    wireRow(amtRow, onAmtChange);
  }

  function initSearchControls() {
    $("runSearchBtn").onclick = async () => {
      try {
        await runSearch(true);
      } catch (err) {
        toast("Search failed: " + err.message, "err");
      }
    };

    const sSearch = { date: "desc", amt: "" };
    function applySearchSort() { state.searchFilter.sort = sSearch.amt || sSearch.date; }
    makeSortBox("searchSortBox",
      (v) => { sSearch.date = v; applySearchSort(); },
      (v) => { sSearch.amt  = v; applySearchSort(); }
    );

    $("searchBackBtn").onclick = () => setActiveView(state.lastNonSearchView || "expenses");
  }

  async function init() {
    initTheme();
    initDateDefaults();
    initFormShortcuts();
    attachScrollBehavior();
    wireNav();
    wirePeriods();
    wireExpenseActions();
    wireAnalyticsDrilldown();
    initRefreshButtons();
    initSearchControls();

    wireSearch("cat", "categoryId", "categoryName", () => state.data ? state.data.categories : []);
    wireSearch("sub", "subcategoryId", "subcategoryName", () => state.data ? state.data.subcategories : []);
    wireSearch("acct", "accountId", "accountName", () => state.data ? state.data.accounts : []);

    // Expenses sort box
    const sExp = { date: "desc", amt: "" };
    function applyExpSort() {
      state.expensesSort = sExp.amt || sExp.date;
      const cur = state.expensesByPeriod[state.expensesPeriod];
      if (cur) renderExpenses(cur);
    }
    makeSortBox("expSortBox",
      (v) => { sExp.date = v; applyExpSort(); },
      (v) => { sExp.amt  = v; applyExpSort(); }
    );

    // Category detail sort box
    const sCat = { date: "desc", amt: "" };
    function applyCatSort() {
      state.categoryDetailSort = sCat.amt || sCat.date;
      const name = $("categoryDetailTitle") && $("categoryDetailTitle").textContent;
      if (name) openCategoryDetail(name);
    }
    makeSortBox("catDetailSortBox",
      (v) => { sCat.date = v; applyCatSort(); },
      (v) => { sCat.amt  = v; applyCatSort(); }
    );

    await bootstrap();
    try {
      await Promise.all([
        ensureExpensesLoaded(state.expensesPeriod, false),
        ensureAnalyticsLoaded(state.analyticsPeriod, false),
      ]);
    } catch (err) {
      toast("Failed to load expense views: " + err.message, "err");
    }
    
    syncPendingExpenses();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => console.error("SW failed:", err));
    }
  });

  window.addEventListener("online", syncPendingExpenses);
})();
</script>
</body>
</html>`;
