// HTML + CSS + JS for the expense app. Served at GET /.
// Exported as a string so the Worker can ship as a single bundle.

import { ICONS_LIB_SOURCE } from "./icons-lib.js";

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
  /* ── DESIGN TOKENS: Warm Ledger ─────────────────────────────── */

  :root,
  [data-theme="dark"] {
    /* Backgrounds */
    --color-bg-primary:        #111111;
    --color-bg-accent:         radial-gradient(circle at top left, rgba(229, 117, 82, 0.16), transparent 34%),
                                radial-gradient(circle at top right, rgba(79, 184, 171, 0.1), transparent 26%);
    --color-bg-surface:        rgba(28, 28, 28, 0.90);
    --color-bg-surface-2:      rgba(33, 33, 33, 0.96);
    --color-bg-surface-3:      rgba(40, 40, 40, 0.98);
    --color-bg-surface-raised: rgba(255, 255, 255, 0.05);
    --color-bg-inverse:        rgba(249, 246, 242, 0.94);
    --color-sheet-bg:          rgba(22, 22, 22, 0.98);

    /* Text */
    --color-text-primary:   rgba(249, 246, 242, 0.94);
    --color-text-secondary: rgba(232, 227, 221, 0.76);
    --color-text-tertiary:  rgba(218, 212, 205, 0.50);
    --color-text-inverse:   #201c18;
    --color-text-link:      #eb7c55;

    /* Borders */
    --color-border-primary:   rgba(255, 255, 255, 0.07);
    --color-border-secondary: rgba(255, 255, 255, 0.04);
    --color-border-focus:     rgba(235, 124, 85, 0.60);

    /* Accent — Expense (orange) */
    --color-accent-expense:        #eb7c55;
    --color-accent-expense-hover:  #f08d69;
    --color-accent-expense-active: #d96d46;
    --color-accent-expense-subtle: rgba(235, 124, 85, 0.12);

    /* Accent — Income (green) */
    --color-income:        #66c68c;
    --color-income-hover:  #7ad49f;
    --color-income-active: #52b47a;
    --color-income-subtle: rgba(102, 198, 140, 0.12);

    /* Supporting accents */
    --color-accent-teal: #53bdb0;
    --color-accent-gold: #d8af54;

    /* Status */
    --color-status-success: #66c68c;
    --color-status-warning: #d8af54;
    --color-status-error:   #f46a6a;
    --color-status-info:    #53bdb0;

    /* Surfaces / overlays */
    --color-pill:        rgba(255, 255, 255, 0.055);
    --color-pill-active: rgba(235, 124, 85, 0.18);
    --color-overlay:     rgba(5, 5, 5, 0.60);
    --color-backdrop:    rgba(5, 5, 5, 0.38);

    /* Navigation (bottom tab bar) */
    --color-nav-bg:         rgba(18, 18, 18, 0.92);
    --color-nav-border:     rgba(255, 255, 255, 0.06);
    --color-nav-item:       rgba(218, 212, 205, 0.45);
    --color-nav-item-active: #eb7c55;
    --color-nav-add-bg:     #eb7c55;
    --color-nav-add-fg:     #ffffff;

    /* Chart palette */
    --color-chart-1: #ff7a59;
    --color-chart-2: #5ad6c9;
    --color-chart-3: #f2c14e;
    --color-chart-4: #7f8cff;
    --color-chart-5: #c46cff;
    --color-chart-6: #ff5f9e;
    --color-chart-7: #58b368;
    --color-chart-8: #ff9f43;

    /* Shadows */
    --shadow-sm:    0 2px 8px rgba(0, 0, 0, 0.20);
    --shadow-md:    0 8px 22px rgba(0, 0, 0, 0.28);
    --shadow-lg:    0 14px 36px rgba(0, 0, 0, 0.36);
    --shadow-sheet: 0 -8px 32px rgba(0, 0, 0, 0.40);
    --shadow-focus: 0 0 0 3px rgba(235, 124, 85, 0.30);

    /* Spacing scale (4px base) */
    --space-0: 0px;
    --space-1: 2px;
    --space-2: 4px;
    --space-3: 6px;
    --space-4: 8px;
    --space-5: 12px;
    --space-6: 16px;
    --space-7: 20px;
    --space-8: 24px;
    --space-9: 32px;
    --space-10: 40px;
    --space-11: 48px;
    --space-12: 64px;
    --space-13: 80px;

    /* Typography */
    --font-display: "SF Pro Display", "Segoe UI Variable Display", "Inter", system-ui, sans-serif;
    --font-body:    "SF Pro Text", "SF Pro Display", "Segoe UI Variable Text", "Inter", "Avenir Next", system-ui, sans-serif;
    --font-mono:    "SF Mono", "Fira Code", ui-monospace, monospace;

    --text-2xs:  12px;
    --text-xs:   11px;
    --text-sm:   13px;
    --text-base: 15px;
    --text-md:   16px;
    --text-lg:   18px;
    --text-xl:   22px;
    --text-2xl:  28px;
    --text-3xl:  36px;
    --text-4xl:  48px;

    --weight-normal:   400;
    --weight-medium:   500;
    --weight-semibold: 600;
    --weight-bold:     700;

    --leading-tight:   1.15;
    --leading-snug:    1.30;
    --leading-normal:  1.50;
    --leading-relaxed: 1.65;

    --tracking-tight:  var(--tracking-tight);
    --tracking-snug:   var(--tracking-snug);
    --tracking-normal:  0em;
    --tracking-wide:    0.04em;
    --tracking-wider:   0.08em;

    /* Layout */
    --radius-xs:   4px;
    --radius-sm:   8px;
    --radius-md:   12px;
    --radius-lg:   16px;
    --radius-xl:   20px;
    --radius-2xl:  24px;
    --radius-full: 9999px;

    --max-content: 480px;

    /* Component tokens */
    --topbar-h:        52px;
    --nav-h:           64px;
    --nav-add-size:    52px;
    --card-radius:     var(--radius-lg);
    --card-padding:    var(--space-6);
    --input-h:         48px;
    --input-radius:    var(--radius-md);
    --chip-h:          32px;
    --chip-radius:     var(--radius-full);
    --sheet-radius:    var(--radius-2xl);
    --txn-card-h:      64px;

    /* Motion */
    --dur-instant: 50ms;
    --dur-fast:    150ms;
    --dur-normal:  250ms;
    --dur-slow:    380ms;
    --dur-slower:  520ms;
    --ease:        cubic-bezier(0.4, 0, 0.2, 1);
    --ease-out:    cubic-bezier(0, 0, 0.2, 1);
    --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

    /* Safe area */
    --safe-top:    env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);

    /* Legacy aliases — kept for backward compat during migration */
    --bg:          var(--color-bg-primary);
    --bg-accent:   var(--color-bg-accent);
    --surface:     var(--color-bg-surface);
    --surface-2:   var(--color-bg-surface-2);
    --surface-3:   var(--color-bg-surface-3);
    --surface-4:   var(--color-bg-surface-raised);
    --fg:          var(--color-text-primary);
    --fg-soft:     var(--color-text-secondary);
    --fg-muted:    var(--color-text-tertiary);
    --border:      var(--color-border-primary);
    --shadow:      var(--shadow-lg);
    --shadow-soft: var(--shadow-md);
    --accent:      var(--color-accent-expense);
    --accent-2:    var(--color-accent-teal);
    --accent-3:    var(--color-accent-gold);
    --positive:    var(--color-income);
    --danger:      var(--color-status-error);
    --pill:        var(--color-pill);
    --nav-bg:      var(--color-nav-bg);
    --backdrop:    var(--color-backdrop);
  }

  [data-theme="light"] {
    /* Backgrounds */
    --color-bg-primary:        #f6f1e9;
    --color-bg-accent:         radial-gradient(circle at top left, rgba(235, 124, 85, 0.10), transparent 30%),
                                radial-gradient(circle at top right, rgba(83, 189, 176, 0.10), transparent 26%);
    --color-bg-surface:        rgba(255, 252, 247, 0.92);
    --color-bg-surface-2:      rgba(250, 245, 238, 0.97);
    --color-bg-surface-3:      rgba(242, 235, 226, 0.98);
    --color-bg-surface-raised: rgba(22, 20, 18, 0.04);
    --color-bg-inverse:        #201c18;
    --color-sheet-bg:          rgba(255, 252, 247, 0.99);

    /* Text */
    --color-text-primary:   #201c18;
    --color-text-secondary: #5f564c;
    --color-text-tertiary:  #8e8478;
    --color-text-inverse:   rgba(249, 246, 242, 0.94);
    --color-text-link:      #e87750;

    /* Borders */
    --color-border-primary:   rgba(31, 26, 23, 0.07);
    --color-border-secondary: rgba(31, 26, 23, 0.04);
    --color-border-focus:     rgba(232, 119, 80, 0.50);

    /* Accent — Expense */
    --color-accent-expense:        #e87750;
    --color-accent-expense-hover:  #d96640;
    --color-accent-expense-active: #c85830;
    --color-accent-expense-subtle: rgba(232, 119, 80, 0.10);

    /* Accent — Income */
    --color-income:        #2a9d68;
    --color-income-hover:  #238d5a;
    --color-income-active: #1d7d4f;
    --color-income-subtle: rgba(42, 157, 104, 0.10);

    /* Supporting accents */
    --color-accent-teal: #1d9d90;
    --color-accent-gold: #c49a3c;

    /* Status */
    --color-status-success: #2a9d68;
    --color-status-warning: #c49a3c;
    --color-status-error:   #d64f4f;
    --color-status-info:    #1d9d90;

    /* Surfaces / overlays */
    --color-pill:        rgba(31, 26, 23, 0.045);
    --color-pill-active: rgba(232, 119, 80, 0.12);
    --color-overlay:     rgba(20, 16, 12, 0.50);
    --color-backdrop:    rgba(255, 255, 255, 0.34);

    /* Navigation */
    --color-nav-bg:          rgba(255, 252, 247, 0.92);
    --color-nav-border:      rgba(31, 26, 23, 0.07);
    --color-nav-item:        rgba(94, 84, 72, 0.50);
    --color-nav-item-active: #e87750;
    --color-nav-add-bg:      #e87750;
    --color-nav-add-fg:      #ffffff;

    /* Shadows */
    --shadow-sm:    0 2px 6px rgba(67, 51, 36, 0.08);
    --shadow-md:    0 8px 18px rgba(67, 51, 36, 0.10);
    --shadow-lg:    0 14px 32px rgba(67, 51, 36, 0.12);
    --shadow-sheet: 0 -8px 28px rgba(67, 51, 36, 0.14);
    --shadow-focus: 0 0 0 3px rgba(232, 119, 80, 0.25);

    /* Legacy aliases */
    --bg:          var(--color-bg-primary);
    --bg-accent:   var(--color-bg-accent);
    --surface:     var(--color-bg-surface);
    --surface-2:   var(--color-bg-surface-2);
    --surface-3:   var(--color-bg-surface-3);
    --surface-4:   var(--color-bg-surface-raised);
    --fg:          var(--color-text-primary);
    --fg-soft:     var(--color-text-secondary);
    --fg-muted:    var(--color-text-tertiary);
    --border:      var(--color-border-primary);
    --shadow:      var(--shadow-lg);
    --shadow-soft: var(--shadow-md);
    --accent:      var(--color-accent-expense);
    --accent-2:    var(--color-accent-teal);
    --accent-3:    var(--color-accent-gold);
    --positive:    var(--color-income);
    --danger:      var(--color-status-error);
    --pill:        var(--color-pill);
    --nav-bg:      var(--color-nav-bg);
    --backdrop:    var(--color-backdrop);
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      /* Inherits dark values from :root above */
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :root {
      --dur-instant: 0ms;
      --dur-fast:    0ms;
      --dur-normal:  0ms;
      --dur-slow:    0ms;
      --dur-slower:  0ms;
    }
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: "SF Pro Text", "SF Pro Display", "Segoe UI Variable Text", "Inter", "Avenir Next", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overscroll-behavior: none;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    touch-action: manipulation;
  }
  html, body {
    height: 100%;
    min-height: 100vh;
    min-height: 100dvh;
  }
  body {
    overflow-x: hidden;
  }

  /* Prevent iOS from auto-zooming when focusing inputs (requires ≥16px) */
  input, select, textarea {
    font-size: var(--text-md);
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
    background: transparent;
  }

  .view {
    display: none;
    min-height: 100vh;
    min-height: 100dvh;
    padding:
      max(20px, env(safe-area-inset-top))
      var(--space-6)
      calc(var(--nav-h) + 20px + env(safe-area-inset-bottom));
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
    background: transparent;
  }

  @keyframes viewEnter {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .view.active {
    display: block;
    animation: viewEnter var(--dur-normal) var(--ease-out) both;
  }

  .view.add-view {
    padding-bottom: calc(var(--nav-h) + 32px + env(safe-area-inset-bottom));
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
    font-size: var(--text-2xl);
    line-height: 1;
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
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
    font-size: var(--text-xl);
    letter-spacing: var(--tracking-tight);
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
    font-size: var(--text-lg);
  }

  .menu-btn {
    width: 38px;
    height: 38px;
    border: none;
    background: transparent;
    color: var(--fg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    border-radius: 10px;
    cursor: pointer;
  }
  .menu-btn:active { background: var(--surface-2); }
  .menu-btn svg { width: 22px; height: 22px; }

  /* ── Side drawer ── */
  .drawer-overlay {
    position: fixed; inset: 0;
    background: var(--color-overlay, rgba(0,0,0,.5));
    opacity: 0; pointer-events: none;
    transition: opacity 180ms ease-out;
    z-index: 90;
  }
  .drawer-overlay.open { opacity: 1; pointer-events: auto; }
  .side-drawer {
    position: fixed; left: 0; top: 0;
    width: min(280px, 80vw);
    height: 100dvh;
    background: var(--color-sheet-bg, var(--surface));
    box-shadow: 8px 0 32px rgba(0,0,0,.18);
    transform: translateX(-100%);
    transition: transform 220ms ease-out;
    display: flex; flex-direction: column;
    z-index: 100;
    padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
  }
  .side-drawer.open { transform: translateX(0); }
  .drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 16px 12px; border-bottom: 1px solid var(--border);
  }
  .drawer-brand {
    display: flex; align-items: center; gap: 10px;
    font-weight: var(--weight-semibold);
    color: var(--fg);
  }
  .drawer-brand-mark {
    width: 32px; height: 32px;
    border-radius: 10px;
    background: var(--color-accent, var(--accent));
    color: white;
    display: inline-flex; align-items: center; justify-content: center;
    font-weight: 700;
  }
  .drawer-nav { flex: 1; overflow-y: auto; padding: 8px 8px; }
  .drawer-item {
    display: flex; align-items: center; gap: 12px;
    width: 100%; padding: 12px 12px;
    border: none; background: transparent;
    text-align: left;
    border-radius: 12px;
    color: var(--fg);
    font-size: var(--text-base);
    cursor: pointer;
  }
  .drawer-item:hover, .drawer-item:active { background: var(--surface-2); }
  .drawer-item svg { color: var(--fg-soft); flex-shrink: 0; }
  .drawer-item-disabled { color: var(--fg-muted, var(--fg-soft)); opacity: .55; cursor: not-allowed; }
  .drawer-item-tag {
    margin-left: auto;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--surface-2);
    color: var(--fg-soft);
  }
  .drawer-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    color: var(--fg-soft);
    font-size: var(--text-xs);
    text-align: center;
  }

  /* ── Settings view ── */
  .settings-tabs {
    display: flex; gap: 6px;
    padding: 4px; margin: 4px 0 14px;
    background: var(--surface-2);
    border-radius: 14px;
  }
  .settings-tab {
    flex: 1; padding: 10px 8px;
    border: none; background: transparent;
    color: var(--fg-soft);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    border-radius: 10px;
    cursor: pointer;
  }
  .settings-tab.active {
    background: var(--surface);
    color: var(--fg);
    box-shadow: var(--shadow-soft);
  }
  .settings-list {
    display: flex; flex-direction: column;
    gap: 8px; padding-bottom: 120px;
  }
  .settings-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .settings-row-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--surface-2);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 22px;
    cursor: pointer;
    flex-shrink: 0;
    overflow: hidden;
  }
  .settings-row-icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
  .settings-row-icon svg { width: 22px; height: 22px; }
  .settings-row-name {
    flex: 1;
    border: none; background: transparent;
    color: var(--fg);
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    padding: 6px 4px;
    outline: none;
    border-bottom: 1px solid transparent;
  }
  .settings-row-name:focus {
    border-bottom-color: var(--color-accent, var(--accent));
  }
  .settings-row-meta {
    color: var(--fg-soft);
    font-size: var(--text-xs);
    margin-top: 2px;
  }
  .settings-row-edit {
    width: 32px; height: 32px;
    border: none; background: transparent;
    color: var(--fg-soft);
    cursor: pointer;
    border-radius: 8px;
  }
  .settings-row-edit:hover { background: var(--surface-2); }
  .settings-row-delete {
    width: 32px; height: 32px;
    border: none; background: transparent;
    color: var(--color-status-error);
    opacity: 0.45;
    cursor: pointer; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
    transition: opacity 140ms ease, background 140ms ease;
  }
  .settings-row-delete:hover { opacity: 1; background: rgba(244,106,106,0.12); }
  .settings-add-form {
    display: flex; flex-direction: column; gap: 10px;
    padding: 14px;
    background: var(--color-bg-surface);
    border: 1.5px solid var(--color-border-focus);
    border-radius: 14px;
  }
  .settings-add-input {
    width: 100%; box-sizing: border-box;
    border: 1px solid var(--color-border-primary);
    border-radius: 10px;
    background: var(--color-bg-surface-2);
    color: var(--color-text-primary);
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    padding: 10px 14px;
    outline: none;
    transition: border-color 150ms ease;
  }
  .settings-add-input:focus { border-color: var(--color-border-focus); }
  .settings-add-cat-select {
    width: 100%; box-sizing: border-box;
    background: var(--color-bg-surface-2);
    border: 1px solid var(--color-border-primary);
    border-radius: 10px; padding: 10px 14px;
    color: var(--color-text-primary);
    font-size: var(--text-sm); height: 42px;
  }
  .settings-add-actions {
    display: flex; gap: 8px; justify-content: flex-end;
  }
  .settings-add-cancel-btn {
    padding: 8px 16px; border-radius: 10px;
    border: 1px solid var(--color-border-primary);
    background: transparent; color: var(--color-text-secondary);
    font-size: var(--text-sm); font-weight: var(--weight-medium);
    cursor: pointer;
  }
  .settings-add-save-btn {
    padding: 8px 18px; border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, var(--color-accent-expense), var(--color-accent-expense-hover));
    color: #fff;
    font-size: var(--text-sm); font-weight: var(--weight-semibold);
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease;
    box-shadow: 0 4px 12px var(--color-accent-expense-subtle);
  }
  .settings-add-save-btn:active { transform: scale(0.97); }

  /* ── Icon picker sheet ── */
  .icon-picker-overlay {
    position: fixed; inset: 0;
    background: var(--color-overlay, rgba(0,0,0,.5));
    opacity: 0; pointer-events: none;
    transition: opacity 180ms ease-out;
    z-index: 110;
  }
  .icon-picker-overlay.open { opacity: 1; pointer-events: auto; }
  .icon-picker-sheet {
    position: fixed; left: 0; right: 0; bottom: 0;
    max-height: 80dvh;
    background: var(--color-sheet-bg, var(--surface));
    border-radius: var(--sheet-radius, 24px) var(--sheet-radius, 24px) 0 0;
    box-shadow: var(--shadow-sheet, 0 -8px 32px rgba(0,0,0,.4));
    transform: translateY(100%);
    transition: transform 240ms ease-out;
    z-index: 120;
    display: flex; flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .icon-picker-sheet.open { transform: translateY(0); }
  .icon-picker-handle {
    width: 36px; height: 4px;
    background: var(--border);
    border-radius: 2px;
    margin: 10px auto 4px;
  }
  .icon-picker-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 16px 4px;
  }
  .icon-picker-title { font-size: var(--text-lg); font-weight: var(--weight-semibold); margin: 0; }
  .icon-picker-tabs {
    display: flex; gap: 4px;
    padding: 0 12px 8px;
    border-bottom: 1px solid var(--border);
  }
  .icon-picker-tab {
    padding: 8px 12px;
    border: none; background: transparent;
    color: var(--fg-soft);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    border-radius: 10px;
    cursor: pointer;
    position: relative;
  }
  .icon-picker-tab.active { color: var(--fg); }
  .icon-picker-tab.active::after {
    content: "";
    position: absolute; left: 12px; right: 12px; bottom: -8px;
    height: 2px;
    background: var(--color-accent, var(--accent));
    border-radius: 2px;
  }
  .icon-picker-body { flex: 1; overflow-y: auto; padding: 14px 16px 24px; }
  .icon-picker-panel { display: none; }
  .icon-picker-panel.active { display: block; }
  .icon-picker-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 6px;
    margin-top: 12px;
  }
  .icon-picker-cell {
    aspect-ratio: 1;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    cursor: pointer;
    overflow: hidden;
  }
  .icon-picker-cell:active { transform: scale(0.92); }
  .icon-picker-cell.selected {
    border-color: var(--color-accent, var(--accent));
    background: color-mix(in srgb, var(--color-accent, var(--accent)) 12%, transparent);
  }
  .icon-picker-cell svg { width: 24px; height: 24px; }
  .icon-picker-cell img { width: 100%; height: 100%; object-fit: cover; }

  @media (prefers-reduced-motion: reduce) {
    .drawer-overlay, .side-drawer, .icon-picker-overlay, .icon-picker-sheet {
      transition: none;
    }
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
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-normal);
    cursor: pointer;
    white-space: nowrap;
  }

  .search-capsule .sicon {
    font-size: var(--text-md);
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
    font-size: var(--text-3xl);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    margin-top: 6px;
    font-variant-numeric: tabular-nums;
  }

  .hero-meta {
    color: var(--fg-soft);
    font-size: var(--text-sm);
    margin-top: 6px;
  }

  .hero-badge {
    align-self: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(235, 124, 85, 0.12);
    color: var(--accent);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    white-space: nowrap;
    letter-spacing: var(--tracking-wide);
  }

  /* ── Home screen ── */
  .home-balance-card {
    padding: var(--space-8) var(--space-6) var(--space-7);
    margin-bottom: var(--space-6);
    text-align: center;
    background:
      linear-gradient(135deg, rgba(235, 124, 85, 0.10), transparent 55%),
      linear-gradient(215deg, rgba(83, 189, 176, 0.08), transparent 50%),
      linear-gradient(180deg, var(--color-bg-surface-2), var(--color-bg-surface));
  }
  .home-balance-eyebrow {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-3);
  }
  .home-balance-amount {
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 6.5vw, var(--text-4xl));
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    margin-bottom: var(--space-3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .home-balance-meta {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }
  .home-balance-badge {
    display: inline-block;
    margin-top: var(--space-3);
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background: var(--color-accent-expense-subtle);
    color: var(--color-accent-expense);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
  }
  .home-summary-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }
  .home-summary-card {
    padding: var(--space-5) var(--space-5);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border-primary);
    background: var(--color-bg-surface);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    cursor: pointer;
    transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
    -webkit-tap-highlight-color: transparent;
    min-width: 0;
    overflow: hidden;
  }
  .home-summary-card:active { background: var(--color-bg-surface-2); }
  .home-summary-type {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    margin-bottom: var(--space-2);
  }
  .home-summary-card.income .home-summary-type   { color: var(--color-income); }
  .home-summary-card.expense .home-summary-type  { color: var(--color-accent-expense); }
  .home-summary-amount {
    font-family: var(--font-display);
    font-size: clamp(0.75rem, 3.8vw, var(--text-xl));
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-snug);
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .home-summary-card.income .home-summary-amount  { color: var(--color-income); }
  .home-summary-card.expense .home-summary-amount { color: var(--color-accent-expense); }
  .home-summary-count {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    margin-top: var(--space-1);
  }
  .home-recent-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }
  .home-recent-title {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }
  .home-see-all {
    font-size: var(--text-sm);
    color: var(--color-accent-expense);
    font-weight: var(--weight-medium);
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
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
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    cursor: pointer;
    transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease),
                border-color var(--dur-fast) var(--ease), transform var(--dur-instant) var(--ease);
  }
  .period-tab:active { transform: scale(0.95); }

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
    margin: 28px 0 12px;
  }

  .section-label h2 {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    margin: 0;
    letter-spacing: var(--tracking-snug);
  }

  .section-label .hint {
    font-size: var(--text-2xs);
    color: var(--fg-muted);
  }

  .list-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .day-group {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .day-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 4px;
  }

  .day-title {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--fg-muted);
    font-weight: var(--weight-semibold);
  }

  .day-total {
    font-size: var(--text-sm);
    color: var(--fg-soft);
    font-weight: var(--weight-medium);
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
    font-size: var(--text-xl);
    line-height: 1;
  }

  .expense-name {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-snug);
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
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
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
    font-size: var(--text-2xs);
  }

  .expense-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  .expense-card {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background var(--dur-fast) var(--ease), transform var(--dur-instant) var(--ease);
  }
  .expense-card:active {
    background: var(--color-bg-surface-3);
    transform: scale(0.97);
  }
  .expense-amount {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-snug);
    font-variant-numeric: tabular-nums;
    color: var(--color-accent-expense);
  }
  .expense-amount.income-amount {
    color: var(--color-income);
  }
  .expense-chevron {
    font-size: var(--text-lg);
    color: var(--color-text-tertiary);
    margin-top: 2px;
  }

  /* ── Type tabs (All / Income / Expenses) ── */
  .type-tabs {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .type-tabs::-webkit-scrollbar { display: none; }
  .type-tab {
    flex-shrink: 0;
    padding: 0 var(--space-5);
    height: var(--chip-h);
    border-radius: var(--chip-radius);
    border: 1px solid var(--color-border-primary);
    background: var(--color-bg-surface-raised);
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    cursor: pointer;
    transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease),
                border-color var(--dur-fast) var(--ease), transform var(--dur-instant) var(--ease);
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .type-tab:active { transform: scale(0.95); }
  .type-tab.active {
    background: var(--color-pill-active);
    border-color: var(--color-accent-expense);
    color: var(--color-accent-expense);
    font-weight: var(--weight-semibold);
  }
  .type-tab.income-tab.active {
    background: var(--color-income-subtle);
    border-color: var(--color-income);
    color: var(--color-income);
  }
  /* delete-btn / edit-btn removed — actions moved to transaction detail sheet */

  .loader-state {
    padding: 32px 20px;
    text-align: center;
    color: var(--fg-soft);
  }
  .loader-state .big { font-size: var(--text-3xl); margin-bottom: 10px; }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px 40px;
    text-align: center;
    gap: 8px;
  }
  .empty-state-icon {
    font-size: var(--text-3xl);
    line-height: 1;
    margin-bottom: 4px;
    opacity: 0.7;
  }
  .empty-state-msg {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    color: var(--fg-muted);
    line-height: var(--leading-snug);
  }
  .empty-state-hint {
    font-size: var(--text-sm);
    color: var(--fg-soft);
    line-height: var(--leading-normal);
  }
  .empty-state-cta {
    margin-top: 12px;
    padding: 10px 20px;
    border-radius: 99px;
    background: var(--color-accent-expense);
    color: #fff;
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    border: none;
    cursor: pointer;
  }
  .empty-state-cta.income { background: var(--color-income); }
  .empty-state-cta:active { opacity: 0.8; }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .skel {
    background: linear-gradient(90deg,
      var(--color-bg-surface) 0%,
      var(--color-bg-elevated) 45%,
      var(--color-bg-surface) 90%);
    background-size: 1200px 100%;
    animation: shimmer 1.8s infinite linear;
    border-radius: 8px;
  }
  @media (prefers-reduced-motion: reduce) {
    .skel { animation: none; background: var(--color-bg-elevated); }
  }
  .skel-card {
    height: 72px;
    margin-bottom: 8px;
    border-radius: var(--radius-card);
  }
  .skel-hero-num {
    height: 52px;
    width: 55%;
    margin: 0 auto 10px;
    border-radius: 10px;
  }
  .skel-hero-sub {
    height: 18px;
    width: 35%;
    margin: 0 auto;
    border-radius: 6px;
  }
  .skel-block {
    height: 100px;
    border-radius: var(--radius-card);
    margin-bottom: 12px;
  }

  /* Legacy summary-grid kept in case used elsewhere */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 18px;
  }
  .summary-card {
    padding: 18px;
    background: linear-gradient(180deg, var(--color-bg-surface-2), var(--color-bg-surface));
  }

  /* Analytics stat row */
  .analytics-stat-row {
    display: flex;
    align-items: stretch;
    gap: 0;
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-lg);
    background: var(--color-bg-surface);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    margin-bottom: var(--space-5);
  }
  .analytics-stat {
    flex: 1;
    padding: var(--space-6) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  .analytics-stat-divider {
    width: 1px;
    background: var(--color-border-primary);
    margin: var(--space-5) 0;
  }
  .analytics-stat-label {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
  }
  .income-stat .analytics-stat-label  { color: var(--color-income); }
  .expense-stat .analytics-stat-label { color: var(--color-accent-expense); }
  .analytics-stat-value {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
    margin-top: var(--space-1);
  }
  .income-stat .analytics-stat-value  { color: var(--color-income); }
  .expense-stat .analytics-stat-value { color: var(--color-accent-expense); }
  .analytics-stat-sub {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .back-btn {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--fg-soft);
    box-shadow: var(--shadow-soft);
    border-radius: 14px;
    padding: 9px 13px;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .summary-kicker {
    font-size: var(--text-xs);
    color: var(--fg-muted);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  .summary-value {
    margin-top: 6px;
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    font-variant-numeric: tabular-nums;
  }

  .summary-note {
    margin-top: 6px;
    font-size: var(--text-2xs);
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
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .chart-subtitle {
    margin: 4px 0 0;
    color: var(--fg-soft);
    font-size: var(--text-2xs);
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
    transition: transform var(--dur-instant) var(--ease);
    -webkit-tap-highlight-color: transparent;
  }
  .legend-row:active { transform: scale(0.98); }

  .legend-chevron {
    color: var(--fg-muted);
    font-size: var(--text-sm);
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
    font-size: var(--text-md);
    font-weight: var(--weight-bold);
  }

  .legend-name {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
  }

  .legend-sub {
    margin-top: 3px;
    font-size: var(--text-2xs);
    color: var(--fg-soft);
  }

  .legend-value {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
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
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
  }

  .required-dot {
    color: var(--accent);
  }

  .field-optional {
    color: var(--fg-muted);
    text-transform: none;
    letter-spacing: var(--tracking-normal);
    font-weight: var(--weight-medium);
    opacity: 0.75;
  }

  .amount-shell {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .amount-symbol {
    font-size: var(--text-2xl);
    color: var(--fg-muted);
    font-weight: var(--weight-bold);
    margin-top: 6px;
  }

  .amount-input {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--fg);
    font-size: var(--text-4xl);
    line-height: 1;
    letter-spacing: var(--tracking-tight);
    font-weight: var(--weight-bold);
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
    font-size: var(--text-md);
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
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    padding: 6px 0 2px;
    cursor: pointer;
    letter-spacing: var(--tracking-normal);
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
    gap: 10px;
    padding: 12px 16px;
    border-radius: 999px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    color: var(--fg-soft);
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
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
    width: 28px;
    height: 28px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--surface-4);
    font-size: var(--text-base);
    flex-shrink: 0;
  }
  .chip-icon img,
  .chip-icon svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .chip-icon span,
  .chip-icon .icon-emoji {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chip-remove {
    font-size: var(--text-2xs);
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
    font-weight: var(--weight-semibold);
  }

  .save-btn {
    width: 100%;
    padding: 16px 18px;
    border: none;
    border-radius: var(--radius-2xl);
    color: #fff;
    background: linear-gradient(135deg, var(--color-accent-expense), var(--color-accent-expense-hover));
    box-shadow: 0 10px 22px var(--color-accent-expense-subtle);
    font-size: var(--text-md);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-snug);
    cursor: pointer;
    transition: transform var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
  }
  .save-btn:active {
    transform: scale(0.98);
    box-shadow: 0 4px 12px var(--color-accent-expense-subtle);
  }
  .save-btn:disabled {
    opacity: 0.5;
    box-shadow: none;
  }
  .save-btn.income-save-btn {
    background: linear-gradient(135deg, var(--color-income), var(--color-income-hover));
    box-shadow: 0 10px 22px var(--color-income-subtle);
  }
  .save-btn.income-save-btn:active {
    box-shadow: 0 4px 12px var(--color-income-subtle);
  }
  .amount-shell.income-shell .amount-symbol {
    color: var(--color-income);
  }
  .amount-shell.income-shell .amount-input {
    color: var(--color-income);
  }
  .form-type-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 4px var(--space-4);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }
  .form-type-badge.expense-badge {
    background: var(--color-accent-expense-subtle);
    color: var(--color-accent-expense);
  }
  .form-type-badge.income-badge {
    background: var(--color-income-subtle);
    color: var(--color-income);
  }
  .form-type-badge.transfer-badge {
    background: var(--color-accent-subtle, rgba(99,102,241,0.12));
    color: var(--color-accent, #6366f1);
  }

  .helper-text {
    margin-top: 12px;
    text-align: center;
    color: var(--fg-muted);
    font-size: var(--text-2xs);
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
    font-size: var(--text-base);
    appearance: none;
    -webkit-appearance: none;
  }

  /* ── Side menu ── */
  /* Side menu hidden — replaced by bottom nav */
  .side-overlay, .side-menu { display: none !important; }

  /* ── Bottom tab bar ── */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(var(--nav-h) + env(safe-area-inset-bottom, 0px));
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background: var(--color-nav-bg);
    border-top: 1px solid var(--color-nav-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 50;
    will-change: transform;
    transform: translateZ(0);
  }
  .bottom-nav.nav-ready {
    transition: transform var(--dur-normal) var(--ease);
  }
  .bottom-nav.hidden {
    transform: translateY(100%);
  }
  .nav-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 6px 0;
    height: 100%;
    border: none;
    background: transparent;
    color: var(--color-nav-item);
    cursor: pointer;
    min-width: 44px;
    min-height: 44px;
    transition: color var(--dur-fast) var(--ease);
    -webkit-tap-highlight-color: transparent;
  }
  .nav-tab.active {
    color: var(--color-nav-item-active);
  }
  .nav-tab:active .nav-icon {
    transform: scale(0.88);
  }
  .nav-icon {
    line-height: 1;
    transition: transform var(--dur-fast) var(--ease-bounce);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }
  .nav-icon svg {
    width: 22px;
    height: 22px;
    display: block;
  }
  .nav-label {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    line-height: 1;
  }
  .nav-add-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 6px 0;
    height: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .nav-add-btn {
    width: var(--nav-add-size);
    height: var(--nav-add-size);
    border-radius: var(--radius-xl);
    background: var(--color-nav-add-bg);
    color: var(--color-nav-add-fg);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-2xl);
    font-weight: var(--weight-medium);
    line-height: 1;
    box-shadow: 0 4px 18px rgba(235, 124, 85, 0.36);
    transition: transform var(--dur-fast) var(--ease-bounce), box-shadow var(--dur-fast) var(--ease);
    pointer-events: none;
  }
  .nav-add-tab:active .nav-add-btn {
    transform: scale(0.91);
    box-shadow: 0 2px 8px rgba(235, 124, 85, 0.24);
  }

  /* ── Add type sheet ── */
  .add-sheet-overlay {
    position: fixed;
    inset: 0;
    z-index: 55;
    background: var(--color-overlay);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--dur-normal) var(--ease);
  }
  .add-sheet-overlay.open {
    opacity: 1;
    pointer-events: all;
  }
  .add-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 60;
    background: var(--color-sheet-bg);
    border-radius: var(--sheet-radius) var(--sheet-radius) 0 0;
    border-top: 1px solid var(--color-border-primary);
    box-shadow: var(--shadow-sheet);
    padding: var(--space-5) var(--space-6) calc(var(--space-9) + env(safe-area-inset-bottom));
    transform: translateY(100%);
    transition: transform var(--dur-slow) var(--ease-out);
  }
  .add-sheet.open {
    transform: translateY(0);
  }
  .add-sheet-handle {
    width: 36px;
    height: 4px;
    border-radius: var(--radius-full);
    background: var(--color-border-primary);
    margin: 0 auto var(--space-6);
  }
  .add-sheet-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
    letter-spacing: var(--tracking-snug);
    margin: 0 0 var(--space-7);
    text-align: center;
  }
  .add-sheet-choices {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }
  .add-sheet-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-7) var(--space-5);
    border-radius: var(--radius-lg);
    border: 1.5px solid var(--color-border-primary);
    background: var(--color-bg-surface);
    cursor: pointer;
    transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease-bounce);
    -webkit-tap-highlight-color: transparent;
  }
  .add-sheet-choice:active {
    transform: scale(0.96);
  }
  .add-sheet-expense {
    border-color: var(--color-accent-expense-subtle);
  }
  .add-sheet-expense:active, .add-sheet-expense:hover {
    background: var(--color-accent-expense-subtle);
    border-color: var(--color-accent-expense);
  }
  .add-sheet-income {
    border-color: var(--color-income-subtle);
  }
  .add-sheet-income:active, .add-sheet-income:hover {
    background: var(--color-income-subtle);
    border-color: var(--color-income);
  }
  .add-sheet-choice-icon {
    font-size: var(--text-3xl);
    font-weight: var(--weight-bold);
    line-height: 1;
  }
  .add-sheet-expense .add-sheet-choice-icon { color: var(--color-accent-expense); }
  .add-sheet-income .add-sheet-choice-icon  { color: var(--color-income); }
  .add-sheet-choice-label {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
    letter-spacing: var(--tracking-snug);
  }
  .add-sheet-choice-sub {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  /* ── Transaction detail sheet ── */
  .txn-sheet {
    padding-bottom: calc(var(--space-9) + env(safe-area-inset-bottom));
  }
  .txn-sheet-amount-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-3);
  }
  .txn-sheet-amount {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-tight);
    font-variant-numeric: tabular-nums;
    color: var(--color-accent-expense);
  }
  .txn-sheet-amount.income { color: var(--color-income); }
  .txn-sheet-type-badge {
    padding: 4px var(--space-4);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    background: var(--color-accent-expense-subtle);
    color: var(--color-accent-expense);
  }
  .txn-sheet-type-badge.income {
    background: var(--color-income-subtle);
    color: var(--color-income);
  }
  .txn-sheet-name {
    font-size: var(--text-xl);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
    letter-spacing: var(--tracking-snug);
    margin-bottom: var(--space-4);
  }
  .txn-sheet-meta {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-7);
    padding: var(--space-5);
    border-radius: var(--radius-md);
    background: var(--color-bg-surface-2);
    border: 1px solid var(--color-border-primary);
  }
  .txn-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
  }
  .txn-meta-key {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wider);
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }
  .txn-meta-val {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    font-weight: var(--weight-medium);
    text-align: right;
  }
  .txn-sheet-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }
  .txn-sheet-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-5);
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    cursor: pointer;
    border: 1px solid var(--color-border-primary);
    transition: background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease-bounce);
    -webkit-tap-highlight-color: transparent;
  }
  .txn-sheet-action-btn:active { transform: scale(0.96); }
  .txn-edit-btn {
    background: var(--color-bg-surface-2);
    color: var(--color-text-primary);
  }
  .txn-delete-btn {
    background: rgba(244, 106, 106, 0.08);
    border-color: rgba(244, 106, 106, 0.25);
    color: var(--color-status-error);
  }
  .txn-sheet-confirm {
    margin-top: var(--space-5);
    padding: var(--space-5);
    border-radius: var(--radius-md);
    background: rgba(244, 106, 106, 0.08);
    border: 1px solid rgba(244, 106, 106, 0.25);
  }
  .txn-sheet-confirm p {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-4);
    text-align: center;
  }
  .txn-sheet-confirm-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }
  .txn-confirm-cancel {
    padding: var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-primary);
    background: var(--color-bg-surface-2);
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    cursor: pointer;
  }
  .txn-confirm-delete {
    padding: var(--space-4);
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-status-error);
    color: #fff;
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    cursor: pointer;
  }

  .toast {
    position: fixed;
    left: 18px;
    right: 18px;
    bottom: calc(var(--nav-h) + 16px + env(safe-area-inset-bottom));
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
    transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease), visibility 0s linear var(--dur-fast);
    z-index: 50;
  }

  .toast.show {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
    transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease), visibility 0s linear 0s;
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
    transition: opacity var(--dur-normal) var(--ease);
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
    font-size: var(--text-3xl);
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

  @media (min-width: 768px) {
    /* Side rail width */
    :root { --nav-rail-w: 64px; }

    /* Bottom nav → left side rail */
    .bottom-nav {
      bottom: 0;
      right: auto;
      top: 0;
      width: var(--nav-rail-w);
      height: 100vh;
      height: 100dvh;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding: var(--space-9) 0;
      gap: var(--space-2);
      border-top: none;
      border-right: 1px solid var(--color-nav-border);
    }

    .nav-tab {
      width: 100%;
      padding: var(--space-4) 0;
    }

    .nav-label { display: none; }

    .nav-add-tab {
      width: 100%;
      padding: var(--space-4) 0;
    }

    /* App shell: push content right of rail */
    .app-shell {
      padding-left: var(--nav-rail-w);
    }

    /* Views: center at max-content width */
    .view {
      max-width: var(--max-content);
      margin-left: auto;
      margin-right: auto;
      padding-bottom: var(--space-10);
    }

    .view.add-view {
      padding-bottom: var(--space-11);
    }

    /* Toast: account for side rail */
    .toast {
      left: calc(var(--nav-rail-w) + var(--space-6));
      right: var(--space-6);
      transform: translateX(0) translateY(12px);
      max-width: var(--max-content);
      margin: 0 auto;
    }

    .toast.show {
      transform: translateX(0) translateY(0);
    }

    /* Sheets: offset from rail */
    #txnSheet, #addTypeSheet {
      left: var(--nav-rail-w);
    }
    #txnSheetOverlay, #addTypeOverlay {
      left: var(--nav-rail-w);
    }
  }

  @media (max-width: 420px) {
    .topbar {
      align-items: flex-start;
    }

    .screen-title {
      font-size: var(--text-2xl);
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
      font-size: var(--text-2xs);
    }

    .legend-row {
      grid-template-columns: 28px 1fr auto 16px;
      gap: 10px;
    }

    .legend-value {
      font-size: var(--text-sm);
    }
  }

  /* ── Sort box ── */
  .sort-box {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .sort-box-title {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: .5px;
    text-transform: uppercase;
    color: var(--fg-muted);
  }
  .sort-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sort-axis {
    font-size: var(--text-xs);
    color: var(--fg-muted);
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
    color: var(--fg-soft);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: var(--text-xs);
    cursor: pointer;
    white-space: nowrap;
    line-height: var(--leading-normal);
  }
  .sort-opt.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
    font-weight: var(--weight-semibold);
  }
