// HTML + CSS + JS for the expense app. Served at GET /.
// Exported as a string so the Worker can ship as a single bundle.

export const HTML = /* html */ `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" id="themeColorMeta" content="#121212" />
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
      calc(148px + env(safe-area-inset-bottom));
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
    padding-bottom: calc(186px + env(safe-area-inset-bottom));
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
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .topbar-leading .screen-title {
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

  .delete-btn {
    width: 32px;
    height: 32px;
    border: 1px solid rgba(244, 106, 106, 0.28);
    background: rgba(244, 106, 106, 0.12);
    color: var(--danger);
    border-radius: 12px;
    cursor: pointer;
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
  .time-input {
    width: 100%;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: var(--surface-3);
    color: var(--fg);
    padding: 14px 15px;
    outline: none;
    font-size: 15px;
  }

  .text-input::placeholder,
  .amount-input::placeholder {
    color: var(--fg-muted);
  }

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
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .filter-grid.three {
    grid-template-columns: 1fr 1fr 1fr;
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

  .bottom-nav {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: calc(14px + env(safe-area-inset-bottom));
    z-index: 40;
    border: 1px solid var(--border);
    border-radius: 30px;
    background: var(--nav-bg);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: var(--shadow);
    padding: 12px 14px 16px;
    display: grid;
    grid-template-columns: 1fr 92px 1fr;
    align-items: center;
    gap: 10px;
    transform: translateY(0);
    transition: transform 0.28s ease, opacity 0.28s ease;
  }

  .bottom-nav.hidden {
    transform: translateY(120%);
    opacity: 0.01;
  }

  .nav-tab {
    border: none;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 10px 0 0;
    color: var(--fg-muted);
    cursor: pointer;
  }

  .nav-tab.active {
    color: var(--fg);
  }

  .nav-icon {
    width: 36px;
    height: 36px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid transparent;
    font-size: 17px;
  }

  .nav-tab.active .nav-icon {
    background: var(--surface-3);
    border-color: var(--border);
  }

  .nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: 1;
  }

  .nav-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    margin-top: -42px;
  }

  .nav-fab {
    width: 78px;
    height: 78px;
    border-radius: 30px;
    border: 6px solid var(--bg);
    background: linear-gradient(135deg, var(--accent), #f39a63);
    color: #fff;
    box-shadow: 0 18px 30px rgba(235, 124, 85, 0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }

  .fab-plus {
    font-size: 34px;
    line-height: 1;
    margin-top: -1px;
  }

  .fab-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--fg-muted);
    line-height: 1;
  }

  .nav-fab.active + .fab-label {
    color: var(--fg);
  }

  .toast {
    position: fixed;
    left: 18px;
    right: 18px;
    bottom: calc(132px + env(safe-area-inset-bottom));
    border-radius: 18px;
    padding: 14px 16px;
    text-align: center;
    background: var(--surface-2);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    transform: translateY(140%);
    transition: transform 0.24s ease;
    z-index: 50;
  }

  .toast.show {
    transform: translateY(0);
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

    .bottom-nav {
      max-width: 428px;
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
      <h1 class="screen-title">Expenses</h1>
      <div class="topbar-actions">
        <button class="icon-btn" id="refreshExpensesBtn" title="Refresh">↻</button>
        <button class="icon-btn" id="themeBtn" title="Toggle theme">☀</button>
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
      <h1 class="screen-title">Add Expense</h1>
      <div class="topbar-actions">
        <button class="icon-btn" id="addThemeBtn" title="Toggle theme">☀</button>
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

    <div class="input-card">
      <div class="field-label">Category <span class="required-dot">*</span></div>
      <div class="chips" id="catChips"></div>
      <div class="search-row">
        <input id="catSearch" class="text-input" type="text" placeholder="Search or create category..." autocomplete="off" />
        <div id="catDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Subcategory <span class="required-dot">*</span></div>
      <div class="chips" id="subChips"></div>
      <div class="search-row">
        <input id="subSearch" class="text-input" type="text" placeholder="Search or create subcategory..." autocomplete="off" />
        <div id="subDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Account <span class="required-dot">*</span></div>
      <div class="chips" id="acctChips"></div>
      <div class="search-row">
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
    <div class="helper-text" id="lastSaved">Choose a category, subcategory, and account to save.</div>
  </section>

  <section class="view" id="analyticsView" data-view="analytics">
    <div class="topbar">
      <h1 class="screen-title">Breakdown</h1>
      <div class="topbar-actions">
        <button class="icon-btn" id="refreshAnalyticsBtn" title="Refresh">↻</button>
        <button class="icon-btn" id="analyticsThemeBtn" title="Toggle theme">☀</button>
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

    <div class="input-card">
      <div class="field-label">Range</div>
      <div class="filter-grid">
        <input id="searchFrom" class="date-input" type="date" />
        <input id="searchTo" class="date-input" type="date" />
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Filters</div>
      <div class="filter-grid three">
        <select id="searchCategory" class="filter-select">
          <option value="">All categories</option>
        </select>
        <select id="searchAccount" class="filter-select">
          <option value="">All accounts</option>
        </select>
        <select id="searchSort" class="filter-select">
          <option value="desc">Date: Newest first</option>
          <option value="asc">Date: Oldest first</option>
        </select>
      </div>
    </div>

    <button id="runSearchBtn" class="save-btn">Search Expenses</button>

    <div class="section-label">
      <h2>Results</h2>
      <div class="hint" id="searchCount">0 entries</div>
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

    <div class="list-stack" id="categoryDetailList">
      <div class="empty-state"><div class="big">#</div>No expenses in this category.</div>
    </div>
  </section>

  <nav class="bottom-nav" id="bottomNav">
    <button class="nav-tab active" data-view-target="expenses">
      <span class="nav-icon">=</span>
      <span class="nav-label">Expenses</span>
    </button>
    <div class="nav-center">
      <button class="nav-fab" id="fabBtn" data-view-target="add" aria-label="Add expense">
        <span class="fab-plus">+</span>
      </button>
      <span class="fab-label">Add</span>
    </div>
    <button class="nav-tab" data-view-target="analytics">
      <span class="nav-icon">▥</span>
      <span class="nav-label">Analytics</span>
    </button>
  </nav>
</div>

<div class="toast" id="toast"></div>

<script>
(() => {
  const LS_CACHE = "notion_expense_cache_v2";
  const LS_THEME = "notion_expense_theme_v2";
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
    $("themeBtn").textContent = theme === "dark" ? "☀" : "☾";
    $("addThemeBtn").textContent = theme === "dark" ? "☀" : "☾";
    $("analyticsThemeBtn").textContent = theme === "dark" ? "☀" : "☾";
    $("searchThemeBtn").textContent = theme === "dark" ? "☀" : "☾";
    $("themeColorMeta").content = theme === "dark" ? "#121212" : "#fffdf7";
    localStorage.setItem(LS_THEME, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
    $("themeBtn").onclick = () => toggleTheme();
    $("addThemeBtn").onclick = () => toggleTheme();
    $("analyticsThemeBtn").onclick = () => toggleTheme();
    $("searchThemeBtn").onclick = () => toggleTheme();
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

    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.viewTarget === view);
    });
    $("fabBtn").classList.toggle("active", view === "add");
    showNav();

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
  }

  function hideNav() {
    if (state.currentView === "add" || state.currentView === "categoryDetail" || state.currentView === "search") return;
    state.navHidden = true;
    $("bottomNav").classList.add("hidden");
  }

  function showNav() {
    // Search view always hides the nav (it has its own back button)
    if (state.currentView === "search") {
      $("bottomNav").classList.add("hidden");
      return;
    }
    state.navHidden = false;
    $("bottomNav").classList.remove("hidden");
  }

  function attachScrollBehavior() {
    document.querySelectorAll(".view").forEach((viewEl) => {
      let last = 0;
      viewEl.addEventListener("scroll", () => {
        const current = viewEl.scrollTop;
        const viewName = viewEl.dataset.view;
        state.scrollPositions[viewName] = current;
        if (viewName !== state.currentView) {
          last = current;
          return;
        }
        if (current < 18) {
          showNav();
        } else if (current > last + 18) {
          hideNav();
        } else if (current < last - 10) {
          showNav();
        }
        last = current;
      }, { passive: true });
    });
  }

  async function bootstrap(fromCache) {
    if (fromCache) {
      const cached = localStorage.getItem(LS_CACHE);
      if (cached) {
        try {
          state.data = JSON.parse(cached);
          renderFormChips();
        } catch {}
      }
    }

    try {
      const data = await api("/api/bootstrap");
      state.data = data;
      localStorage.setItem(LS_CACHE, JSON.stringify(data));
      renderFormChips();
    } catch (err) {
      if (!state.data) toast("Failed to load Notion data: " + err.message, "err");
    } finally {
      hideLoader();
    }
  }

  function renderFormChips() {
    if (!state.data) return;
    renderChips("cat", "categoryId", "categoryName", state.data.categories, state.data.recent.categories);
    renderChips("sub", "subcategoryId", "subcategoryName", state.data.subcategories, suggestedSubs());
    renderChips("acct", "accountId", "accountName", state.data.accounts, state.data.recent.accounts);
    populateSearchFilters();
  }

  function populateSearchFilters() {
    if (!state.data) return;
    $("searchCategory").innerHTML =
      '<option value="">All categories</option>' +
      state.data.categories.map((item) =>
        '<option value="' + item.id + '">' + escapeHtml(item.name) + '</option>'
      ).join("");
    $("searchAccount").innerHTML =
      '<option value="">All accounts</option>' +
      state.data.accounts.map((item) =>
        '<option value="' + item.id + '">' + escapeHtml(item.name) + '</option>'
      ).join("");
  }

  function suggestedSubs() {
    const selected = state.chosen.categoryId;
    if (!selected) return (state.data && state.data.recent.subcategories) || [];
    const map = state.data.subcatByCategory && state.data.subcatByCategory[selected];
    if (!map) return (state.data && state.data.recent.subcategories) || [];
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
    el.innerHTML = "";

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
      return;
    }

    (recentIds || []).forEach((id) => {
      const item = byId(fullList, id);
      if (!item) return;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip suggest";
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
      el.appendChild(chip);
    });
  }

  function recentFor(prefix) {
    if (!state.data) return [];
    if (prefix === "cat") return state.data.recent.categories;
    if (prefix === "sub") return suggestedSubs();
    return state.data.recent.accounts;
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
    if (!state.chosen.subcategoryId && !state.chosen.subcategoryName) {
      return toast("Select a subcategory", "err");
    }
    if (!state.chosen.accountId && !state.chosen.accountName) {
      return toast("Select an account", "err");
    }

    let date = dateVal || null;
    if (date && timeVal) date = date + "T" + timeVal + ":00";

    $("saveBtn").disabled = true;
    $("saveBtn").textContent = "Saving...";

    try {
      await api("/api/expense", {
        method: "POST",
        body: JSON.stringify({
          expense: expense,
          amount: amount,
          date: date,
          categoryId: state.chosen.categoryId,
          categoryName: state.chosen.categoryName,
          subcategoryId: state.chosen.subcategoryId,
          subcategoryName: state.chosen.subcategoryName,
          accountId: state.chosen.accountId,
          accountName: state.chosen.accountName,
        }),
      });

      toast("Expense saved", "ok");
      $("amount").value = "";
      $("expense").value = "";
      $("lastSaved").textContent = "Saved at " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
      await bootstrap(false);
      await Promise.all([
        ensureExpensesLoaded(state.expensesPeriod, true),
        ensureAnalyticsLoaded(state.analyticsPeriod, true),
      ]);
      setActiveView("expenses");
    } catch (err) {
      toast("Save failed: " + err.message, "err");
    } finally {
      $("saveBtn").disabled = false;
      $("saveBtn").textContent = "Save Expense";
    }
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

    showLoader("Loading " + PERIOD_LABELS[period] + " expenses...");
    try {
      const data = await fetchExpenses(period, hardRefresh);
      state.expensesByPeriod[period] = data;
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

    showLoader("Loading " + PERIOD_LABELS[period] + " analytics...");
    try {
      const data = await fetchExpenses(period, hardRefresh);
      state.analyticsByPeriod[period] = data;
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
      '<div class="expense-card" data-expense-id="' + expense.id + '">' +
        '<div class="expense-icon">' + renderIcon(icon, initialFor(title)) + '</div>' +
        '<div>' +
          '<div class="expense-name">' + escapeHtml(title) + '</div>' +
          '<div class="expense-meta">' + categoryPill + subcategoryPill + accountPill + '</div>' +
          '<div class="expense-date">' + escapeHtml(formatDay(expense.date)) + (time ? " - " + escapeHtml(time) : "") + '</div>' +
        '</div>' +
        '<div class="expense-right">' +
          '<div class="expense-amount">' + formatCurrencyParts(expense.amount) + '</div>' +
          '<button class="delete-btn" data-delete-id="' + expense.id + '" title="Delete">x</button>' +
        '</div>' +
      '</div>';
  }

  function renderExpenseGroups(expenses, emptyMessage, sortOrder) {
    const order = sortOrder === "asc" ? "asc" : "desc";
    if (!expenses.length) {
      return '<div class="empty-state"><div class="big">+</div>' + escapeHtml(emptyMessage) + '</div>';
    }

    const grouped = groupByDay(expenses);
    const days = Object.keys(grouped).sort((a, b) => order === "asc" ? a.localeCompare(b) : b.localeCompare(a));
    let html = "";
    days.forEach((day) => {
      const dayExpenses = grouped[day].slice().sort((a, b) => {
        const left = a.date || "";
        const right = b.date || "";
        return order === "asc" ? left.localeCompare(right) : right.localeCompare(left);
      });
      const dayTotal = dayExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
      html += '<div class="day-group">';
      html += '<div class="day-header"><div class="day-title">' + escapeHtml(formatDay(day)) + '</div><div class="day-total">' + formatCurrency(dayTotal) + '</div></div>';
      dayExpenses.forEach((expense) => {
        html += renderExpenseCard(expense);
      });
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
    $("expensesList").innerHTML = renderExpenseGroups(expenses, "No expenses recorded for this " + PERIOD_LABELS[data.period] + " yet.", "desc");
  }

  async function runSearch(hardRefresh) {
    const from = $("searchFrom").value;
    const to = $("searchTo").value;
    const categoryId = $("searchCategory").value;
    const accountId = $("searchAccount").value;
    const sort = $("searchSort").value || "desc";

    if (!from || !to) return toast("Choose both From and To dates", "err");
    if (from > to) return toast("From date must be before To date", "err");

    showLoader("Searching expenses...");
    try {
      const data = await fetchExpenses(null, hardRefresh, { from, to, categoryId, accountId });
      data.expenses.sort((a, b) => {
        const left = a.date || "";
        const right = b.date || "";
        return sort === "asc" ? left.localeCompare(right) : right.localeCompare(left);
      });
      state.searchResults = data;
      $("searchCount").textContent = data.expenses.length + " entries";
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
    $("categoryDetailList").innerHTML = renderExpenseGroups(expenses, "No expenses in this category.", "desc");
    setActiveView("categoryDetail");
  }

  async function deleteExpense(pageId) {
    try {
      await api("/api/expense/" + pageId, { method: "DELETE" });
      toast("Expense deleted", "ok");
      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
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
      const btn = event.target.closest("[data-delete-id]");
      if (!btn) return;
      const id = btn.getAttribute("data-delete-id");
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
    document.querySelectorAll("[data-view-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveView(btn.dataset.viewTarget);
      });
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

  function initSearchControls() {
    $("runSearchBtn").onclick = async () => {
      try {
        await runSearch(true);
      } catch (err) {
        toast("Search failed: " + err.message, "err");
      }
    };
    $("searchSort").onchange = async () => {
      if (!$("searchFrom").value || !$("searchTo").value || !state.searchResults) return;
      try {
        await runSearch(false);
      } catch (err) {
        toast("Sort update failed: " + err.message, "err");
      }
    };
    ["openSearchBtn", "openSearchFromAddBtn", "openSearchFromAnalyticsBtn", "openSearchFromDetailBtn"].forEach((id) => {
      $(id).onclick = () => setActiveView("search");
    });
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

    await bootstrap(true);
    try {
      await Promise.all([
        ensureExpensesLoaded(state.expensesPeriod, false),
        ensureAnalyticsLoaded(state.analyticsPeriod, false),
      ]);
    } catch (err) {
      toast("Failed to load expense views: " + err.message, "err");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
</script>
</body>
</html>`;