</style>
</head>
<body>
<div id="pageLoader">
  <div class="loader-mark">+</div>
  <div class="loader-ring"></div>
  <div class="screen-subtitle" id="pageLoaderText">Syncing your data...</div>
</div>

<div class="app-shell">
  <section class="view active" id="homeView" data-view="home">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="menu-btn" data-open-drawer aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>
        <h1 class="screen-title">Overview</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="homeThemeBtn" title="Toggle theme" aria-label="Toggle theme">☀</button>
      </div>
    </div>

    <div class="period-tabs" id="homeTabs">
      <button class="period-tab active" data-scope="home" data-period="today">Day</button>
      <button class="period-tab" data-scope="home" data-period="week">Weekly</button>
      <button class="period-tab" data-scope="home" data-period="month">Monthly</button>
    </div>

    <div class="hero-card home-balance-card">
      <div class="home-balance-eyebrow">Total Spent</div>
      <div class="home-balance-amount" id="homeBalanceAmount">₹ 0</div>
      <div class="home-balance-meta" id="homeBalanceMeta">Loading...</div>
      <span class="home-balance-badge" id="homeBalanceBadge">Live</span>
    </div>

    <div class="home-summary-row">
      <button class="home-summary-card income" id="homeSummaryIncome" aria-label="View income">
        <div class="home-summary-type">Income</div>
        <div class="home-summary-amount" id="homeIncomeAmount">₹ 0</div>
        <div class="home-summary-count" id="homeIncomeCount">0 entries</div>
      </button>
      <button class="home-summary-card expense" id="homeSummaryExpense" aria-label="View expenses">
        <div class="home-summary-type">Expenses</div>
        <div class="home-summary-amount" id="homeExpenseAmount">₹ 0</div>
        <div class="home-summary-count" id="homeExpenseCount">0 entries</div>
      </button>
    </div>

    <div class="home-recent-label">
      <span class="home-recent-title">Transactions</span>
      <button class="home-see-all" id="homeSeeAllBtn">All txns →</button>
    </div>
    <div class="list-stack" id="homeRecentList">
      <div class="loader-state"><div class="big">...</div>Loading...</div>
    </div>
  </section>

  <section class="view" id="expensesView" data-view="expenses">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="menu-btn" data-open-drawer aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>
        <h1 class="screen-title">Transactions</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="refreshExpensesBtn" title="Refresh" aria-label="Refresh">↻</button>
      </div>
    </div>

    <div class="type-tabs" id="expensesTypeTabs" role="tablist" aria-label="Transaction type">
      <button class="type-tab active" data-type="all" role="tab" aria-selected="true">All</button>
      <button class="type-tab income-tab" data-type="income" role="tab" aria-selected="false">Income</button>
      <button class="type-tab" data-type="expense" role="tab" aria-selected="false">Expenses</button>
    </div>

    <div class="period-tabs" id="expensesTabs">
      <button class="period-tab active" data-scope="expenses" data-period="today">Day</button>
      <button class="period-tab" data-scope="expenses" data-period="week">Weekly</button>
      <button class="period-tab" data-scope="expenses" data-period="month">Monthly</button>
    </div>

    <div id="expSortBox" class="sort-box"></div>

    <div class="section-label">
      <h2>Activity</h2>
      <div class="hint" id="expensesCount">0 entries</div>
    </div>
    <div class="list-stack" id="expensesList">
      <div class="loader-state"><div class="big">...</div>Loading...</div>
    </div>
  </section>

  <section class="view add-view" id="addView" data-view="add">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="back-btn" id="cancelEditBtn">‹ Back</button>
        <h1 class="screen-title" id="addViewTitle">Add Expense</h1>
      </div>
      <div class="topbar-actions">
        <span class="form-type-badge expense-badge" id="addFormTypeBadge">↑ Expense</span>
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
      <div class="field-label">Description</div>
      <input id="expense" name="txnDescription" class="text-input" type="text" placeholder="Coffee, Uber, groceries..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" />
    </div>

    <div class="input-card" id="catCard">
      <div class="field-label">Category <span class="required-dot">*</span></div>
      <div class="chips" id="catChips"></div>
      <button type="button" class="expand-toggle" id="catExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="catSearchRow" hidden>
        <input id="catSearch" class="text-input" type="text" placeholder="Search category..." autocomplete="off" />
        <div id="catDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card" id="subCard">
      <div class="field-label">Subcategory <span class="field-optional">(optional)</span></div>
      <div class="chips" id="subChips"></div>
      <button type="button" class="expand-toggle" id="subExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="subSearchRow" hidden>
        <input id="subSearch" class="text-input" type="text" placeholder="Search subcategory..." autocomplete="off" />
        <div id="subDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card" id="acctCard">
      <div class="field-label">Account <span class="required-dot">*</span></div>
      <div class="chips" id="acctChips"></div>
      <button type="button" class="expand-toggle" id="acctExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="acctSearchRow" hidden>
        <input id="acctSearch" class="text-input" type="text" placeholder="Search account..." autocomplete="off" />
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

  <section class="view add-view" id="incomeView" data-view="income">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="back-btn" id="cancelIncomeBtn">‹ Back</button>
        <h1 class="screen-title" id="incomeViewTitle">Add Income</h1>
      </div>
      <div class="topbar-actions">
        <span class="form-type-badge income-badge" id="incomeFormBadge">↓ Income</span>
      </div>
    </div>

    <div class="type-tabs" id="incomeModeTabs">
      <button class="type-tab active" data-mode="income">Income</button>
      <button class="type-tab" data-mode="transfer">Transfer</button>
    </div>

    <div class="input-card">
      <div class="field-label">Amount <span class="required-dot">*</span></div>
      <div class="amount-shell income-shell">
        <div class="amount-symbol">₹</div>
        <input id="incomeAmount" class="amount-input" type="text" inputmode="decimal" placeholder="0" autocomplete="off" />
      </div>
    </div>

    <div class="input-card">
      <div class="field-label" id="incomeSourceLabel">Income Source</div>
      <input id="incomeSource" name="incomeNote" class="text-input" type="text" placeholder="Salary, Freelance, Dividends..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" inputmode="text" />
    </div>

    <div class="input-card" id="transferFromAcctCard" hidden>
      <div class="field-label">From Account <span class="required-dot">*</span></div>
      <div class="chips" id="transferFromAcctChips"></div>
      <button type="button" class="expand-toggle" id="transferFromAcctExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="transferFromAcctSearchRow" hidden>
        <input id="transferFromAcctSearch" class="text-input" type="text" placeholder="Search account..." autocomplete="off" />
        <div id="transferFromAcctDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card" id="incomeCatCard">
      <div class="field-label">Category <span class="required-dot">*</span></div>
      <div class="chips" id="incomeCatChips"></div>
      <button type="button" class="expand-toggle" id="incomeCatExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="incomeCatSearchRow" hidden>
        <input id="incomeCatSearch" class="text-input" type="text" placeholder="Search category..." autocomplete="off" />
        <div id="incomeCatDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card" id="incomeAcctCard">
      <div class="field-label" id="incomeAcctLabel">Account <span class="required-dot">*</span></div>
      <div class="chips" id="incomeAcctChips"></div>
      <button type="button" class="expand-toggle" id="incomeAcctExpandBtn" hidden>Show all ⌄</button>
      <div class="search-row" id="incomeAcctSearchRow" hidden>
        <input id="incomeAcctSearch" class="text-input" type="text" placeholder="Search account..." autocomplete="off" />
        <div id="incomeAcctDropdown" class="dropdown hidden"></div>
      </div>
    </div>

    <div class="input-card">
      <div class="field-label">Date And Time</div>
      <div class="input-row">
        <input id="incomeDate" class="date-input" type="date" />
        <input id="incomeTime" class="time-input" type="time" />
      </div>
    </div>

    <button id="incomeSaveBtn" class="save-btn income-save-btn">Save Income</button>
    <div class="helper-text" id="incomeLastSaved">Choose a category and account to save.</div>
  </section>

  <section class="view" id="analyticsView" data-view="analytics">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="menu-btn" data-open-drawer aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>
        <h1 class="screen-title">Analytics</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="refreshAnalyticsBtn" title="Refresh" aria-label="Refresh">↻</button>
      </div>
    </div>

    <div class="period-tabs" id="analyticsTabs">
      <button class="period-tab active" data-scope="analytics" data-period="today">Day</button>
      <button class="period-tab" data-scope="analytics" data-period="week">Weekly</button>
      <button class="period-tab" data-scope="analytics" data-period="month">Monthly</button>
    </div>

    <!-- Section 1: Income vs Expense comparison -->
    <div class="analytics-stat-row">
      <div class="analytics-stat income-stat">
        <div class="analytics-stat-label">Income</div>
        <div class="analytics-stat-value" id="analyticsIncomeTotal">₹ 0</div>
        <div class="analytics-stat-sub" id="analyticsIncomeNote">0 entries</div>
      </div>
      <div class="analytics-stat-divider"></div>
      <div class="analytics-stat expense-stat">
        <div class="analytics-stat-label">Spent</div>
        <div class="analytics-stat-value" id="analyticsTotal">₹ 0</div>
        <div class="analytics-stat-sub" id="analyticsCount">0 entries</div>
      </div>
    </div>

    <!-- Section 2: Spending trend -->
    <div class="chart-card">
      <div class="chart-head">
        <div>
          <h2 class="chart-title">Spending Trend</h2>
          <p class="chart-subtitle" id="analyticsTrendSubtitle">Daily spending pattern</p>
        </div>
      </div>
      <div class="chart-shell" id="trendChartShell">
        <svg class="chart-svg" id="trendChartSvg" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet"></svg>
      </div>
    </div>

    <!-- Section 3a: Income by source -->
    <div class="section-label">
      <h2>Income by Source</h2>
      <div class="hint" id="analyticsIncSrcSubtitle"></div>
    </div>
    <div class="legend-card" id="incomeSrcList"></div>

    <!-- Section 3b: Spending by account -->
    <div class="section-label">
      <h2>Spending by Account</h2>
      <div class="hint" id="analyticsAcctSubtitle"></div>
    </div>
    <div class="legend-card" id="acctSpendList"></div>

    <!-- Section 4: Top categories list -->
    <div class="section-label">
      <h2>Top Categories</h2>
      <div class="hint" id="analyticsTopCategoryNote"></div>
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
        <button class="icon-btn" id="searchExportBtn" title="Export results as CSV" aria-label="Export CSV"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
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
        <div id="searchTotal" style="display:none; font-size:var(--text-base); font-weight:var(--weight-bold); color:var(--fg);"></div>
      </div>
    </div>
    <div class="list-stack" id="searchResults">
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-msg">Search your transactions</div>
        <div class="empty-state-hint">Enter dates above to filter results</div>
      </div>
    </div>
  </section>

  <section class="view" id="categoryDetailView" data-view="categoryDetail">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="back-btn" id="categoryDetailBackBtn">‹ Back</button>
        <h1 class="screen-title" id="categoryDetailTitle">Category</h1>
      </div>
      <div class="topbar-actions"></div>
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

    <div id="catDetailSortBox" class="sort-box" style="margin-top: 12px; margin-bottom: 28px;"></div>

    <div class="list-stack" id="categoryDetailList">
      <div class="empty-state">
        <div class="empty-state-icon">📂</div>
        <div class="empty-state-msg">No transactions here</div>
        <div class="empty-state-hint">Nothing logged in this category for this period</div>
      </div>
    </div>
  </section>

  <section class="view" id="settingsView" data-view="settings">
    <div class="topbar">
      <div class="topbar-leading">
        <button class="back-btn" data-back-from-settings>‹ Back</button>
        <h1 class="screen-title">Settings</h1>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" id="settingsAddBtn" aria-label="Add new" title="Add new" style="font-size:22px; font-weight:300; color:var(--color-accent-expense);">+</button>
      </div>
    </div>
    <div class="settings-tabs" id="settingsTabs" role="tablist" aria-label="Settings sections">
      <button class="settings-tab active" data-settings-tab="categories" role="tab" aria-selected="true">Categories</button>
      <button class="settings-tab" data-settings-tab="subcategories" role="tab" aria-selected="false">Subcategories</button>
      <button class="settings-tab" data-settings-tab="accounts" role="tab" aria-selected="false">Accounts</button>
    </div>
    <div class="settings-list" id="settingsList"></div>
  </section>

</div>

<!-- Side drawer (mobile menu) -->
<div id="drawerOverlay" class="drawer-overlay" aria-hidden="true"></div>
<aside id="sideDrawer" class="side-drawer" role="dialog" aria-modal="true" aria-label="App menu" aria-hidden="true">
  <div class="drawer-header">
    <div class="drawer-brand">
      <span class="drawer-brand-mark">+</span>
      <span class="drawer-brand-name">Casex Expense</span>
    </div>
    <button class="icon-btn" id="drawerCloseBtn" aria-label="Close menu">×</button>
  </div>
  <nav class="drawer-nav">
    <button class="drawer-item" data-drawer-action="settings">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6 1.65 1.65 0 0010 3.09V3a2 2 0 114 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
      <span>Settings</span>
    </button>
    <button class="drawer-item" data-drawer-action="theme">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      <span>Toggle Theme</span>
    </button>
  </nav>
  <div class="drawer-footer">v1.0 · Casex Expense App</div>
</aside>

<!-- Icon picker sheet -->
<div id="iconPickerOverlay" class="icon-picker-overlay" aria-hidden="true"></div>
<div id="iconPickerSheet" class="icon-picker-sheet" role="dialog" aria-modal="true" aria-label="Pick an icon" aria-hidden="true">
  <div class="icon-picker-handle"></div>
  <div class="icon-picker-header">
    <h2 class="icon-picker-title" id="iconPickerTitle">Pick an icon</h2>
    <button class="icon-btn" id="iconPickerCloseBtn" aria-label="Close">×</button>
  </div>
  <div class="icon-picker-tabs" id="iconPickerTabs" role="tablist">
    <button class="icon-picker-tab" data-picker-tab="icons" role="tab">Icons</button>
    <button class="icon-picker-tab active" data-picker-tab="emoji" role="tab" aria-selected="true">Emoji</button>
    <button class="icon-picker-tab" data-picker-tab="brands" role="tab">Brands</button>
    <button class="icon-picker-tab" data-picker-tab="banks" role="tab" data-banks-only hidden>Banks</button>
  </div>
  <div class="icon-picker-body">
    <div class="icon-picker-panel" data-picker-panel="icons">
      <div class="icon-picker-grid" id="iconPickerIconsGrid"></div>
    </div>
    <div class="icon-picker-panel active" data-picker-panel="emoji">
      <div style="display:grid; grid-template-columns:1fr auto; gap:10px; margin-bottom:14px; align-items:stretch;">
        <input id="iconPickerEmojiInput" class="text-input" type="text" placeholder="Type or paste any emoji…" maxlength="8" size="1" autocomplete="off" style="width:100%; min-width:0; height:54px; font-size:24px; padding:0 18px; text-align:center; box-sizing:border-box;" />
        <button id="iconPickerEmojiUseBtn" class="save-btn" type="button" style="height:54px; padding:0 24px; font-size:15px; white-space:nowrap;">Use</button>
      </div>
      <div class="icon-picker-grid" id="iconPickerEmojiGrid"></div>
    </div>
    <div class="icon-picker-panel" data-picker-panel="brands">
      <div class="icon-picker-grid" id="iconPickerBrandsGrid" style="grid-template-columns: repeat(4, minmax(0, 1fr));"></div>
    </div>
    <div class="icon-picker-panel" data-picker-panel="banks">
      <div class="icon-picker-grid" id="iconPickerBanksGrid" style="grid-template-columns: repeat(4, minmax(0, 1fr));"></div>
    </div>
  </div>
</div>

<nav class="bottom-nav" id="bottomNav" role="tablist" aria-label="Main navigation">
  <button class="nav-tab active" id="navTabHome" data-nav-view="home" role="tab" aria-label="Home" aria-selected="true">
    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12L12 4l9 8"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg></span>
    <span class="nav-label">Home</span>
  </button>
  <button class="nav-tab" id="navTabExpenses" data-nav-view="expenses" role="tab" aria-label="Transactions" aria-selected="false">
    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><line x1="4" y1="6" x2="4" y2="6"/><line x1="4" y1="12" x2="4" y2="12"/><line x1="4" y1="18" x2="4" y2="18"/></svg></span>
    <span class="nav-label">Txns</span>
  </button>
  <button class="nav-add-tab" id="navTabAdd" aria-label="Add transaction">
    <div class="nav-add-btn">+</div>
  </button>
  <button class="nav-tab" id="navTabAnalytics" data-nav-view="analytics" role="tab" aria-label="Analytics" aria-selected="false">
    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg></span>
    <span class="nav-label">Stats</span>
  </button>
  <button class="nav-tab" id="navTabSearch" data-nav-view="search" role="tab" aria-label="Search" aria-selected="false">
    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
    <span class="nav-label">Search</span>
  </button>
</nav>

<!-- Add type sheet -->
<div id="addSheetOverlay" class="add-sheet-overlay" role="dialog" aria-modal="true" aria-label="Add transaction"></div>
<div id="addSheet" class="add-sheet">
  <div class="add-sheet-handle"></div>
  <h2 class="add-sheet-title">Add Transaction</h2>
  <div class="add-sheet-choices">
    <button class="add-sheet-choice add-sheet-expense" id="addSheetExpenseBtn">
      <span class="add-sheet-choice-icon">↑</span>
      <span class="add-sheet-choice-label">Expense</span>
      <span class="add-sheet-choice-sub">Money out</span>
    </button>
    <button class="add-sheet-choice add-sheet-income" id="addSheetIncomeBtn">
      <span class="add-sheet-choice-icon">↓</span>
      <span class="add-sheet-choice-label">Income</span>
      <span class="add-sheet-choice-sub">Money in</span>
    </button>
  </div>
</div>

<!-- Transaction detail sheet -->
<div id="txnSheetOverlay" class="add-sheet-overlay"></div>
<div id="txnSheet" class="add-sheet txn-sheet" role="dialog" aria-modal="true" aria-label="Transaction details">
  <div class="add-sheet-handle"></div>
  <div class="txn-sheet-amount-row">
    <div class="txn-sheet-amount" id="txnSheetAmount">₹ 0</div>
    <span class="txn-sheet-type-badge" id="txnSheetTypeBadge">Expense</span>
  </div>
  <div class="txn-sheet-name" id="txnSheetName"></div>
  <div class="txn-sheet-meta" id="txnSheetMeta"></div>
  <div class="txn-sheet-actions">
    <button class="txn-sheet-action-btn txn-edit-btn" id="txnSheetEditBtn">
      <span>✏</span> Edit
    </button>
    <button class="txn-sheet-action-btn txn-delete-btn" id="txnSheetDeleteBtn">
      <span>🗑</span> Delete
    </button>
  </div>
  <div class="txn-sheet-confirm" id="txnSheetConfirm" hidden>
    <p>Delete this transaction?</p>
    <div class="txn-sheet-confirm-btns">
      <button class="txn-confirm-cancel" id="txnConfirmCancel">Cancel</button>
      <button class="txn-confirm-delete" id="txnConfirmDelete">Delete</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
${ICONS_LIB_SOURCE}
(() => {
  const LS_CACHE = "casex_expense_cache_v4";
  const LS_CACHE_AT = "casex_expense_cache_at_v4";
  const LS_THEME = "casex_expense_theme_v4";
  const SUGGESTIONS_TTL_MS = 24 * 60 * 60 * 1000; // 24h
  const EXP_LS_TTL = { today: 2 * 60 * 1000, week: 10 * 60 * 1000, month: 20 * 60 * 1000 };
  const PERIOD_LABELS = { today: "day", week: "weekly", month: "monthly" };
  const COLOR_PALETTE = ["#ff7a59", "#5ad6c9", "#f2c14e", "#7f8cff", "#c46cff", "#ff5f9e", "#58b368", "#ff9f43"];
  const USER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const $ = (id) => document.getElementById(id);

  const state = {
    data: null,
    currentView: "home",
    homePeriod: "today",
    homeByPeriod: {},
    expensesPeriod: "today",
    analyticsPeriod: "today",
    expensesByPeriod: {},
    analyticsByPeriod: {},
    searchResults: null,
    lastNonDetailView: "home",
    lastNonSearchView: "home",
    navHidden: false,
    txnTypeFilter: "all",
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
    incomeChosen: {
      categoryId: null, categoryName: null,
      accountId: null, accountName: null,
      transferFromAcctId: null, transferFromAcctName: null,
    },
    incomeExpanded: { incomeCat: false, incomeAcct: false },
    incomeFormMode: "income",
    viewBeforeIncome: null,
    scrollPositions: {
      expenses: 0,
      add: 0,
      analytics: 0,
      search: 0,
      categoryDetail: 0,
      settings: 0,
    },
    settingsTab: "categories",
    drawerOpen: false,
    iconPickerCtx: null, // { table, id, currentIcon }
  };

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeColorMeta").content = theme === "dark" ? "#121212" : "#fffdf7";
    const icon = theme === "dark" ? "☀" : "☾";
    ["themeBtn","addThemeBtn","analyticsThemeBtn","searchThemeBtn"].forEach(id => { const el = $(id); if (el) el.textContent = icon; });
    const homeTheme = $("homeThemeBtn"); if (homeTheme) homeTheme.textContent = icon;
    localStorage.setItem(LS_THEME, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
    ["homeThemeBtn","themeBtn","addThemeBtn","analyticsThemeBtn","searchThemeBtn"].forEach(id => { const el = $(id); if (el) el.onclick = () => toggleTheme(); });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
    if (state.analyticsByPeriod[state.analyticsPeriod]) renderAnalytics(state.analyticsByPeriod[state.analyticsPeriod]);
  }

  // ── Side drawer ──
  function openDrawer() {
    state.drawerOpen = true;
    $("sideDrawer").classList.add("open");
    $("drawerOverlay").classList.add("open");
    $("sideDrawer").setAttribute("aria-hidden", "false");
    $("drawerOverlay").setAttribute("aria-hidden", "false");
  }
  function closeDrawer() {
    state.drawerOpen = false;
    $("sideDrawer").classList.remove("open");
    $("drawerOverlay").classList.remove("open");
    $("sideDrawer").setAttribute("aria-hidden", "true");
    $("drawerOverlay").setAttribute("aria-hidden", "true");
  }

  // ── Settings ──
  const EMOJI_QUICKPICK = ["🍽️","🍕","☕","🛒","🚗","✈️","🏠","💡","💊","💰","💸","💳","📈","📉","🎁","🎬","🎵","📱","👕","💄","🧴","⛽","🚇","🚲","🏥","📚","🎓","🐶","🪴","⚙️"];

  function iconHTML(icon, fallback) {
    if (!icon) return '<span>' + escapeHtml(fallback || "?") + '</span>';
    if (icon.type === "emoji") return '<span>' + escapeHtml(icon.value) + '</span>';
    if (icon.type === "image") return '<img src="' + escapeHtml(icon.value) + '" alt="" />';
    if (icon.type === "lucide") {
      const it = ICONS_LIB.find((x) => x.key === "lucide:" + icon.value);
      if (it) return it.svg;
    }
    if (icon.type === "bank") {
      const b = BANK_LOGOS.find((x) => x.key === "bank:" + icon.value);
      if (b) return b.svg;
    }
    if (icon.type === "brand") {
      const b = BRANDS_LIB.find((x) => x.key === "brand:" + icon.value);
      if (b) return b.svg;
    }
    return '<span>' + escapeHtml(fallback || "?") + '</span>';
  }

  function renderSettings() {
    const list = $("settingsList");
    if (!list || !state.data) return;
    let items = [];
    if (state.settingsTab === "categories")     items = state.data.categories || [];
    else if (state.settingsTab === "subcategories") items = state.data.subcategories || [];
    else if (state.settingsTab === "accounts")  items = state.data.accounts || [];
    const sorted = [...items].sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    if (!sorted.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-msg">Nothing here yet</div></div>';
      return;
    }

    const subParents = state.settingsTab === "subcategories"
      ? Object.fromEntries((state.data.categories || []).map((c) => [c.id, c.name]))
      : null;

    list.innerHTML = sorted.map((item) => {
      const fallback = (item.name || "?").charAt(0);
      const meta = subParents ? subParents[item.categoryId] || "" : "";
      return '<div class="settings-row" data-row-id="' + escapeHtml(item.id) + '">' +
        '<button class="settings-row-icon" data-edit-icon aria-label="Change icon for ' + escapeHtml(item.name) + '">' + iconHTML(item.icon, fallback) + '</button>' +
        '<div style="flex:1; min-width:0;">' +
          '<input class="settings-row-name" data-edit-name value="' + escapeHtml(item.name || "") + '" aria-label="Rename ' + escapeHtml(item.name) + '" />' +
          (meta ? '<div class="settings-row-meta">in ' + escapeHtml(meta) + '</div>' : '') +
        '</div>' +
        '<button class="settings-row-edit" data-edit-icon aria-label="Edit icon">✎</button>' +
        '<button class="settings-row-delete" data-delete-item aria-label="Delete ' + escapeHtml(item.name) + '">✕</button>' +
      '</div>';
    }).join("");

    // Wire row events
    list.querySelectorAll(".settings-row").forEach((row) => {
      const id = row.dataset.rowId;
      const item = sorted.find((x) => x.id === id);
      const nameInput = row.querySelector("[data-edit-name]");
      let originalName = item.name || "";
      nameInput.addEventListener("focus", () => { originalName = nameInput.value; });
      nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") nameInput.blur();
        if (e.key === "Escape") { nameInput.value = originalName; nameInput.blur(); }
      });
      nameInput.addEventListener("blur", async () => {
        const next = nameInput.value.trim();
        if (!next || next === originalName) { nameInput.value = originalName; return; }
        try {
          await api("/api/d1/" + state.settingsTab + "/" + id, { method: "PUT", body: JSON.stringify({ name: next }) });
          item.name = next;
          await invalidateBootstrap();
          toast("Renamed", "ok");
        } catch (err) {
          nameInput.value = originalName;
          toast("Couldn't rename: " + err.message, "err");
        }
      });
      row.querySelectorAll("[data-edit-icon]").forEach((btn) => {
        btn.addEventListener("click", () => openIconPicker(state.settingsTab, item));
      });
      const deleteBtn = row.querySelector("[data-delete-item]");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (!confirm('Delete "' + item.name + '"?')) return;
          try {
            await api("/api/d1/" + state.settingsTab + "/" + id, { method: "DELETE" });
            await invalidateBootstrap();
            toast("Deleted", "ok");
            renderSettings();
          } catch (err) {
            toast("Couldn't delete: " + err.message, "err");
          }
        });
      }
    });
  }

  function showAddSettingsForm() {
    const list = $("settingsList");
    if (!list || list.querySelector(".settings-add-form")) return;
    const tab = state.settingsTab;
    const labels = { categories: "Category", subcategories: "Subcategory", accounts: "Account" };
    const label = labels[tab] || tab;
    const formEl = document.createElement("div");
    formEl.className = "settings-add-form";
    let catSelectHtml = "";
    if (tab === "subcategories" && state.data) {
      const cats = [...(state.data.categories || [])].sort((a, b) => a.name.localeCompare(b.name));
      catSelectHtml = '<select class="settings-add-cat-select" id="settingsNewCatSelect">' +
        '<option value="">No parent category</option>' +
        cats.map(c => '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + '</option>').join("") +
        '</select>';
    }
    formEl.innerHTML =
      '<input class="settings-add-input" id="settingsNewName" placeholder="' + label + ' name…" />' +
      catSelectHtml +
      '<div class="settings-add-actions">' +
        '<button class="settings-add-cancel-btn" id="settingsNewCancelBtn" type="button" aria-label="Cancel">Cancel</button>' +
        '<button class="settings-add-save-btn" id="settingsNewSaveBtn" type="button">Add ' + label + '</button>' +
      '</div>';
    list.insertBefore(formEl, list.firstChild);
    const nameInput = $("settingsNewName");
    nameInput.focus();
    async function doSave() {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const body = { name };
      if (tab === "subcategories") {
        const sel = $("settingsNewCatSelect");
        if (sel && sel.value) body.categoryId = sel.value;
      }
      try {
        await api("/api/d1/" + tab, { method: "POST", body: JSON.stringify(body) });
        await invalidateBootstrap();
        toast(label + " added", "ok");
        renderSettings();
      } catch (err) {
        toast("Couldn't add: " + err.message, "err");
      }
    }
    $("settingsNewSaveBtn").onclick = doSave;
    $("settingsNewCancelBtn").onclick = () => { formEl.remove(); };
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSave();
      if (e.key === "Escape") formEl.remove();
    });
  }

  // ── Icon picker ──
  function setPickerTab(tab) {
    document.querySelectorAll("[data-picker-tab]").forEach((b) => {
      const active = b.dataset.pickerTab === tab;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll("[data-picker-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.pickerPanel === tab);
    });
  }
  function openIconPicker(table, item) {
    state.iconPickerCtx = { table, id: item.id, current: item.icon, name: item.name };
    $("iconPickerTitle").textContent = "Icon for " + (item.name || "");
    $("iconPickerEmojiInput").value = "";

    // Render Icons grid
    const iconsGrid = $("iconPickerIconsGrid");
    iconsGrid.innerHTML = ICONS_LIB.map((it) =>
      '<button class="icon-picker-cell" data-icon-key="' + escapeHtml(it.key) + '" aria-label="' + escapeHtml(it.name) + '">' + it.svg + '</button>'
    ).join("");
    iconsGrid.querySelectorAll("[data-icon-key]").forEach((cell) => {
      cell.addEventListener("click", () => commitPicker({ emoji: null, iconUrl: cell.dataset.iconKey }));
    });

    // Render Emoji grid
    const emojiGrid = $("iconPickerEmojiGrid");
    emojiGrid.innerHTML = EMOJI_QUICKPICK.map((e) =>
      '<button class="icon-picker-cell" data-emoji="' + escapeHtml(e) + '">' + escapeHtml(e) + '</button>'
    ).join("");
    emojiGrid.querySelectorAll("[data-emoji]").forEach((cell) => {
      cell.addEventListener("click", () => commitPicker({ emoji: cell.dataset.emoji, iconUrl: null }));
    });

    // Render Brands grid
    const brandsGrid = $("iconPickerBrandsGrid");
    brandsGrid.innerHTML = BRANDS_LIB.map((b) =>
      '<button class="icon-picker-cell" data-brand-key="' + escapeHtml(b.key) + '" aria-label="' + escapeHtml(b.name) + '">' + b.svg + '</button>'
    ).join("");
    brandsGrid.querySelectorAll("[data-brand-key]").forEach((cell) => {
      cell.addEventListener("click", () => commitPicker({ emoji: null, iconUrl: cell.dataset.brandKey }));
    });

    // Render Banks (accounts only)
    const banksTab = document.querySelector('[data-banks-only]');
    if (table === "accounts") {
      banksTab.hidden = false;
      const banksGrid = $("iconPickerBanksGrid");
      banksGrid.innerHTML = BANK_LOGOS.map((b) =>
        '<button class="icon-picker-cell" data-bank-key="' + escapeHtml(b.key) + '" aria-label="' + escapeHtml(b.name) + '">' + b.svg + '</button>'
      ).join("");
      banksGrid.querySelectorAll("[data-bank-key]").forEach((cell) => {
        cell.addEventListener("click", () => commitPicker({ emoji: null, iconUrl: cell.dataset.bankKey }));
      });
    } else {
      banksTab.hidden = true;
    }

    // Auto-suggest highlights
    const upper = (item.name || "").toUpperCase();
    const brandMatch = BRANDS_LIB.find((b) => upper.includes(b.name.toUpperCase()));
    if (brandMatch) {
      const cell = document.querySelector('[data-brand-key="' + brandMatch.key + '"]');
      if (cell) cell.classList.add("selected");
    }
    if (table === "accounts") {
      const bankMatch = BANK_LOGOS.find((b) => upper.includes(b.name));
      if (bankMatch) {
        const cell = document.querySelector('[data-bank-key="' + bankMatch.key + '"]');
        if (cell) cell.classList.add("selected");
      }
    }

    // Default tab
    if (table === "accounts") setPickerTab("banks");
    else if (brandMatch)      setPickerTab("brands");
    else                      setPickerTab("icons");

    $("iconPickerSheet").classList.add("open");
    $("iconPickerOverlay").classList.add("open");
    $("iconPickerSheet").setAttribute("aria-hidden", "false");
  }
  function closeIconPicker() {
    $("iconPickerSheet").classList.remove("open");
    $("iconPickerOverlay").classList.remove("open");
    $("iconPickerSheet").setAttribute("aria-hidden", "true");
    state.iconPickerCtx = null;
  }
  async function commitPicker(payload) {
    const ctx = state.iconPickerCtx;
    if (!ctx) return;
    try {
      await api("/api/d1/" + ctx.table + "/" + ctx.id, { method: "PUT", body: JSON.stringify(payload) });
      await invalidateBootstrap();
      // Update the item icon locally so renderSettings shows it instantly
      const list = state.data[ctx.table] || [];
      const item = list.find((x) => x.id === ctx.id);
      if (item) {
        if (payload.iconUrl) {
          if (payload.iconUrl.startsWith("/")) item.icon = { type: "image", value: payload.iconUrl };
          else if (payload.iconUrl.startsWith("lucide:")) item.icon = { type: "lucide", value: payload.iconUrl.slice(7) };
          else if (payload.iconUrl.startsWith("bank:"))   item.icon = { type: "bank",   value: payload.iconUrl.slice(5) };
          else if (payload.iconUrl.startsWith("brand:"))  item.icon = { type: "brand",  value: payload.iconUrl.slice(6) };
        } else if (payload.emoji) {
          item.icon = { type: "emoji", value: payload.emoji };
        } else {
          item.icon = null;
        }
      }
      closeIconPicker();
      renderSettings();
      toast("Icon updated", "ok");
    } catch (err) {
      toast("Couldn't save: " + err.message, "err");
    }
  }
  async function invalidateBootstrap() {
    try {
      localStorage.removeItem(LS_CACHE);
      localStorage.removeItem(LS_CACHE_AT);
      const fresh = await api("/api/d1/bootstrap");
      state.data = fresh;
      localStorage.setItem(LS_CACHE, JSON.stringify(fresh));
      localStorage.setItem(LS_CACHE_AT, String(Date.now()));
      renderFormChips();
      clearExpCache();
    } catch (e) { /* tolerate */ }
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
    if (icon && icon.type === "lucide" && icon.value) {
      const it = (typeof ICONS_LIB !== "undefined") ? ICONS_LIB.find((x) => x.key === "lucide:" + icon.value) : null;
      if (it) return '<span class="icon-emoji ' + cls + '" style="display:inline-flex;align-items:center;justify-content:center;width:1.1em;height:1.1em;">' + it.svg + '</span>';
    }
    if (icon && icon.type === "bank" && icon.value) {
      const b = (typeof BANK_LOGOS !== "undefined") ? BANK_LOGOS.find((x) => x.key === "bank:" + icon.value) : null;
      if (b) return '<span class="icon-emoji ' + cls + '" style="display:inline-flex;align-items:center;justify-content:center;width:1.4em;height:1.4em;overflow:hidden;border-radius:6px;">' + b.svg + '</span>';
    }
    if (icon && icon.type === "brand" && icon.value) {
      const b = (typeof BRANDS_LIB !== "undefined") ? BRANDS_LIB.find((x) => x.key === "brand:" + icon.value) : null;
      if (b) return '<span class="icon-emoji ' + cls + '" style="display:inline-flex;align-items:center;justify-content:center;width:1.4em;height:1.4em;overflow:hidden;border-radius:6px;">' + b.svg + '</span>';
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

  function makeEmptyState(icon, msg, hint, ctaHtml) {
    return '<div class="empty-state">' +
      '<div class="empty-state-icon">' + icon + '</div>' +
      '<div class="empty-state-msg">' + escapeHtml(msg) + '</div>' +
      (hint ? '<div class="empty-state-hint">' + escapeHtml(hint) + '</div>' : '') +
      (ctaHtml || '') +
      '</div>';
  }

  function skeletonCards(n) {
    return Array(n).fill('<div class="skel skel-card"></div>').join('');
  }

  function skeletonHero() {
    return '<div class="skel skel-hero-num"></div><div class="skel skel-hero-sub"></div>';
  }

  function colorForCategory(name) {
    let hash = 0;
    const text = String(name || "other");
    for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash) + text.charCodeAt(i);
    return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
  }

  const TOP_LEVEL_VIEWS = new Set(["home", "expenses", "analytics", "search", "settings"]);

  function setActiveView(view) {
    state.currentView = view;
    ["expenses", "add", "income", "analytics", "search", "categoryDetail", "settings"].forEach((key) => {
      const node = $(key + "View");
      if (!node) return;
      const becoming = key === view;
      if (becoming && TOP_LEVEL_VIEWS.has(key)) node.scrollTop = 0;
      node.classList.toggle("active", becoming);
    });
    // home view toggle
    const homeNode = $("homeView");
    if (homeNode) {
      if (view === "home") homeNode.scrollTop = 0;
      homeNode.classList.toggle("active", view === "home");
    }

    // Bottom nav active state
    document.querySelectorAll("[data-nav-view]").forEach((btn) => {
      const isActive = btn.dataset.navView === view;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Hide bottom nav on drill-down views
    const nav = $("bottomNav");
    if (nav) {
      nav.classList.toggle("hidden", view === "add" || view === "income" || view === "categoryDetail");
      // Enable transition only after first nav interaction (prevents load jitter)
      if (!nav.classList.contains("nav-ready")) {
        requestAnimationFrame(() => nav.classList.add("nav-ready"));
      }
    }

    if (view !== "categoryDetail" && view !== "settings") state.lastNonDetailView = view;
    if (view !== "search" && view !== "categoryDetail" && view !== "settings") state.lastNonSearchView = view;
    if (view === "settings") {
      renderSettings();
    }

    if (view === "home") {
      ensureHomeLoaded(state.homePeriod).catch((err) => {
        toast("Failed to load: " + err.message, "err");
      });
    }
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

  function openAddSheet() {
    $("addSheet").classList.add("open");
    $("addSheetOverlay").classList.add("open");
  }

  function closeAddSheet() {
    $("addSheet").classList.remove("open");
    $("addSheetOverlay").classList.remove("open");
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

    const netFetch = api("/api/d1/bootstrap").then((data) => {
      state.data = data;
      localStorage.setItem(LS_CACHE, JSON.stringify(data));
      localStorage.setItem(LS_CACHE_AT, String(Date.now()));
      renderFormChips();
    }).catch((err) => {
      if (!state.data) toast("Failed to load data: " + err.message, "err");
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
    // Subcategories are independent of selected category — always return the
    // global recent list so the user can pick any subcategory regardless of
    // which category (or none) is currently chosen.
    return (state.data && state.data.recent && state.data.recent.subcategories) || [];
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
      expandBtn.textContent = expanded ? "Show less ⌃" : hasMore ? "Show all ⌄" : "Search ⌄";
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
          renderChips(prefix, idField, nameField, items, recentFor(prefix));
        };
        dropdown.appendChild(row);
      });

      const isOpen = !!dropdown.children.length;
      dropdown.classList.toggle("hidden", !isOpen);
      if (card) card.classList.toggle("dropdown-open", isOpen);
    }

    input.addEventListener("input", () => open(getList(), input.value));
    input.addEventListener("focus", () => open(getList(), input.value));
    input.addEventListener("blur", () => setTimeout(close, 140));
  }

  function renderIncomeChips(prefix, idField, nameField, fullList, recentIds) {
    const el = $(prefix + "Chips");
    const expandBtn = $(prefix + "ExpandBtn");
    const searchRow = $(prefix + "SearchRow");
    el.innerHTML = "";

    if (state.incomeChosen[idField] || state.incomeChosen[nameField]) {
      const chosenItem = state.incomeChosen[idField] ? byId(fullList, state.incomeChosen[idField]) : null;
      const fallback = state.incomeChosen[nameField] || (chosenItem && chosenItem.name) || "?";
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip selected";
      chip.innerHTML = renderChipLabel(chosenItem || { name: fallback, icon: chosenItem && chosenItem.icon }, initialFor(fallback)) +
        '<span class="chip-remove">x</span>';
      chip.onclick = () => {
        state.incomeChosen[idField] = null;
        state.incomeChosen[nameField] = null;
        renderIncomeChips(prefix, idField, nameField, fullList, recentIds);
      };
      el.appendChild(chip);
      if (expandBtn) expandBtn.hidden = true;
      if (searchRow) searchRow.hidden = true;
      return;
    }

    const expanded = !!state.incomeExpanded[prefix];
    const suggestedIds = (recentIds || []).filter((id) => byId(fullList, id));
    const suggestedSet = new Set(suggestedIds);
    const pickChip = (item, suggest) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (suggest ? " suggest" : "");
      chip.innerHTML = renderChipLabel(item, initialFor(item.name));
      chip.onclick = () => {
        state.incomeChosen[idField] = item.id;
        state.incomeChosen[nameField] = item.name;
        renderIncomeChips(prefix, idField, nameField, fullList, recentIds);
      };
      return chip;
    };

    if (!expanded) {
      suggestedIds.slice(0, 6).forEach((id) => {
        const item = byId(fullList, id);
        if (item) el.appendChild(pickChip(item, true));
      });
    } else {
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

    const hasMore = (fullList || []).length > suggestedIds.slice(0, 6).length;
    if (expandBtn) {
      expandBtn.hidden = false;
      expandBtn.textContent = expanded ? "Show less ⌃" : hasMore ? "Show all ⌄" : "Search ⌄";
      expandBtn.onclick = () => {
        state.incomeExpanded[prefix] = !state.incomeExpanded[prefix];
        renderIncomeChips(prefix, idField, nameField, fullList, recentIds);
      };
    }
    if (searchRow) searchRow.hidden = !expanded;
  }

  function wireIncomeSearch(prefix, idField, nameField, getList) {
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
          state.incomeChosen[idField] = item.id;
          state.incomeChosen[nameField] = item.name;
          input.value = "";
          close();
          renderIncomeChips(prefix, idField, nameField, items, recentFor(prefix === "incomeCat" ? "cat" : "acct"));
        };
        dropdown.appendChild(row);
      });

      const isOpen = !!dropdown.children.length;
      dropdown.classList.toggle("hidden", !isOpen);
      if (card) card.classList.toggle("dropdown-open", isOpen);
    }

    input.addEventListener("input", () => open(getList(), input.value));
    input.addEventListener("focus", () => open(getList(), input.value));
    input.addEventListener("blur", () => setTimeout(close, 140));
  }

  let txnSheetCurrentId = null;

  function openTxnSheet(id) {
    const expense = findExpenseById(id);
    if (!expense) return toast("Transaction not found", "err");
    txnSheetCurrentId = id;

    const isIncome = expense.txnType === "income";
    const amountEl = $("txnSheetAmount");
    const badgeEl = $("txnSheetTypeBadge");

    amountEl.innerHTML = formatCurrencyParts(expense.amount);
    amountEl.className = "txn-sheet-amount" + (isIncome ? " income" : "");
    badgeEl.textContent = isIncome ? "Income" : "Expense";
    badgeEl.className = "txn-sheet-type-badge" + (isIncome ? " income" : "");

    $("txnSheetName").textContent = expense.name || expense.subcategory || expense.category || "Transaction";

    const rows = [];
    if (expense.category)    rows.push(["Category",    expense.category]);
    if (expense.subcategory) rows.push(["Subcategory", expense.subcategory]);
    if (expense.account)     rows.push(["Account",     expense.account]);
    if (expense.date) {
      rows.push(["Date", formatDay(expense.date)]);
      const t = formatTime(expense.date);
      if (t) rows.push(["Time", t]);
    }
    $("txnSheetMeta").innerHTML = rows.map(([k, v]) =>
      '<div class="txn-meta-row"><span class="txn-meta-key">' + escapeHtml(k) + '</span><span class="txn-meta-val">' + escapeHtml(v) + '</span></div>'
    ).join("");

    $("txnSheetConfirm").hidden = true;
    $("txnSheet").classList.add("open");
    $("txnSheetOverlay").classList.add("open");
  }

  function closeTxnSheet() {
    $("txnSheet").classList.remove("open");
    $("txnSheetOverlay").classList.remove("open");
    $("txnSheetConfirm").hidden = true;
    txnSheetCurrentId = null;
  }

  function wireTxnSheet() {
    $("txnSheetOverlay").onclick = closeTxnSheet;

    $("txnSheetEditBtn").onclick = () => {
      const id = txnSheetCurrentId;
      closeTxnSheet();
      if (id) editExpense(id);
    };

    $("txnSheetDeleteBtn").onclick = () => {
      $("txnSheetConfirm").hidden = false;
    };

    $("txnConfirmCancel").onclick = () => {
      $("txnSheetConfirm").hidden = true;
    };

    $("txnConfirmDelete").onclick = async () => {
      const id = txnSheetCurrentId;
      closeTxnSheet();
      if (id) await deleteExpense(id);
    };
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
        await api("/api/d1/expense", {
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
      state.homeByPeriod = {};
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
    const endpoint = isEditing ? "/api/d1/expense/" + state.editingExpenseId : "/api/d1/expense";
    const method = isEditing ? "PUT" : "POST";

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
    const addTitle = $("addViewTitle");
    if (addTitle) addTitle.textContent = "Add Expense";

    const nextView = state.viewBeforeEdit || state.lastNonDetailView || "home";
    state.viewBeforeEdit = null;

    if (!offlineQueued) {
      // Invalidate caches and navigate immediately
      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
      state.homeByPeriod = {};
      clearExpCache();
    }
    
    setActiveView(nextView);

    if (!offlineQueued && navigator.onLine) {
      Promise.all([
        ensureExpensesLoaded(state.expensesPeriod, true),
        ensureAnalyticsLoaded(state.analyticsPeriod, true),
        ensureHomeLoaded(state.homePeriod, true),
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

  async function saveIncome() {
    if (state.incomeFormMode === "transfer") return saveTransfer();

    const amountText = $("incomeAmount").value.trim();
    const source = $("incomeSource").value.trim();
    const dateVal = $("incomeDate").value;
    const timeVal = $("incomeTime").value;
    const amount = parseFloat(amountText);

    if (!amountText || isNaN(amount) || amount <= 0) {
      return toast("Enter a valid amount", "err");
    }
    if (!state.incomeChosen.categoryId && !state.incomeChosen.categoryName) {
      return toast("Select a category", "err");
    }
    if (!state.incomeChosen.accountId && !state.incomeChosen.accountName) {
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

    $("incomeSaveBtn").disabled = true;
    $("incomeSaveBtn").textContent = "Saving...";

    const payload = {
      expense: source,
      amount: amount,
      date: date,
      categoryId: state.incomeChosen.categoryId,
      categoryName: state.incomeChosen.categoryName,
      accountId: state.incomeChosen.accountId,
      accountName: state.incomeChosen.accountName,
      txnType: "income",
    };

    try {
      await api("/api/d1/expense", { method: "POST", body: JSON.stringify(payload) });
      toast("Income saved", "ok");
    } catch (err) {
      toast("Save failed: " + err.message, "err");
      $("incomeSaveBtn").disabled = false;
      $("incomeSaveBtn").textContent = "Save Income";
      return;
    }

    $("incomeAmount").value = "";
    $("incomeSource").value = "";
    $("incomeLastSaved").textContent = "Saved at " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    state.expensesByPeriod = {};
    state.analyticsByPeriod = {};
    state.homeByPeriod = {};
    clearExpCache();

    const nextView = state.viewBeforeIncome || "home";
    state.viewBeforeIncome = null;
    setActiveView(nextView);

    Promise.all([
      ensureExpensesLoaded(state.expensesPeriod, true),
      ensureAnalyticsLoaded(state.analyticsPeriod, true),
      ensureHomeLoaded(state.homePeriod, true),
    ]).catch(() => {});
    if (suggestionsStale()) bootstrap(false).catch(() => {});

    $("incomeSaveBtn").disabled = false;
    $("incomeSaveBtn").textContent = "Save Income";
  }

  async function saveTransfer() {
    const amountText = $("incomeAmount").value.trim();
    const note = $("incomeSource").value.trim();
    const dateVal = $("incomeDate").value;
    const timeVal = $("incomeTime").value;
    const amount = parseFloat(amountText);

    if (!amountText || isNaN(amount) || amount <= 0) {
      return toast("Enter a valid amount", "err");
    }
    if (!state.incomeChosen.transferFromAcctId && !state.incomeChosen.transferFromAcctName) {
      return toast("Select a From account", "err");
    }
    if (!state.incomeChosen.accountId && !state.incomeChosen.accountName) {
      return toast("Select a To account", "err");
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

    $("incomeSaveBtn").disabled = true;
    $("incomeSaveBtn").textContent = "Saving...";

    const payload = {
      note,
      amount,
      date,
      fromAccountId:   state.incomeChosen.transferFromAcctId,
      fromAccountName: state.incomeChosen.transferFromAcctName,
      toAccountId:     state.incomeChosen.accountId,
      toAccountName:   state.incomeChosen.accountName,
    };

    try {
      await api("/api/d1/expense", { method: "POST", body: JSON.stringify({ ...payload, txnType: "transfer" }) });
      toast("Transfer saved", "ok");
    } catch (err) {
      toast("Save failed: " + err.message, "err");
      $("incomeSaveBtn").disabled = false;
      $("incomeSaveBtn").textContent = "Save Transfer";
      return;
    }

    $("incomeAmount").value = "";
    $("incomeSource").value = "";
    $("incomeLastSaved").textContent = "Saved at " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    state.expensesByPeriod = {};
    state.analyticsByPeriod = {};
    state.homeByPeriod = {};
    clearExpCache();

    const nextView = state.viewBeforeIncome || "home";
    state.viewBeforeIncome = null;
    setActiveView(nextView);

    Promise.all([
      ensureExpensesLoaded(state.expensesPeriod, true),
      ensureAnalyticsLoaded(state.analyticsPeriod, true),
      ensureHomeLoaded(state.homePeriod, true),
    ]).catch(() => {});
    if (suggestionsStale()) bootstrap(false).catch(() => {});

    $("incomeSaveBtn").disabled = false;
    $("incomeSaveBtn").textContent = "Save Transfer";
  }

  async function fetchExpenses(period, hardRefresh, extraParams) {
    const params = new URLSearchParams();
    if (period) params.set("period", period);
    if (USER_TIME_ZONE) params.set("timeZone", USER_TIME_ZONE);
    if (hardRefresh) params.set("refresh", "1");
    Object.entries(extraParams || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, value);
    });
    return api("/api/d1/expenses?" + params.toString());
  }

  function renderHome(data) {
    const expenses = (data && data.expenses) || [];
    const incomeEntries = expenses.filter((e) => e.txnType === "income");
    const expenseEntries = expenses.filter((e) => e.txnType !== "income");
    const incomeTotal = incomeEntries.reduce((s, e) => s + e.amount, 0);
    const expenseTotal = expenseEntries.reduce((s, e) => s + e.amount, 0);
    const balance = incomeTotal - expenseTotal;
    const count = expenseEntries.length;
    const allTxns = expenses.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    $("homeBalanceAmount").innerHTML = formatCurrencyParts(balance);
    $("homeBalanceMeta").textContent = count + " expense" + (count !== 1 ? "s" : "") + " this " + (PERIOD_LABELS[data.period] || data.period);
    $("homeBalanceBadge").textContent = data.cached ? "Cached" : "Live";

    $("homeIncomeAmount").innerHTML = formatCurrencyParts(incomeTotal);
    $("homeIncomeCount").textContent = incomeEntries.length + " entr" + (incomeEntries.length !== 1 ? "ies" : "y");

    $("homeExpenseAmount").innerHTML = formatCurrencyParts(expenseTotal);
    $("homeExpenseCount").textContent = count + " entr" + (count !== 1 ? "ies" : "y");

    if (!allTxns.length) {
      $("homeRecentList").innerHTML = makeEmptyState("📊", "Nothing logged yet",
        "Start tracking to see your balance",
        '<button class="empty-state-cta" onclick="openAddTypeSheet()">+ Add Expense</button>');
      return;
    }
    $("homeRecentList").innerHTML = allTxns.map(renderExpenseCard).join("");
  }

  async function ensureHomeLoaded(period, hardRefresh) {
    if (!hardRefresh && state.homeByPeriod[period]) {
      renderHome(state.homeByPeriod[period]);
      return;
    }
    // Reuse expenses data — home is just a different view of the same data
    const data = await ensureExpensesLoaded(period, hardRefresh);
    if (data) {
      state.homeByPeriod[period] = data;
      renderHome(data);
    }
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
          if (state.homePeriod === period) {
            state.homeByPeriod[period] = data;
            if (state.currentView === "home") renderHome(data);
          }
        }).catch(() => {});
        return cached;
      }
    }

    const listEl = $("expensesList");
    if (listEl) listEl.innerHTML = skeletonCards(4);
    try {
      const data = await fetchExpenses(period, hardRefresh);
      state.expensesByPeriod[period] = data;
      if (!state.analyticsByPeriod[period]) state.analyticsByPeriod[period] = data;
      saveExpCache(period, data);
      renderExpenses(data);
      return data;
    } catch (err) {
      if (listEl) listEl.innerHTML = makeEmptyState("⚠", "Failed to load", err.message);
      throw err;
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

    const legendEl = $("legendList");
    if (legendEl) legendEl.innerHTML = skeletonCards(3);
    try {
      const data = await fetchExpenses(period, hardRefresh);
      state.analyticsByPeriod[period] = data;
      if (!state.expensesByPeriod[period]) {
        state.expensesByPeriod[period] = data;
        saveExpCache(period, data);
      }
      renderAnalytics(data);
      return data;
    } catch (err) {
      if (legendEl) legendEl.innerHTML = makeEmptyState("⚠", "Failed to load", err.message);
      throw err;
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
    const mainIcon = expense.subcategoryIcon || expense.categoryIcon || expense.accountIcon || null;
    const title = expense.name || expense.subcategory || expense.category || "Expense";
    const time = formatTime(expense.date);
    const offlineIndicator = expense.isOffline ? '<span class="pill" style="border: 1px dashed var(--fg-soft); color: var(--fg-soft);">⏳ Syncing</span>' : '';
    const categoryPill = expense.category
      ? '<span class="pill category-pill">' + renderIcon(expense.categoryIcon, "", "pill-icon") + ' ' + escapeHtml(expense.category) + '</span>'
      : "";
    const subcategoryPill = expense.subcategory
      ? '<span class="pill">' + renderIcon(expense.subcategoryIcon, "", "pill-icon") + ' ' + escapeHtml(expense.subcategory) + '</span>'
      : "";
    const accountPill = expense.account
      ? '<span class="pill account-pill">' + renderIcon(expense.accountIcon, "", "pill-icon") + ' ' + escapeHtml(expense.account) + '</span>'
      : "";

    return '' +
      '<div class="expense-card" data-expense-id="' + expense.id + '"' + (expense.isOffline ? ' style="opacity: 0.7;"' : '') + '>' +
        '<div class="expense-icon">' + renderIcon(mainIcon, initialFor(title)) + '</div>' +
        '<div>' +
          '<div class="expense-name">' + escapeHtml(title) + '</div>' +
          '<div class="expense-meta">' + offlineIndicator + categoryPill + subcategoryPill + accountPill + '</div>' +
          '<div class="expense-date">' + escapeHtml(formatDay(expense.date)) + (time ? " - " + escapeHtml(time) : "") + '</div>' +
        '</div>' +
        '<div class="expense-right">' +
          '<div class="expense-amount' + (expense.txnType === "income" ? " income-amount" : "") + '">' + formatCurrencyParts(expense.amount) + '</div>' +
          '<div class="expense-chevron">›</div>' +
        '</div>' +
      '</div>';
  }

  function renderExpenseGroups(expenses, emptyHtml, sortOrder) {
    if (!expenses.length) return emptyHtml;

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
    const allExpenses = (data && data.expenses) || [];

    // Filter by type tab
    let filtered = allExpenses;
    const typeFilter = state.txnTypeFilter || "all";
    if (typeFilter === "income") {
      filtered = allExpenses.filter((e) => e.txnType === "income");
    } else if (typeFilter === "expense") {
      filtered = allExpenses.filter((e) => e.txnType !== "income");
    }

    const periodLabel = PERIOD_LABELS[data.period] || data.period;
    let emptyHtml;
    if (typeFilter === "income") {
      emptyHtml = makeEmptyState("💚", "No income this " + periodLabel, "Tap + to record income",
        '<button class="empty-state-cta income" onclick="openAddTypeSheet()">+ Record Income</button>');
    } else if (typeFilter === "expense") {
      emptyHtml = makeEmptyState("🧾", "No expenses this " + periodLabel, "Tap + to log a transaction",
        '<button class="empty-state-cta" onclick="openAddTypeSheet()">+ Add Expense</button>');
    } else {
      emptyHtml = makeEmptyState("📋", "No transactions this " + periodLabel, "Tap + to log income or an expense",
        '<button class="empty-state-cta" onclick="openAddTypeSheet()">+ Add Transaction</button>');
    }

    $("expensesCount").textContent = filtered.length + " entr" + (filtered.length !== 1 ? "ies" : "y");
    $("expensesList").innerHTML = renderExpenseGroups(filtered, emptyHtml, state.expensesSort);
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
      $("searchResults").innerHTML = renderExpenseGroups(data.expenses,
        makeEmptyState("🔎", "No matches found", "Try different dates or filters"), sort);
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

  function buildTrendChart(expenses, period) {
    const svg = $("trendChartSvg");
    if (!svg) return;

    if (!expenses.length) {
      svg.innerHTML = '<text x="160" y="80" text-anchor="middle" fill="currentColor" opacity="0.4" font-size="13">No data yet</text>';
      return;
    }

    // Build buckets
    const buckets = {};
    const now = new Date();

    if (period === "today") {
      // Hourly buckets 6am–midnight (every 3h)
      [6, 9, 12, 15, 18, 21].forEach((h) => { buckets[h] = 0; });
      expenses.forEach((e) => {
        const d = new Date(e.date);
        const h = Math.floor(d.getHours() / 3) * 3;
        const slot = Math.min(21, Math.max(6, h));
        if (buckets[slot] !== undefined) buckets[slot] += Number(e.amount || 0);
        else buckets[slot] = Number(e.amount || 0);
      });
    } else if (period === "week") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        buckets[d.toISOString().split("T")[0]] = 0;
      }
      expenses.forEach((e) => {
        const day = (e.date || "").split("T")[0];
        if (buckets[day] !== undefined) buckets[day] += Number(e.amount || 0);
      });
    } else {
      // Month — weekly buckets (4 weeks)
      for (let w = 3; w >= 0; w--) {
        const d = new Date(now);
        d.setDate(d.getDate() - w * 7);
        buckets["w" + w] = { label: "W" + (4 - w), start: new Date(d), end: new Date(d), total: 0 };
        buckets["w" + w].start.setDate(buckets["w" + w].start.getDate() - 6);
      }
      expenses.forEach((e) => {
        const ed = new Date(e.date);
        for (let w = 3; w >= 0; w--) {
          const b = buckets["w" + w];
          if (ed >= b.start && ed <= b.end) { b.total += Number(e.amount || 0); break; }
        }
      });
      // Flatten for rendering
      const flat = {};
      for (let w = 3; w >= 0; w--) { flat[buckets["w" + w].label] = buckets["w" + w].total; }
      Object.keys(buckets).forEach((k) => delete buckets[k]);
      Object.assign(buckets, flat);
    }

    const keys = Object.keys(buckets);
    const vals = keys.map((k) => typeof buckets[k] === "object" ? buckets[k].total : buckets[k]);
    const max = Math.max.apply(null, vals) || 1;

    const W = 320, H = 140;
    const padL = 28, padR = 8, padT = 18, padB = 28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const slot = chartW / keys.length;
    const bw = Math.min(32, Math.max(10, slot - 8));

    let out = "";

    // Grid lines
    [0.5, 1].forEach((f) => {
      const y = padT + chartH - chartH * f;
      const v = max * f;
      const label = v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, "") + "k" : Math.round(v);
      out += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="currentColor" opacity="0.08"/>';
      out += '<text x="' + (padL - 4) + '" y="' + (y + 4) + '" text-anchor="end" fill="currentColor" font-size="8" opacity="0.4">' + label + '</text>';
    });
    // Baseline
    out += '<line x1="' + padL + '" y1="' + (padT + chartH) + '" x2="' + (W - padR) + '" y2="' + (padT + chartH) + '" stroke="currentColor" opacity="0.15"/>';

    // Bars
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-expense").trim() || "#eb7c55";
    keys.forEach((k, i) => {
      const v = vals[i];
      const bh = max ? Math.max(3, (v / max) * chartH) : 3;
      const x = padL + slot * i + (slot - bw) / 2;
      const y = padT + chartH - bh;
      const labelX = padL + slot * i + slot / 2;

      out += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="5" fill="' + accentColor + '" opacity="' + (v > 0 ? "0.85" : "0.2") + '"/>';
      // X label
      const displayK = period === "week" ? k.slice(5) : k;
      out += '<text x="' + labelX + '" y="' + (padT + chartH + 12) + '" text-anchor="middle" fill="currentColor" font-size="8.5" opacity="0.5">' + escapeHtml(String(displayK)) + '</text>';
    });

    svg.innerHTML = out;
  }

  function buildChart(rows, svgId) {
    const svg = $(svgId || "incomeSrcSvg");
    if (!svg) return;
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
    const incomeEntries = expenses.filter((e) => e.txnType === "income");
    const expenseEntries = expenses.filter((e) => e.txnType !== "income");
    const rows = summarizeAnalytics(expenseEntries);
    const top = rows[0];
    const periodLabel = PERIOD_LABELS[data.period] || data.period;

    // Section 1: Income vs Expense stat row
    const analyticsIncomeTotal = incomeEntries.reduce((s, e) => s + e.amount, 0);
    const analyticsExpenseTotal = expenseEntries.reduce((s, e) => s + e.amount, 0);
    $("analyticsIncomeTotal").innerHTML = formatCurrencyParts(analyticsIncomeTotal);
    $("analyticsIncomeNote").textContent = incomeEntries.length + " entr" + (incomeEntries.length !== 1 ? "ies" : "y");
    $("analyticsTotal").innerHTML = formatCurrencyParts(analyticsExpenseTotal);
    $("analyticsCount").textContent = expenseEntries.length + " entr" + (expenseEntries.length !== 1 ? "ies" : "y");

    // Section 2: Trend chart
    buildTrendChart(expenseEntries, data.period);
    const trendSub = $("analyticsTrendSubtitle");
    if (trendSub) trendSub.textContent = data.period === "today" ? "Hourly spending" : data.period === "week" ? "Daily spending this week" : "Weekly spending this month";

    // ── Inline list renderer (reused for source + account) ────────────────
    const renderInlineList = (rows, total, colors, listId, subtitleId, emptyMsg) => {
      const sub = $(subtitleId);
      if (sub) sub.textContent = rows.length
        ? rows.length + " item" + (rows.length !== 1 ? "s" : "") + " · " + periodLabel
        : emptyMsg;
      const el = $(listId);
      if (!el) return;
      if (!rows.length) {
        el.innerHTML = makeEmptyState("📊", "No data", emptyMsg);
        return;
      }
      el.innerHTML = rows.map((row, i) => {
        const share = total ? Math.round((row.total / total) * 100) : 0;
        return '<div class="legend-row">' +
          '<div class="legend-swatch" style="background:' + colors[i % colors.length] + ';">' +
            '<span>' + escapeHtml(row.name.charAt(0).toUpperCase()) + '</span>' +
          '</div>' +
          '<div>' +
            '<div class="legend-name">' + escapeHtml(row.name) + '</div>' +
            '<div class="legend-sub">' + row.count + ' txn' + (row.count !== 1 ? 's' : '') + ' · ' + share + '%</div>' +
          '</div>' +
          '<div class="legend-value">' + formatCurrency(row.total) + '</div>' +
        '</div>';
      }).join('');
    };

    // ── Income by source aggregation ──────────────────────────────────────
    const INC_COLORS = ["#34c78a","#27ae60","#48d1a0","#6ee7b7","#059669","#10b981","#52d9a0","#a7f3d0"];
    const incSrcMap = {};
    for (const e of incomeEntries) {
      const key = e.name || e.description || "Unknown";
      if (!incSrcMap[key]) incSrcMap[key] = { name: key, total: 0, count: 0 };
      incSrcMap[key].total += Number(e.amount || 0);
      incSrcMap[key].count++;
    }
    const incSrcRows = Object.values(incSrcMap).sort((a,b) => b.total - a.total).slice(0, 8);
    const incSrcTotal = incSrcRows.reduce((s,r) => s + r.total, 0);
    renderInlineList(incSrcRows, incSrcTotal, INC_COLORS, "incomeSrcList", "analyticsIncSrcSubtitle", "No income yet for this period.");

    // ── Account spending aggregation ──────────────────────────────────────
    const ACCT_COLORS = ["#7f8cff","#a78bfa","#818cf8","#6366f1","#8b5cf6","#4f46e5","#c4b5fd","#9fa8da"];
    const acctMap = {};
    for (const e of expenseEntries) {
      const key = e.account || "Unknown";
      if (!acctMap[key]) acctMap[key] = { name: key, total: 0, count: 0 };
      acctMap[key].total += Number(e.amount || 0);
      acctMap[key].count++;
    }
    const acctRows = Object.values(acctMap).sort((a,b) => b.total - a.total).slice(0, 8);
    const acctTotal = acctRows.reduce((s,r) => s + r.total, 0);
    renderInlineList(acctRows, acctTotal, ACCT_COLORS, "acctSpendList", "analyticsAcctSubtitle", "No expense data for this period.");

    // Section 4: Top categories list
    const topNote = $("analyticsTopCategoryNote");
    if (topNote) topNote.textContent = top ? top.name + " leads" : "";

    if (!rows.length) {
      $("legendList").innerHTML = makeEmptyState("📈", "No spending to analyse",
        "Add some expenses to see category breakdowns",
        '<button class="empty-state-cta" onclick="openAddTypeSheet()">+ Add Expense</button>');
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
            '<div class="legend-sub">' + row.count + ' expense' + (row.count !== 1 ? "s" : "") + ' · ' + share + '%</div>' +
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
    $("categoryDetailList").innerHTML = renderExpenseGroups(expenses,
      makeEmptyState("📂", "No transactions here", "Nothing logged in this category for this period"),
      state.categoryDetailSort);
    setActiveView("categoryDetail");
  }

  async function deleteExpense(pageId) {
    try {
      await api("/api/d1/expense/" + pageId, { method: "DELETE" });
      toast("Expense deleted", "ok");
      state.expensesByPeriod = {};
      state.analyticsByPeriod = {};
      state.homeByPeriod = {};
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
    ["expensesList", "searchResults", "categoryDetailList", "homeRecentList"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener("click", (event) => {
        const card = event.target.closest("[data-expense-id]");
        if (!card) return;
        const expId = card.getAttribute("data-expense-id");
        if (expId) openTxnSheet(expId);
      });
    });
  }

  function wireAnalyticsDrilldown() {
    $("legendList").addEventListener("click", (event) => {
      const row = event.target.closest("[data-analytics-category]");
      if (!row) return;
      openCategoryDetail(row.getAttribute("data-analytics-category"));
    });

    $("categoryDetailBackBtn").onclick = () => setActiveView(state.lastNonDetailView || "analytics");
  }

  function wireNav() {
    // Side menu open (hamburger buttons)
    // Bottom tab nav items
    document.querySelectorAll("[data-nav-view]").forEach((btn) => {
      btn.addEventListener("click", () => setActiveView(btn.dataset.navView));
    });

    // Center Add tab — open type sheet
    $("navTabAdd").onclick = () => openAddSheet();

    // Theme button wired per-view in initTheme

    // Add sheet choices
    $("addSheetOverlay").onclick = closeAddSheet;
    $("addSheetExpenseBtn").onclick = () => {
      closeAddSheet();
      state.viewBeforeEdit = state.currentView;
      state.editingExpenseId = null;
      const addTitle = $("addView").querySelector(".screen-title");
      if (addTitle) addTitle.textContent = "Add Expense";
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

    $("addSheetIncomeBtn").onclick = () => {
      closeAddSheet();
      state.viewBeforeIncome = state.currentView;
      $("incomeAmount").value = "";
      $("incomeSource").value = "";
      state.incomeChosen = {
        categoryId: null, categoryName: null,
        accountId: null, accountName: null,
        transferFromAcctId: null, transferFromAcctName: null,
      };
      // Reset to income mode
      state.incomeFormMode = "income";
      document.querySelectorAll("#incomeModeTabs .type-tab").forEach((t) => {
        t.classList.toggle("active", t.dataset.mode === "income");
      });
      $("incomeCatCard").hidden = false;
      $("transferFromAcctCard").hidden = true;
      const title = $("incomeViewTitle"); if (title) title.textContent = "Add Income";
      const badge = $("incomeFormBadge");
      if (badge) { badge.textContent = "↓ Income"; badge.className = "form-type-badge income-badge"; }
      const srcLabel = $("incomeSourceLabel"); if (srcLabel) srcLabel.textContent = "Income Source";
      const acctLabel = $("incomeAcctLabel");
      if (acctLabel) acctLabel.innerHTML = 'Account <span class="required-dot">*</span>';
      const saveBtn = $("incomeSaveBtn"); if (saveBtn) saveBtn.textContent = "Save Income";
      $("incomeSource").placeholder = "Salary, Freelance, Dividends...";
      if (state.data) {
        renderIncomeChips("incomeCat", "categoryId", "categoryName", state.data.categories || [], recentFor("cat"));
        renderIncomeChips("incomeAcct", "accountId", "accountName", state.data.accounts || [], recentFor("acct"));
      }
      const now = new Date();
      $("incomeDate").value = now.toISOString().split("T")[0];
      $("incomeTime").value = now.toTimeString().slice(0, 5);
      setActiveView("income");
    };

    $("cancelEditBtn").onclick = () => {
      const nextView = state.viewBeforeEdit || state.lastNonDetailView || "home";
      state.viewBeforeEdit = null;
      state.editingExpenseId = null;
      const addTitle = $("addViewTitle");
      if (addTitle) addTitle.textContent = "Add Expense";
      const badge = $("addFormTypeBadge");
      if (badge) { badge.textContent = "↑ Expense"; badge.className = "form-type-badge expense-badge"; }
      $("amount").value = "";
      $("expense").value = "";
      setActiveView(nextView);
    };

    $("cancelIncomeBtn").onclick = () => {
      const nextView = state.viewBeforeIncome || state.lastNonDetailView || "home";
      state.viewBeforeIncome = null;
      $("incomeAmount").value = "";
      $("incomeSource").value = "";
      setActiveView(nextView);
    };

    // Drawer triggers
    document.querySelectorAll("[data-open-drawer]").forEach((btn) => {
      btn.addEventListener("click", openDrawer);
    });
    $("drawerOverlay").addEventListener("click", closeDrawer);
    $("drawerCloseBtn").addEventListener("click", closeDrawer);
    document.querySelectorAll("[data-drawer-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.drawerAction;
        closeDrawer();
        if (action === "settings") setActiveView("settings");
        else if (action === "theme") toggleTheme();
      });
    });

    // Settings tabs + back + add
    document.querySelectorAll("[data-back-from-settings]").forEach((btn) => {
      btn.addEventListener("click", () => setActiveView("home"));
    });
    const settingsAddBtn = $("settingsAddBtn");
    if (settingsAddBtn) settingsAddBtn.addEventListener("click", showAddSettingsForm);
    document.querySelectorAll("[data-settings-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.settingsTab = btn.dataset.settingsTab;
        document.querySelectorAll("[data-settings-tab]").forEach((b) => {
          const active = b.dataset.settingsTab === state.settingsTab;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        renderSettings();
      });
    });

    // Icon picker close + tab switching
    $("iconPickerOverlay").addEventListener("click", closeIconPicker);
    $("iconPickerCloseBtn").addEventListener("click", closeIconPicker);
    document.querySelectorAll("[data-picker-tab]").forEach((btn) => {
      btn.addEventListener("click", () => setPickerTab(btn.dataset.pickerTab));
    });
    const emojiInput = $("iconPickerEmojiInput");
    const useBtn = $("iconPickerEmojiUseBtn");
    const tryCommitEmoji = () => {
      const val = emojiInput.value.trim();
      if (val && val.length <= 8) commitPicker({ emoji: val, iconUrl: null });
      else toast("Enter an emoji first", "err");
    };
    useBtn.addEventListener("click", tryCommitEmoji);
    emojiInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); tryCommitEmoji(); }
    });

    // Transaction type tabs
    document.querySelectorAll("#expensesTypeTabs .type-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#expensesTypeTabs .type-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        state.txnTypeFilter = btn.dataset.type;
        const cached = state.expensesByPeriod[state.expensesPeriod];
        if (cached) renderExpenses(cached);
      });
    });

    // Home screen buttons
    const seeAll = $("homeSeeAllBtn");
    if (seeAll) seeAll.onclick = () => setActiveView("expenses");

    const incomeCard = $("homeSummaryIncome");
    if (incomeCard) incomeCard.onclick = () => {
      state.txnTypeFilter = "income";
      document.querySelectorAll("#expensesTypeTabs .type-tab").forEach((t) => {
        const isIncome = t.dataset.type === "income";
        t.classList.toggle("active", isIncome);
        t.setAttribute("aria-selected", isIncome ? "true" : "false");
      });
      setActiveView("expenses");
    };

    const expenseCard = $("homeSummaryExpense");
    if (expenseCard) expenseCard.onclick = () => setActiveView("expenses");
  }

  function wirePeriods() {
    document.querySelectorAll(".period-tab").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const scope = btn.dataset.scope;
        const period = btn.dataset.period;
        document.querySelectorAll('.period-tab[data-scope="' + scope + '"]').forEach((node) => {
          node.classList.toggle("active", node === btn);
        });

        if (scope === "home") {
          state.homePeriod = period;
          if (!state.homeByPeriod[period]) {
            $("homeBalanceAmount").innerHTML = skeletonHero();
            $("homeRecentList").innerHTML = skeletonCards(3);
          }
          try {
            await ensureHomeLoaded(period, false);
          } catch (err) {
            toast("Failed to load: " + err.message, "err");
          }
        } else if (scope === "expenses") {
          state.expensesPeriod = period;
          if (!state.expensesByPeriod[period]) {
            $("expensesList").innerHTML = skeletonCards(4);
          }
          try {
            await ensureExpensesLoaded(period, false);
          } catch (err) {
            toast("Failed to load expenses: " + err.message, "err");
          }
        } else {
          state.analyticsPeriod = period;
          if (!state.analyticsByPeriod[period]) {
            $("legendList").innerHTML = skeletonCards(3);
          }
          try {
            await ensureAnalyticsLoaded(period, false);
          } catch (err) {
            toast("Failed to load analytics: " + err.message, "err");
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

    $("incomeSaveBtn").onclick = saveIncome;
    $("incomeAmount").addEventListener("keydown", (event) => {
      if (event.key === "Enter") $("incomeSource").focus();
    });
    $("incomeSource").addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveIncome();
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

    const searchExportBtn = $("searchExportBtn");
    if (searchExportBtn) {
      searchExportBtn.onclick = () => {
        const from = $("searchFrom").value;
        const to   = $("searchTo").value;
        if (!from || !to) { toast("Pick both From and To dates first", "err"); return; }
        const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
        const params = new URLSearchParams();
        params.set("type", "expense");
        params.set("from", from);
        params.set("to", to);
        if (tz) params.set("timeZone", decodeURIComponent(tz));
        if (state.searchFilter.categoryId)    params.set("category",    state.searchFilter.categoryId);
        if (state.searchFilter.subcategoryId) params.set("subcategory", state.searchFilter.subcategoryId);
        if (state.searchFilter.accountId)     params.set("account",     state.searchFilter.accountId);
        window.location.href = "/api/d1/export?" + params.toString();
      };
    }
  }

  async function init() {
    initTheme();
    initDateDefaults();
    initFormShortcuts();
    attachScrollBehavior();
    wireNav();
    wirePeriods();
    wireExpenseActions();
    wireTxnSheet();
    wireAnalyticsDrilldown();
    initRefreshButtons();
    initSearchControls();

    wireSearch("cat", "categoryId", "categoryName", () => state.data ? state.data.categories : []);
    wireSearch("sub", "subcategoryId", "subcategoryName", () => state.data ? state.data.subcategories : []);
    wireSearch("acct", "accountId", "accountName", () => state.data ? state.data.accounts : []);

    wireIncomeSearch("incomeCat", "categoryId", "categoryName", () => state.data ? state.data.categories : []);
    wireIncomeSearch("incomeAcct", "accountId", "accountName", () => state.data ? state.data.accounts : []);
    wireIncomeSearch("transferFromAcct", "transferFromAcctId", "transferFromAcctName", () => state.data ? state.data.accounts : []);

    document.querySelectorAll("#incomeModeTabs .type-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#incomeModeTabs .type-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        const mode = btn.dataset.mode;
        state.incomeFormMode = mode;
        const isTransfer = mode === "transfer";
        $("incomeCatCard").hidden = isTransfer;
        $("transferFromAcctCard").hidden = !isTransfer;
        const title = $("incomeViewTitle");
        if (title) title.textContent = isTransfer ? "Add Transfer" : "Add Income";
        const badge = $("incomeFormBadge");
        if (badge) {
          badge.textContent = isTransfer ? "⇄ Transfer" : "↓ Income";
          badge.className = "form-type-badge " + (isTransfer ? "transfer-badge" : "income-badge");
        }
        const srcLabel = $("incomeSourceLabel");
        if (srcLabel) srcLabel.textContent = isTransfer ? "Note (optional)" : "Income Source";
        const acctLabel = $("incomeAcctLabel");
        if (acctLabel) acctLabel.innerHTML = (isTransfer ? "To Account" : "Account") + ' <span class="required-dot">*</span>';
        const saveBtn = $("incomeSaveBtn");
        if (saveBtn) saveBtn.textContent = isTransfer ? "Save Transfer" : "Save Income";
        $("incomeSource").placeholder = isTransfer
          ? "Transfer note..."
          : "Salary, Freelance, Dividends...";
        if (state.data) {
          renderIncomeChips("transferFromAcct", "transferFromAcctId", "transferFromAcctName", state.data.accounts || [], recentFor("acct"));
          renderIncomeChips("incomeAcct", "accountId", "accountName", state.data.accounts || [], recentFor("acct"));
        }
      });
    });

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
        ensureHomeLoaded(state.homePeriod, false),
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
