import { ICONS_LIB_SOURCE } from "./icons-lib.js";

export const DESKTOP_HTML = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=1280"/>
<meta name="theme-color" content="#f5f5f5"/>
<title>Expense Tracker</title>
<style>
/* ── Reset ─────────────────────────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
button{cursor:pointer;border:none;background:none;font:inherit;color:inherit}
input,textarea,select{font:inherit;color:inherit}
a{color:inherit;text-decoration:none}
ul,ol{list-style:none}
svg{display:block;flex-shrink:0}

/* ── Design Tokens ──────────────────────────────────────────────────── */
:root {
  /* Colors — True Black (dark default) */
  --color-bg-primary:        #111111;
  --color-bg-surface:        rgba(26,26,26,0.90);
  --color-bg-surface-2:      rgba(32,32,32,0.96);
  --color-bg-surface-3:      rgba(40,40,40,0.98);
  --color-bg-surface-raised: rgba(255,255,255,0.04);
  --color-text-primary:      rgba(245,245,245,0.95);
  --color-text-secondary:    rgba(160,160,160,0.80);
  --color-text-tertiary:     rgba(120,120,120,0.60);
  --color-border-primary:    rgba(255,255,255,0.08);
  --color-border-secondary:  rgba(255,255,255,0.05);
  --color-border-focus:      rgba(220,70,70,0.55);
  --color-accent:            #e05050;
  --color-accent-hover:      #e86060;
  --color-accent-subtle:     rgba(220,70,70,0.12);
  --color-income:            #4ade80;
  --color-income-subtle:     rgba(74,222,128,0.12);
  --color-teal:              #22d3ee;
  --color-gold:              #fbbf24;
  --color-error:             #f87171;
  --color-warning:           #fbbf24;
  --color-pill:              rgba(255,255,255,0.06);
  --color-pill-active:       rgba(220,70,70,0.15);
  --color-chart-1: #e05050; --color-chart-2: #22d3ee;
  --color-chart-3: #fbbf24; --color-chart-4: #f472b6;

  /* Shadows */
  --shadow-sm:      0 2px 8px rgba(0,0,0,0.40);
  --shadow-md:      0 8px 22px rgba(0,0,0,0.50);
  --shadow-lg:      0 14px 36px rgba(0,0,0,0.60);
  --shadow-sidebar: 1px 0 0 var(--color-border-primary);
  --shadow-panel:   -2px 0 24px rgba(0,0,0,0.50),-1px 0 0 var(--color-border-primary);
  --shadow-dropdown:0 8px 24px rgba(0,0,0,0.55),0 1px 0 var(--color-border-primary);
  --shadow-palette: 0 24px 64px rgba(0,0,0,0.65),0 1px 0 var(--color-border-primary);
  --shadow-focus:   0 0 0 3px rgba(220,70,70,0.30);

  /* Spacing */
  --s1:2px;--s2:4px;--s3:6px;--s4:8px;--s5:12px;--s6:16px;--s7:20px;
  --s8:24px;--s9:32px;--s10:40px;--s11:48px;--s12:64px;

  /* Typography */
  --font-display:"SF Pro Display","Segoe UI Variable Display","Inter",system-ui,sans-serif;
  --font-body:"SF Pro Text","SF Pro Display","Inter",system-ui,sans-serif;
  --font-mono:"SF Mono","Fira Code",ui-monospace,monospace;
  --text-xs:12px;--text-sm:14px;--text-base:16px;--text-md:17px;
  --text-lg:20px;--text-xl:24px;--text-2xl:30px;--text-3xl:38px;--text-4xl:52px;

  /* Radius */
  --r-xs:4px;--r-sm:8px;--r-md:12px;--r-lg:16px;--r-xl:20px;--r-full:9999px;

  /* Layout */
  --sidebar-w:268px;
  --sidebar-w-col:52px;
  --panel-w:500px;
  --topbar-h:64px;
  --txn-row-h:64px;

  /* Z-index */
  --z-sidebar:20;--z-overlay:25;--z-panel:30;
  --z-dropdown:50;--z-toast:60;--z-palette:70;--z-tooltip:80;

  /* Motion */
  --dur-fast:150ms;--dur-normal:250ms;
  --ease:cubic-bezier(0.4,0,0.2,1);
  --ease-out:cubic-bezier(0,0,0.2,1);

  /* Semantic aliases */
  --bg:        var(--color-bg-primary);
  --surface:   var(--color-bg-surface);
  --surface-2: var(--color-bg-surface-2);
  --surface-3: var(--color-bg-surface-3);
  --fg:        var(--color-text-primary);
  --fg-soft:   var(--color-text-secondary);
  --fg-muted:  var(--color-text-tertiary);
  --border:    var(--color-border-primary);
  --accent:    var(--color-accent);

  --color-sidebar-bg: rgba(14,14,14,0.96);
  --color-panel-bg:   rgba(18,18,18,0.98);
}

[data-theme="light"] {
  /* Clean White/Gray */
  --color-bg-primary:        #f5f5f5;
  --color-bg-surface:        rgba(255,255,255,0.85);
  --color-bg-surface-2:      rgba(255,255,255,0.92);
  --color-bg-surface-3:      rgba(255,255,255,0.96);
  --color-bg-surface-raised: rgba(0,0,0,0.03);
  --color-text-primary:      #111111;
  --color-text-secondary:    #666666;
  --color-text-tertiary:     #999999;
  --color-border-primary:    rgba(0,0,0,0.08);
  --color-border-secondary:  rgba(0,0,0,0.05);
  --color-border-focus:      rgba(212,68,68,0.45);
  --color-accent:            #d44444;
  --color-accent-hover:      #de5555;
  --color-accent-subtle:     rgba(212,68,68,0.10);
  --color-income:            #16a34a;
  --color-income-subtle:     rgba(22,163,74,0.10);
  --color-teal:              #0891b2;
  --color-gold:              #d97706;
  --color-error:             #dc2626;
  --color-warning:           #d97706;
  --color-pill:              rgba(0,0,0,0.05);
  --color-pill-active:       rgba(212,68,68,0.10);
  --color-chart-1: #d44444; --color-chart-2: #0891b2;
  --color-chart-3: #d97706; --color-chart-4: #ec4899;
  --shadow-sm:   0 2px 8px rgba(0,0,0,0.08);
  --shadow-md:   0 8px 24px rgba(0,0,0,0.12);
  --shadow-lg:   0 16px 40px rgba(0,0,0,0.14);
  --shadow-sidebar: 1px 0 0 rgba(0,0,0,0.08);
  --shadow-panel: -2px 0 24px rgba(0,0,0,0.12),-1px 0 0 rgba(0,0,0,0.08);
  --shadow-dropdown: 0 8px 28px rgba(0,0,0,0.12),0 1px 0 rgba(0,0,0,0.06);
  --shadow-palette: 0 24px 56px rgba(0,0,0,0.16),0 1px 0 rgba(0,0,0,0.08);
  --shadow-focus: 0 0 0 3px rgba(212,68,68,0.20);
  --color-sidebar-bg: rgba(255,255,255,0.80);
  --color-panel-bg:   rgba(255,255,255,0.92);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* already dark by default */ }
}

/* ── App Layout ────────────────────────────────────────────────────── */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  background: var(--bg);
  color: var(--fg);
  display: flex;
  height: 100vh;
  overflow: hidden;
}
[data-theme="light"] body {
  background-image: radial-gradient(circle at 78% 12%, rgba(212,68,68,0.07), transparent 45%),
                    radial-gradient(circle at 18% 82%, rgba(180,50,50,0.04), transparent 42%);
}
[data-theme="dark"] body, :root:not([data-theme]) body {
  background-image: radial-gradient(circle at top left, rgba(220,70,70,0.10), transparent 40%),
                    radial-gradient(circle at bottom right, rgba(180,50,50,0.07), transparent 38%);
}

.app-shell {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* ── Sidebar ───────────────────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  height: 100vh;
  background: var(--color-sidebar-bg);
  box-shadow: var(--shadow-sidebar);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sidebar);
  transition: width var(--dur-normal) var(--ease);
  overflow: hidden;
}

.sidebar-header {
  padding: var(--s7) var(--s5) var(--s5);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--s4);
  margin-bottom: var(--s5);
}
.sidebar-brand-icon {
  width: 28px; height: 28px;
  background: var(--color-accent);
  border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.sidebar-brand-name {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s3);
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--r-sm);
  padding: var(--s5) var(--s6);
  font-size: var(--text-base);
  font-weight: 600;
  transition: background var(--dur-fast) var(--ease);
  white-space: nowrap;
  overflow: hidden;
}
.sidebar-add-btn:hover { background: var(--color-accent-hover); }
.sidebar-add-btn svg { flex-shrink: 0; }
.sidebar-add-label { overflow: hidden; text-overflow: ellipsis; }

.sidebar-nav {
  flex: 1;
  padding: var(--s5) var(--s4);
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--s5);
  padding: var(--s4) var(--s5);
  border-radius: var(--r-sm);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--fg-muted);
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: left;
  position: relative;
}
.sidebar-nav-item:hover {
  background: var(--color-bg-surface-raised);
  color: var(--fg-soft);
}
.sidebar-nav-item.active {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}
.sidebar-nav-item svg { flex-shrink: 0; }
.sidebar-nav-label { overflow: hidden; text-overflow: ellipsis; }

.sidebar-footer {
  padding: var(--s4);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.sidebar-footer-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--s4);
  padding: var(--s3) var(--s4);
  border-radius: var(--r-sm);
  font-size: var(--text-sm);
  color: var(--fg-muted);
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
  white-space: nowrap;
  overflow: hidden;
}
.sidebar-footer-btn:hover { background: var(--color-bg-surface-raised); color: var(--fg-soft); }

/* Collapsed state */
.sidebar.collapsed {
  width: var(--sidebar-w-col);
}
.sidebar.collapsed .sidebar-brand-name,
.sidebar.collapsed .sidebar-nav-label,
.sidebar.collapsed .sidebar-add-label,
.sidebar.collapsed .sidebar-footer-btn span {
  display: none;
}
.sidebar.collapsed .sidebar-add-btn {
  padding: var(--s4);
  justify-content: center;
}
.sidebar.collapsed .sidebar-nav-item {
  justify-content: center;
  padding: var(--s3);
}
.sidebar.collapsed .sidebar-footer-btn {
  justify-content: center;
  padding: var(--s3);
}

/* ── Main content ──────────────────────────────────────────────────── */
.main-area {
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  height: var(--topbar-h);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 var(--s9);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  gap: var(--s5);
  z-index: 10;
}
.topbar-title {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.topbar-breadcrumb {
  font-size: var(--text-sm);
  color: var(--fg-muted);
  display: flex;
  align-items: center;
  gap: var(--s3);
}
.topbar-breadcrumb .sep { color: var(--fg-muted); }
.topbar-actions { display: flex; align-items: center; gap: var(--s3); flex-shrink: 0; }

.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--s9) var(--s10);
}

/* ── Period tabs ───────────────────────────────────────────────────── */
.period-tabs {
  display: flex;
  gap: var(--s2);
  background: var(--color-pill);
  padding: var(--s1);
  border-radius: var(--r-md);
  width: fit-content;
}
.period-tab {
  padding: var(--s2) var(--s6);
  border-radius: calc(var(--r-md) - 2px);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--fg-muted);
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
  white-space: nowrap;
}
.period-tab:hover { color: var(--fg-soft); }
.period-tab.active {
  background: var(--surface-2);
  color: var(--fg);
  box-shadow: var(--shadow-sm);
}

/* ── Type filter tabs ──────────────────────────────────────────────── */
.type-tabs {
  display: flex;
  gap: var(--s1);
}
.type-tab {
  padding: var(--s2) var(--s5);
  border-radius: var(--r-full);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--fg-muted);
  border: 1px solid transparent;
  transition: all var(--dur-fast) var(--ease);
}
.type-tab:hover { color: var(--fg-soft); border-color: var(--border); }
.type-tab.active {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  border-color: rgba(235,124,85,0.20);
}

/* ── Icon buttons ──────────────────────────────────────────────────── */
.icon-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--r-sm);
  color: var(--fg-muted);
  transition: background var(--dur-fast), color var(--dur-fast);
}
.icon-btn:hover { background: var(--color-bg-surface-raised); color: var(--fg-soft); }

/* ── Dropdown ──────────────────────────────────────────────────────── */
.dropdown-wrap { position: relative; }
.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-dropdown);
  z-index: var(--z-dropdown);
  min-width: 180px;
  padding: var(--s2);
  display: none;
}
.dropdown-menu.open { display: block; }
.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--s4);
  padding: var(--s3) var(--s5);
  border-radius: var(--r-sm);
  font-size: var(--text-sm);
  color: var(--fg-soft);
  transition: background var(--dur-fast);
  width: 100%;
  text-align: left;
}
.dropdown-item:hover { background: var(--color-bg-surface-raised); color: var(--fg); }

/* ── Overview cards ────────────────────────────────────────────────── */
.overview-hero {
  margin-bottom: var(--s8);
}
.overview-hero-label {
  font-size: var(--text-sm);
  color: var(--fg-muted);
  font-weight: 500;
  margin-bottom: var(--s3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.overview-hero-amount {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, var(--text-4xl));
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.overview-hero-amount.positive { color: var(--color-income); }
.overview-hero-amount.negative { color: var(--color-accent); }

.summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s6);
  margin-bottom: var(--s8);
}
.summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--s6) var(--s7);
  cursor: pointer;
  transition: background var(--dur-fast), border-color var(--dur-fast);
}
.summary-card:hover { background: var(--surface-2); border-color: var(--border); }
.summary-card-label {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: var(--s3);
}
.summary-card-amount {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.5vw, var(--text-2xl));
  font-weight: 700;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.summary-card.income .summary-card-amount { color: var(--color-income); }
.summary-card.expense .summary-card-amount { color: var(--color-accent); }

/* ── Section headers ───────────────────────────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--s5);
}
.section-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Transaction cards ─────────────────────────────────────────────── */
.txn-cards-wrap {
  max-width: 720px;
  margin: 0 auto;
}
.txn-list { display: flex; flex-direction: column; }
.txn-day-group { margin-bottom: var(--s7); }
.txn-day-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: var(--s2) 0 var(--s4);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--s3);
}
.txn-day-label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.txn-day-net {
  font-size: var(--text-xs);
  font-weight: 700;
}
.txn-day-net.positive { color: var(--color-income); }
.txn-day-net.negative { color: var(--color-accent); }

/* Card row */
.txn-row {
  display: grid;
  grid-template-columns: 52px 1fr auto;
  gap: 0 var(--s6);
  align-items: center;
  padding: var(--s6) var(--s7);
  border-radius: var(--r-lg);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-primary);
  margin-bottom: var(--s4);
  cursor: pointer;
  transition: background var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-fast), transform 120ms var(--ease);
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}
.txn-row:hover {
  background: var(--color-bg-surface-2);
  border-color: rgba(255,255,255,0.11);
  box-shadow: 0 3px 12px rgba(0,0,0,0.18);
}
.txn-row:active { transform: scale(0.995); }
/* color accent strip on left edge */
.txn-row.txn-expense { border-left: 4px solid var(--color-accent); }
.txn-row.txn-income  { border-left: 4px solid var(--color-income); }

.txn-row-icon {
  width: 52px; height: 52px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}
.txn-row-icon.expense-icon { background: var(--color-accent-subtle); }
.txn-row-icon.income-icon  { background: var(--color-income-subtle); }

.txn-row-body { min-width: 0; }
.txn-row-name {
  font-size: var(--text-md);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: var(--s2);
}
.txn-row-pills {
  display: flex;
  gap: var(--s2);
  flex-wrap: wrap;
}
.txn-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--s4);
  border-radius: var(--r-full);
  font-size: var(--text-xs);
  font-weight: 500;
  background: var(--color-bg-surface-raised);
  border: 1px solid var(--color-border-secondary);
  color: var(--fg-soft);
  white-space: nowrap;
}
.txn-pill.cat  { color: var(--color-accent); border-color: rgba(235,124,85,0.20); background: var(--color-accent-subtle); }
.txn-pill.acct { color: var(--color-income); border-color: rgba(102,198,140,0.20); background: var(--color-income-subtle); }

.txn-row-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--s2);
  flex-shrink: 0;
}
.txn-row-amount {
  font-size: var(--text-md);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.txn-row-amount.expense { color: var(--color-accent); }
.txn-row-amount.income  { color: var(--color-income); }
.txn-row-time {
  font-size: var(--text-xs);
  color: var(--fg-muted);
}

/* ── Empty state ───────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--s12) var(--s9);
  text-align: center;
  color: var(--fg-muted);
}
.empty-state-icon { font-size: 40px; margin-bottom: var(--s6); }
.empty-state-title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--s3); }
.empty-state-body { font-size: var(--text-sm); color: var(--fg-muted); }

/* ── Analytics ─────────────────────────────────────────────────────── */
.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s7);
  margin-bottom: var(--s7);
}
.analytics-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--s7);
}
.analytics-card-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--s6);
}

/* Bar chart */
.bar-chart { display: flex; flex-direction: column; gap: var(--s4); }
.bar-row { display: flex; align-items: center; gap: var(--s5); }
.bar-label { font-size: var(--text-xs); color: var(--fg-muted); width: 60px; flex-shrink: 0; text-align: right; }
.bar-track { flex: 1; height: 8px; background: var(--color-bg-surface-raised); border-radius: var(--r-full); overflow: hidden; }
.bar-fill { height: 100%; border-radius: var(--r-full); transition: width 0.4s var(--ease-out); }
.bar-fill.income  { background: var(--color-income); }
.bar-fill.expense { background: var(--color-accent); }
.bar-value { font-size: var(--text-xs); font-weight: 600; width: 70px; text-align: right; flex-shrink: 0; }

/* Donut chart */
.donut-wrap { display: flex; gap: var(--s8); align-items: flex-start; }
.donut-svg-wrap { flex-shrink: 0; }
.donut-legend { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--s4); }
.donut-legend-item {
  display: flex; align-items: center; gap: var(--s4);
  cursor: pointer; border-radius: var(--r-sm); padding: var(--s2) var(--s3);
  transition: background var(--dur-fast);
}
.donut-legend-item:hover { background: var(--color-bg-surface-raised); }
.donut-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.donut-legend-name { font-size: var(--text-sm); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.donut-legend-pct { font-size: var(--text-xs); font-weight: 600; color: var(--fg-muted); }
.donut-legend-amt { font-size: var(--text-xs); color: var(--fg-muted); }

/* ── Category breakdown list ───────────────────────────────────────── */
.cat-list { display: flex; flex-direction: column; gap: var(--s3); }
.analytics-inline-row:hover { background: var(--color-bg-surface-raised); }
.cat-row {
  display: grid;
  grid-template-columns: 28px 12px 160px 1fr 52px 120px;
  gap: 0 var(--s5);
  align-items: center;
  padding: var(--s4) var(--s5);
  border-radius: var(--r-md);
  transition: background var(--dur-fast);
}
.cat-row:hover { background: var(--color-bg-surface-raised); }
.cat-row-rank { font-size: var(--text-sm); color: var(--fg-muted); font-weight: 600; text-align: right; }
.cat-row-dot { width: 12px; height: 12px; border-radius: 50%; }
.cat-row-name { font-size: var(--text-base); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cat-row-bar-wrap { height: 8px; background: var(--color-bg-surface-raised); border-radius: var(--r-full); overflow: hidden; }
.cat-row-bar { height: 100%; border-radius: var(--r-full); transition: width 0.5s var(--ease-out); }
.cat-row-pct { font-size: var(--text-sm); color: var(--fg-muted); font-weight: 600; text-align: right; }
.cat-row-amt { font-size: var(--text-base); font-weight: 600; color: var(--color-accent); text-align: right; }

/* ── Category bar chart (analytics top-right) ──────────────────────── */
.cat-bars { display: flex; flex-direction: column; gap: var(--s5); }
.cat-bar-row {
  display: grid;
  grid-template-columns: 130px 1fr 48px 110px;
  gap: 0 var(--s5);
  align-items: center;
  padding: var(--s3) var(--s4);
  border-radius: var(--r-md);
  transition: background var(--dur-fast);
}
.cat-bar-row:hover { background: var(--color-bg-surface-raised); }
.cat-bar-label { font-size: var(--text-sm); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--fg); }
.cat-bar-track { height: 10px; background: var(--color-bg-surface-raised); border-radius: var(--r-full); overflow: hidden; }
.cat-bar-fill { height: 100%; border-radius: var(--r-full); transition: width 0.55s var(--ease-out); }
.cat-bar-pct { font-size: var(--text-xs); color: var(--fg-muted); font-weight: 600; text-align: right; }
.cat-bar-amt { font-size: var(--text-sm); font-weight: 700; color: var(--color-accent); text-align: right; }

/* ── Category filter chips (search view) ───────────────────────────── */
.cat-filter-section { margin-bottom: var(--s6); }
.cat-filter-label { font-size: var(--text-xs); font-weight: 600; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: var(--s3); }
.cat-filter-chips { display: flex; flex-wrap: wrap; gap: var(--s2); }
.cat-filter-chip {
  display: flex; align-items: center; gap: var(--s2);
  padding: var(--s2) var(--s4);
  background: var(--color-pill);
  border: 1px solid transparent;
  border-radius: var(--r-full);
  font-size: var(--text-sm); font-weight: 500;
  color: var(--fg-soft);
  cursor: pointer;
  transition: all var(--dur-fast);
}
.cat-filter-chip:hover { background: var(--surface-2); border-color: var(--border); }
.cat-filter-chip.active {
  background: var(--color-accent-subtle);
  border-color: rgba(235,124,85,0.25);
  color: var(--color-accent);
}

/* ── Search view ───────────────────────────────────────────────────── */
.search-bar-wrap { margin-bottom: var(--s6); position: relative; flex: 1; min-width: 0; }
.search-input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--fg-muted);
}
.search-input {
  width: 100%;
  height: 44px;
  padding: 0 var(--s6) 0 42px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--text-base);
  color: var(--fg);
  outline: none;
  transition: border-color var(--dur-fast);
}
.search-input:focus { border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }
.search-filters {
  display: flex;
  gap: var(--s5);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--s6);
}
.search-filter-label {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  font-weight: 600;
}
.date-input {
  height: 32px;
  padding: 0 var(--s5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-size: var(--text-sm);
  color: var(--fg);
  outline: none;
  transition: border-color var(--dur-fast);
}
.date-input:focus { border-color: var(--color-border-focus); }

/* ── Right panel ───────────────────────────────────────────────────── */
.panel-overlay {
  position: fixed; inset: 0;
  background: rgba(5,5,5,0.50);
  z-index: var(--z-overlay);
  display: none;
  opacity: 0;
  transition: opacity var(--dur-normal) var(--ease);
}
.panel-overlay.open { display: block; }
.panel-overlay.visible { opacity: 1; }

.right-panel {
  position: fixed;
  right: 0; top: 0; bottom: 0;
  width: var(--panel-w);
  background: var(--color-panel-bg);
  box-shadow: var(--shadow-panel);
  z-index: var(--z-panel);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--dur-normal) var(--ease-out);
  overflow: hidden;
}
.right-panel.open { transform: translateX(0); }

.panel-header {
  flex-shrink: 0;
  padding: var(--s6) var(--s7);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-close-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--r-sm);
  color: var(--fg-muted);
  transition: background var(--dur-fast), color var(--dur-fast);
}
.panel-close-btn:hover { background: var(--color-bg-surface-raised); color: var(--fg); }

/* Panel mode tabs (Expense / Income / Transfer) */
.panel-mode-tabs {
  display: flex;
  gap: var(--s2);
  background: var(--color-pill);
  padding: var(--s1);
  border-radius: var(--r-md);
}
.panel-mode-tab {
  padding: var(--s2) var(--s5);
  border-radius: calc(var(--r-md) - 2px);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--fg-muted);
  transition: background var(--dur-fast), color var(--dur-fast);
}
.panel-mode-tab.active {
  background: var(--surface-2);
  color: var(--fg);
  box-shadow: var(--shadow-sm);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--s7);
}

.panel-footer {
  flex-shrink: 0;
  padding: var(--s5) var(--s7);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--s4);
}
.panel-save-btn {
  flex: 1;
  height: 40px;
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--r-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: background var(--dur-fast);
}
.panel-save-btn:hover { background: var(--color-accent-hover); }
.panel-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.panel-cancel-btn {
  height: 40px;
  padding: 0 var(--s6);
  background: var(--color-bg-surface-raised);
  border-radius: var(--r-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--fg-soft);
  transition: background var(--dur-fast);
}
.panel-cancel-btn:hover { background: var(--surface-3); }

/* Panel form fields */
.form-field { margin-bottom: var(--s6); }
.form-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--s3);
}
.form-input {
  width: 100%;
  height: 44px;
  padding: 0 var(--s5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--text-base);
  color: var(--fg);
  outline: none;
  transition: border-color var(--dur-fast), box-shadow var(--dur-fast);
}
.form-input:focus { border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); }
.form-input.amount-input {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  height: 64px;
  padding: 0 var(--s6);
  letter-spacing: -0.02em;
}

/* Chip select */
.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
}
.chip-item {
  display: flex;
  align-items: center;
  gap: var(--s3);
  padding: var(--s3) var(--s5);
  background: var(--color-pill);
  border: 1px solid transparent;
  border-radius: var(--r-full);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--fg-soft);
  cursor: pointer;
  transition: all var(--dur-fast);
}
.chip-item > span:first-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.chip-item svg, .chip-item img {
  display: block;
}
.chip-item:hover { background: var(--surface-2); border-color: var(--border); }
.chip-item.selected {
  background: var(--color-accent-subtle);
  border-color: rgba(235,124,85,0.20);
  color: var(--color-accent);
}

/* Chip search */
.chip-search-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--s4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--text-sm);
  color: var(--fg);
  outline: none;
  margin-bottom: var(--s3);
  transition: border-color var(--dur-fast);
}
.chip-search-input:focus { border-color: var(--color-border-focus); }
.date-time-row { display: flex; gap: var(--s4); }
.date-time-row .form-input { flex: 1; min-width: 0; }

/* Detail view */
.detail-field { margin-bottom: var(--s6); }
.detail-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--s2);
}
.detail-value { font-size: var(--text-base); color: var(--fg); }
.detail-amount {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.detail-amount.expense { color: var(--color-accent); }
.detail-amount.income  { color: var(--color-income); }
.detail-actions { display: flex; gap: var(--s4); margin-bottom: var(--s7); }
.detail-edit-btn {
  flex: 1; height: 36px;
  background: var(--color-bg-surface-raised);
  border-radius: var(--r-sm);
  font-size: var(--text-sm); font-weight: 600;
  color: var(--fg-soft);
  transition: background var(--dur-fast);
}
.detail-edit-btn:hover { background: var(--surface-3); }
.detail-delete-btn {
  height: 36px; padding: 0 var(--s6);
  background: rgba(244,106,106,0.10);
  border-radius: var(--r-sm);
  font-size: var(--text-sm); font-weight: 600;
  color: var(--color-error);
  transition: background var(--dur-fast);
}
.detail-delete-btn:hover { background: rgba(244,106,106,0.18); }

/* ── Command palette ───────────────────────────────────────────────── */
.palette-backdrop {
  position: fixed; inset: 0;
  background: rgba(5,5,5,0.60);
  z-index: var(--z-palette);
  display: none;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease);
}
.palette-backdrop.open { display: flex; align-items: flex-start; justify-content: center; padding-top: 15vh; }
.palette-backdrop.visible { opacity: 1; }

.palette-box {
  width: 100%;
  max-width: 580px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-palette);
  overflow: hidden;
  transform: scale(0.97) translateY(-8px);
  transition: transform var(--dur-fast) var(--ease-out);
}
.palette-backdrop.visible .palette-box { transform: scale(1) translateY(0); }

.palette-input-row {
  display: flex;
  align-items: center;
  gap: var(--s5);
  padding: var(--s5) var(--s6);
  border-bottom: 1px solid var(--border);
}
.palette-input {
  flex: 1;
  height: 36px;
  background: transparent;
  border: none;
  font-size: var(--text-base);
  color: var(--fg);
  outline: none;
}
.palette-input::placeholder { color: var(--fg-muted); }
.palette-results {
  max-height: 360px;
  overflow-y: auto;
  padding: var(--s2);
}
.palette-result {
  display: flex;
  align-items: center;
  gap: var(--s5);
  padding: var(--s3) var(--s5);
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: background var(--dur-fast);
}
.palette-result:hover, .palette-result.focused { background: var(--color-bg-surface-raised); }
.palette-result-name { flex: 1; font-size: var(--text-sm); font-weight: 500; }
.palette-result-meta { font-size: var(--text-xs); color: var(--fg-muted); }
.palette-result-amount { font-size: var(--text-sm); font-weight: 600; }
.palette-result-amount.expense { color: var(--color-accent); }
.palette-result-amount.income  { color: var(--color-income); }
.palette-empty {
  padding: var(--s10) var(--s6);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--fg-muted);
}
.palette-count {
  padding: var(--s3) var(--s6);
  font-size: var(--text-xs);
  color: var(--fg-muted);
  border-top: 1px solid var(--border);
}

/* ── Toast ─────────────────────────────────────────────────────────── */
.toast-stack {
  position: fixed;
  bottom: var(--s7);
  right: var(--s7);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  align-items: flex-end;
}
.toast {
  display: flex;
  align-items: center;
  gap: var(--s4);
  padding: var(--s4) var(--s6);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-md);
  font-size: var(--text-sm);
  font-weight: 500;
  max-width: 320px;
  animation: toast-in var(--dur-normal) var(--ease-out);
  cursor: pointer;
}
.toast.success { border-left: 3px solid var(--color-income); }
.toast.error   { border-left: 3px solid var(--color-error); }
@keyframes toast-in {
  from { opacity:0; transform: translateX(20px); }
  to   { opacity:1; transform: translateX(0); }
}

/* ── Freshness badge ───────────────────────────────────────────────── */
.freshness-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--s2);
  padding: var(--s1) var(--s4);
  background: var(--color-pill);
  border-radius: var(--r-full);
  font-size: 11px;
  color: var(--fg-muted);
}
.freshness-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
}
.freshness-dot.cached { background: var(--color-warning); }
.freshness-dot.live   { background: var(--color-income); }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1279px) {
  :root { --sidebar-w: var(--sidebar-w-col); }
}
@media (max-width: 767px) {
  .app-shell { flex-direction: column; }
  .sidebar { display: none; }
  .main-area { height: 100%; }
}

/* ── Skeleton loading ──────────────────────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg, var(--color-bg-surface-raised) 25%, rgba(255,255,255,0.08) 50%, var(--color-bg-surface-raised) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--r-sm);
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* ── Scrollbar ─────────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: var(--r-full); }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

/* ── Liquid Glass Design System ────────────────────────────────────── */
/* CSS translation of Apple's .glassEffect() API for web */

:root {
  --glass-blur:          blur(48px) saturate(200%);
  --glass-blur-light:    blur(32px) saturate(190%);
  --glass-bg:            rgba(255,255,255,0.05);
  --glass-bg-hover:      rgba(255,255,255,0.08);
  --glass-bg-strong:     rgba(255,255,255,0.07);
  --glass-border:        rgba(255,255,255,0.10);
  --glass-border-bright: rgba(255,255,255,0.16);
  --glass-tint-accent:   rgba(220,70,70,0.14);
  --glass-tint-income:   rgba(74,222,128,0.12);
  --spring:              cubic-bezier(0.34,1.56,0.64,1);
  --spring-quick:        cubic-bezier(0.22,1.0,0.36,1);
  --dur-spring:          320ms;
}
[data-theme="light"] {
  --glass-bg:            rgba(255,255,255,0.85);
  --glass-bg-hover:      rgba(255,255,255,0.92);
  --glass-bg-strong:     rgba(255,255,255,0.90);
  --glass-border:        rgba(0,0,0,0.07);
  --glass-border-bright: rgba(0,0,0,0.10);
  --glass-tint-accent:   rgba(212,68,68,0.10);
  --glass-tint-income:   rgba(22,163,74,0.08);
}

/* GlassEffectContainer equivalent — isolation layer */
.glass-container {
  isolation: isolate;
  contain: layout style;
}

/* Base glass surface — .glassEffect(in: .rect(cornerRadius:)) */
.glass-surface {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}

/* Sidebar → glass material */
.sidebar {
  background: rgba(14,14,14,0.88) !important;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-right: 1px solid var(--glass-border-bright);
  box-shadow: none !important;
}
[data-theme="light"] .sidebar {
  background: rgba(255,255,255,0.80) !important;
  backdrop-filter: blur(48px) saturate(200%);
  -webkit-backdrop-filter: blur(48px) saturate(200%);
  border-right: 1px solid rgba(0,0,0,0.08) !important;
}

/* Topbar → glass bar */
.topbar {
  background: rgba(12,12,12,0.85) !important;
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);
  border-bottom: 1px solid var(--glass-border) !important;
}
[data-theme="light"] .topbar {
  background: rgba(255,255,255,0.88) !important;
  border-bottom: 1px solid rgba(0,0,0,0.07) !important;
}

/* Right panel → frosted glass panel */
.right-panel {
  background: rgba(18,18,18,0.92) !important;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-left: 1px solid var(--glass-border-bright) !important;
}
[data-theme="light"] .right-panel {
  background: rgba(255,255,255,0.92) !important;
  border-left: 1px solid rgba(0,0,0,0.08) !important;
  box-shadow: -4px 0 32px rgba(0,0,0,0.10) !important;
}

/* Command palette → deep glass */
.palette-box {
  background: rgba(18,18,18,0.92) !important;
  backdrop-filter: blur(64px) saturate(220%);
  -webkit-backdrop-filter: blur(64px) saturate(220%);
  border: 1px solid var(--glass-border-bright) !important;
}
[data-theme="light"] .palette-box {
  background: rgba(255,255,255,0.95) !important;
  border: 1px solid rgba(0,0,0,0.08) !important;
  box-shadow: 0 24px 56px rgba(0,0,0,0.14) !important;
}

/* Summary cards → glass cards (.glassEffect(in: .rect(cornerRadius:))) */
.summary-card {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
  transition: background var(--dur-spring) var(--spring-quick),
              transform var(--dur-spring) var(--spring),
              box-shadow var(--dur-spring) var(--spring-quick) !important;
}
.summary-card:hover {
  background: var(--glass-bg-hover) !important;
  transform: translateY(-2px) scale(1.005);
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
}
.summary-card:active {
  transform: scale(0.97);
}
.summary-card.income {
  border-color: rgba(22,163,74,0.22) !important;
}
.summary-card.expense {
  border-color: rgba(220,70,70,0.22) !important;
}

/* Transaction rows → glass cards with spring */
.txn-row {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.10) !important;
  transition: background var(--dur-spring) var(--spring-quick),
              transform 220ms var(--spring),
              box-shadow 220ms var(--spring-quick) !important;
}
.txn-row:hover {
  background: var(--glass-bg-hover) !important;
  transform: translateY(-1px) scale(1.003);
  box-shadow: 0 4px 16px rgba(0,0,0,0.16), 0 1px 0 rgba(255,255,255,0.08) !important;
}
.txn-row:active { transform: scale(0.995) !important; }

/* Chips → spring interactive (.glassEffect(.regular.interactive())) */
.chip-item {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
  transition: background var(--dur-spring) var(--spring-quick),
              transform var(--dur-spring) var(--spring),
              border-color var(--dur-spring) var(--spring-quick) !important;
}
.chip-item:hover {
  background: var(--glass-bg-hover) !important;
  border-color: var(--glass-border-bright) !important;
  transform: scale(1.04);
}
.chip-item:active { transform: scale(0.96) !important; }
.chip-item.selected {
  background: var(--glass-tint-accent) !important;
  border-color: rgba(220,70,70,0.35) !important;
  box-shadow: 0 0 0 1px rgba(220,70,70,0.20), 0 2px 8px rgba(220,70,70,0.18);
  color: var(--color-accent) !important;
}

/* Add button → glass prominent (.buttonStyle(.glassProminent)) */
.sidebar-add-btn {
  background: var(--color-accent) !important;
  box-shadow: 0 4px 16px rgba(220,70,70,0.30);
  transition: background var(--dur-fast) var(--ease),
              transform var(--dur-spring) var(--spring),
              box-shadow var(--dur-spring) var(--spring-quick) !important;
}
.sidebar-add-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 24px rgba(220,70,70,0.42) !important;
}
.sidebar-add-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 8px rgba(220,70,70,0.22) !important;
}

/* Save/action buttons → spring */
.panel-save-btn {
  box-shadow: 0 3px 12px rgba(220,70,70,0.26);
  transition: background var(--dur-fast),
              transform var(--dur-spring) var(--spring),
              box-shadow var(--dur-spring) var(--spring-quick) !important;
}
.panel-save-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 18px rgba(220,70,70,0.38) !important;
}
.panel-save-btn:active { transform: scale(0.96) !important; }

/* Form inputs → glass input */
.form-input {
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border) !important;
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);
  transition: border-color var(--dur-fast), box-shadow var(--dur-fast), background var(--dur-fast) !important;
}
.form-input:focus {
  background: var(--glass-bg-strong) !important;
  border-color: var(--color-border-focus) !important;
}

/* Sidebar nav items → glass interactive */
.sidebar-nav-item.active {
  background: var(--glass-tint-accent) !important;
  color: var(--color-accent) !important;
}
.sidebar-nav-item:hover {
  background: var(--glass-bg-hover) !important;
}

/* Period tabs → glass pills */
.type-tab.active, .period-tab.active {
  box-shadow: 0 2px 8px rgba(220,70,70,0.20);
}

/* Overview hero → elevated glass area */
.overview-hero {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--r-xl);
  padding: var(--s7) var(--s8);
  margin-bottom: var(--s8);
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);
  box-shadow: 0 8px 32px rgba(0,0,0,0.30), 0 1px 0 rgba(255,255,255,0.06);
}
[data-theme="light"] .overview-hero {
  box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.95);
}

/* Icon row in panel → glass icon cell */
.txn-row-icon {
  border-radius: var(--r-md);
  background: var(--glass-bg-strong) !important;
  border: 1px solid var(--glass-border);
}
.txn-row-icon.expense-icon {
  background: rgba(220,70,70,0.10) !important;
  border-color: rgba(220,70,70,0.16);
}
.txn-row-icon.income-icon {
  background: rgba(22,163,74,0.10) !important;
  border-color: rgba(22,163,74,0.14);
}

/* Panel overlay → glass-tinted backdrop */
.panel-overlay {
  background: rgba(0,0,0,0.45) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
[data-theme="light"] .panel-overlay {
  background: rgba(0,0,0,0.28) !important;
}

/* Toast → glass */
.toast {
  backdrop-filter: var(--glass-blur-light) !important;
  -webkit-backdrop-filter: var(--glass-blur-light) !important;
  border: 1px solid var(--glass-border-bright) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.40), 0 1px 0 rgba(255,255,255,0.06) !important;
}
.toast.success { background: rgba(22,22,22,0.90) !important; }
.toast.error   { background: rgba(220,70,70,0.18) !important; }
[data-theme="light"] .toast.success { background: rgba(255,255,255,0.92) !important; }
[data-theme="light"] .toast { box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.95) !important; }

/* Dropdown → glass */
.dropdown {
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border-bright) !important;
  background: rgba(22,22,22,0.92) !important;
}
[data-theme="light"] .dropdown {
  background: rgba(255,255,255,0.95) !important;
  border-color: rgba(0,0,0,0.08) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
}

/* ── Neon Tint: Income (green) + Expense (faded red) over glass ── */

/* Income summary card — green glass tint */
.summary-card.income {
  background: rgba(0,230,118,0.09) !important;
  border: 1px solid rgba(0,230,118,0.22) !important;
  box-shadow: 0 4px 24px rgba(0,230,118,0.12), inset 0 1px 0 rgba(0,230,118,0.12) !important;
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
}
.summary-card.income .summary-card-label  { color: #007a40 !important; }
.summary-card.income .summary-card-amount { color: #00a050 !important; }
.summary-card.income:hover {
  background: rgba(0,230,118,0.13) !important;
  border-color: rgba(0,230,118,0.30) !important;
}

/* Expense summary card — faded red glass tint */
.summary-card.expense {
  background: rgba(255,70,70,0.07) !important;
  border: 1px solid rgba(255,70,70,0.18) !important;
  box-shadow: 0 4px 24px rgba(255,70,70,0.10), inset 0 1px 0 rgba(255,70,70,0.08) !important;
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
}
.summary-card.expense .summary-card-label  { color: #a02828 !important; }
.summary-card.expense .summary-card-amount { color: #d03838 !important; }
.summary-card.expense:hover {
  background: rgba(255,70,70,0.11) !important;
  border-color: rgba(255,70,70,0.26) !important;
}

/* Transaction rows — green/red tint */
.txn-row.txn-income {
  background: rgba(0,230,118,0.06) !important;
  border-left: 4px solid rgba(0,192,96,0.70) !important;
}
.txn-row.txn-income:hover { background: rgba(0,230,118,0.10) !important; }
.txn-row.txn-expense {
  background: rgba(255,70,70,0.05) !important;
  border-left: 4px solid rgba(220,56,56,0.65) !important;
}
.txn-row.txn-expense:hover { background: rgba(255,70,70,0.09) !important; }

/* Transaction row amounts */
.txn-row-amount.income  { color: #00a050 !important; }
.txn-row-amount.expense { color: #d03838 !important; }

/* Transaction icon cells */
.txn-row-icon.income-icon {
  background: rgba(0,230,118,0.10) !important;
  border: 1px solid rgba(0,230,118,0.18) !important;
}
.txn-row-icon.expense-icon {
  background: rgba(255,70,70,0.08) !important;
  border: 1px solid rgba(255,70,70,0.15) !important;
}

/* Overview hero amount */
.overview-hero-amount.positive { color: #00a050 !important; }
.overview-hero-amount.negative { color: #d03838 !important; }
</style>
</head>
<body>
<!-- App shell -->
<div class="app-shell" id="app">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">💸</div>
        <span class="sidebar-brand-name">Expenses</span>
      </div>
      <button class="sidebar-add-btn" id="sidebar-add-btn" aria-label="Add transaction">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span class="sidebar-add-label">Add Transaction</span>
      </button>
    </div>
    <nav class="sidebar-nav">
      <button class="sidebar-nav-item active" data-view="overview" aria-current="page">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>
        <span class="sidebar-nav-label">Overview</span>
      </button>
      <button class="sidebar-nav-item" data-view="transactions">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span class="sidebar-nav-label">Transactions</span>
      </button>
      <button class="sidebar-nav-item" data-view="analytics">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14V9M6 14V6M10 14V3M14 14V8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span class="sidebar-nav-label">Analytics</span>
      </button>
      <button class="sidebar-nav-item" data-view="search">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span class="sidebar-nav-label">Search</span>
      </button>
      <button class="sidebar-nav-item" data-view="settings">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M13.5 9.5l1 .5-1 1.732-1.5-.464a5 5 0 01-1.5.866L10 13H6l-.5-.866a5 5 0 01-1.5-.866L2.5 11.732 1.5 10l1-.5a5 5 0 010-3l-1-.5L2.5 4.268l1.5.464a5 5 0 011.5-.866L6 3h4l.5.866a5 5 0 011.5.866l1.5-.464 1 1.732-1 .5a5 5 0 010 3z" stroke="currentColor" stroke-width="1.2"/></svg>
        <span class="sidebar-nav-label">Settings</span>
      </button>
    </nav>
    <div class="sidebar-footer">
      <button class="sidebar-footer-btn" id="theme-toggle-btn" aria-label="Toggle theme">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.7.7M12.25 12.25l.7.7M3.05 12.95l.7-.7M12.25 3.75l.7-.7M8 5a3 3 0 100 6 3 3 0 000-6z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        <span>Theme</span>
      </button>
    </div>
  </aside>

  <!-- Main content -->
  <div class="main-area">
    <!-- Topbar -->
    <header class="topbar" id="topbar">
      <div class="topbar-title" id="topbar-title">Overview</div>
      <div class="topbar-actions" id="topbar-actions"></div>
    </header>

    <!-- Content area (views swap here) -->
    <main class="content-area" id="content-area">
      <!-- Views injected by JS -->
    </main>
  </div>
</div>

<!-- Panel overlay -->
<div class="panel-overlay" id="panel-overlay"></div>

<!-- Right panel -->
<div class="right-panel" id="right-panel" role="dialog" aria-modal="true" aria-label="Transaction panel">
  <div class="panel-header" id="panel-header">
    <!-- injected by JS based on mode -->
  </div>
  <div class="panel-body" id="panel-body">
    <!-- injected by JS -->
  </div>
  <div class="panel-footer" id="panel-footer">
    <!-- injected by JS -->
  </div>
</div>

<!-- Command palette -->
<div class="palette-backdrop" id="palette-backdrop" role="dialog" aria-modal="true" aria-label="Search transactions">
  <div class="palette-box">
    <div class="palette-input-row">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="color:var(--fg-muted);flex-shrink:0"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <input type="text" class="palette-input" id="palette-input" placeholder="Search transactions..." autocomplete="off" role="combobox" aria-expanded="true" aria-autocomplete="list"/>
    </div>
    <div class="palette-results" id="palette-results" role="listbox" aria-live="polite"></div>
    <div class="palette-count" id="palette-count" aria-live="polite"></div>
  </div>
</div>

<!-- Toast stack -->
<div class="toast-stack" id="toast-stack" aria-live="polite"></div>

<script>
${ICONS_LIB_SOURCE}
// ── State ──────────────────────────────────────────────────────────────────
const state = {
  view: 'overview',
  period: 'month',
  txnType: '',          // '' | 'expense' | 'income'
  categoryFilter: '',
  categoryFilterName: '',

  bootstrap: null,      // { categories, subcategories, accounts }
  summaryByPeriod: {},  // period → summary
  txnsByPeriod: {},     // period+type+cat → transactions
  searchResults: [],

  panelOpen: false,
  panelMode: 'add',     // 'add' | 'detail' | 'edit'
  panelTxnType: 'expense',
  panelTxn: null,       // current transaction being viewed/edited

  paletteOpen: false,
  paletteResults: [],
  paletteFocus: -1,

  loading: false,
};

// Safe icon helper — emoji/SVG inline render, falls back to default
const chipIcon = (icon, def) => {
  if (!icon) return def;
  if (icon.type === 'emoji') {
    const v = icon.value;
    if (!v || v.length > 10) return def;
    return v;
  }
  if (icon.type === 'lucide') {
    const it = ICONS_LIB.find(x => x.key === 'lucide:' + icon.value);
    if (it) return '<span style="display:inline-flex;width:1.1em;height:1.1em;vertical-align:-2px;">' + it.svg + '</span>';
  }
  if (icon.type === 'bank') {
    const b = BANK_LOGOS.find(x => x.key === 'bank:' + icon.value);
    if (b) return '<span style="display:inline-flex;width:1.3em;height:1.3em;vertical-align:-2px;border-radius:4px;overflow:hidden;">' + b.svg + '</span>';
  }
  if (icon.type === 'brand') {
    const b = BRANDS_LIB.find(x => x.key === 'brand:' + icon.value);
    if (b) return '<span style="display:inline-flex;width:1.3em;height:1.3em;vertical-align:-2px;border-radius:4px;overflow:hidden;">' + b.svg + '</span>';
  }
  if (icon.type === 'image') {
    return '<img src="' + icon.value + '" alt="" style="width:1.2em;height:1.2em;vertical-align:-2px;border-radius:4px;object-fit:cover;" />';
  }
  return def;
};

function rankByRecency(items, recentIds) {
  const recentSet = new Set(recentIds);
  return [
    ...recentIds.map(id => items.find(x => x.id === id)).filter(Boolean),
    ...items.filter(x => !recentSet.has(x.id)).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  ];
}

function buildDateTime(dateVal, timeVal) {
  if (!dateVal) return new Date().toISOString().split('T')[0];
  if (!timeVal) return dateVal;
  const off = -new Date().getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const absOff = Math.abs(off);
  const hh = String(Math.floor(absOff / 60)).padStart(2, '0');
  const mm = String(absOff % 60).padStart(2, '0');
  return dateVal + 'T' + timeVal + ':00' + sign + hh + ':' + mm;
}

function queueOfflineTxn(txnBody) {
  const pending = JSON.parse(localStorage.getItem('desktopPendingTxns') || '[]');
  pending.push(txnBody);
  localStorage.setItem('desktopPendingTxns', JSON.stringify(pending));
}

async function syncPendingTxns() {
  const pendingStr = localStorage.getItem('desktopPendingTxns');
  if (!pendingStr) return;
  const pending = JSON.parse(pendingStr);
  if (!pending.length) { localStorage.removeItem('desktopPendingTxns'); return; }
  if (!navigator.onLine) return;
  showToast('Syncing ' + pending.length + ' offline transaction(s)…', 'success');
  const failed = [];
  let synced = 0;
  for (const body of pending) {
    try {
      const r = await fetch('/api/d1/expense', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error('failed');
      synced++;
    } catch { failed.push(body); }
  }
  if (failed.length) {
    localStorage.setItem('desktopPendingTxns', JSON.stringify(failed));
    if (synced) showToast('Synced ' + synced + '. ' + failed.length + ' still pending.', 'error');
  } else {
    localStorage.removeItem('desktopPendingTxns');
    showToast('All offline transactions synced!', 'success');
    state.txnsByPeriod = {};
    state.summaryByPeriod = {};
    renderView();
  }
}

const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 });
const fmtAmt = (n) => fmt.format(Math.abs(n));
const fmtDate = (s) => {
  if (!s) return '';
  const [y,m,d] = s.split('-');
  return new Date(Number(y), Number(m)-1, Number(d)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
const dayLabel = (s) => {
  if (!s) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(s + 'T00:00:00'); d.setHours(0,0,0,0);
  const diff = (today - d) / 86400000;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
};

// ── API helpers ────────────────────────────────────────────────────────────
async function apiFetch(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function loadBootstrap() {
  if (state.bootstrap) return state.bootstrap;
  state.bootstrap = await apiFetch('/api/d1/bootstrap');
  return state.bootstrap;
}

async function loadSummary(period) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const d = await apiFetch(\`/api/d1/summary?period=\${period}&timeZone=\${encodeURIComponent(tz)}\`);
  state.summaryByPeriod[period] = d;
  return d;
}

async function loadTxns(period, type = '', category = '') {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let url = \`/api/d1/expenses?period=\${period}&timeZone=\${encodeURIComponent(tz)}\`;
  if (type) url += \`&type=\${type}\`;
  if (category) url += \`&category=\${category}\`;
  const d = await apiFetch(url);
  const key = period + '|' + type + '|' + category;
  state.txnsByPeriod[key] = d.expenses || [];
  return d.expenses || [];
}

async function searchTxns(q, from, to, type = '', category = '', account = '', subcategory = '', sortBy = 'date', sortDir = 'desc') {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let url = \`/api/d1/expenses?timeZone=\${encodeURIComponent(tz)}\`;
  if (q)           url += \`&q=\${encodeURIComponent(q)}\`;
  if (from)        url += \`&from=\${from}\`;
  if (to)          url += \`&to=\${to}\`;
  if (type)        url += \`&type=\${type}\`;
  if (category)    url += \`&category=\${encodeURIComponent(category)}\`;
  if (subcategory) url += \`&subcategory=\${encodeURIComponent(subcategory)}\`;
  if (account)     url += \`&account=\${encodeURIComponent(account)}\`;
  if (sortBy !== 'date')  url += \`&sortBy=\${sortBy}\`;
  if (sortDir !== 'desc') url += \`&sortDir=\${sortDir}\`;
  const d = await apiFetch(url);
  return d.expenses || [];
}

// ── Routing ────────────────────────────────────────────────────────────────
function parseHash() {
  const hash = location.hash.replace('#', '') || '/overview';
  const [path, qs] = hash.split('?');
  const view = path.replace('/', '') || 'overview';
  const params = new URLSearchParams(qs || '');
  return { view, params };
}

function navigate(view, params = {}) {
  const qs = new URLSearchParams(params).toString();
  location.hash = qs ? \`/\${view}?\${qs}\` : \`/\${view}\`;
}

window.addEventListener('hashchange', () => {
  const { view, params } = parseHash();
  applyRoute(view, params);
});

function applyRoute(view, params) {
  state.view = view;
  state.txnType = params.get('type') || '';
  state.categoryFilter = params.get('category') || '';
  state.categoryFilterName = '';

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav-item').forEach(el => {
    const active = el.dataset.view === view;
    el.classList.toggle('active', active);
    el.setAttribute('aria-current', active ? 'page' : 'false');
  });

  // Panel from URL
  const detail = params.get('detail');
  const edit   = params.get('edit');
  if (detail) { openPanelDetail(detail); }
  else if (edit) { openPanelEdit(edit); }
  else { closePanel(); }

  renderView();
}

// ── Views ──────────────────────────────────────────────────────────────────
function renderView() {
  const area = document.getElementById('content-area');
  const topbarTitle = document.getElementById('topbar-title');
  const topbarActions = document.getElementById('topbar-actions');

  topbarActions.innerHTML = '';

  if (state.view === 'overview') {
    topbarTitle.textContent = 'Overview';
    renderOverview(area);
  } else if (state.view === 'transactions') {
    topbarTitle.innerHTML = state.categoryFilter
      ? \`<span class="topbar-breadcrumb">Transactions <span class="sep">›</span> <span id="cat-filter-name">\${state.categoryFilterName || 'Category'}</span></span>\`
      : 'Transactions';
    renderTransactions(area, topbarActions);
  } else if (state.view === 'analytics') {
    topbarTitle.textContent = 'Analytics';
    renderAnalytics(area);
  } else if (state.view === 'search') {
    topbarTitle.textContent = 'Search';
    topbarActions.innerHTML = \`
      <button class="icon-btn" id="topbar-search-export" aria-label="Export results as CSV" title="Export results as CSV">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M5 7l3 3 3-3M2 12v1.5A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5V12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>\`;
    document.getElementById('topbar-search-export').addEventListener('click', () => {
      const inlineBtn = document.getElementById('search-export-btn');
      if (inlineBtn) inlineBtn.click();
    });
    renderSearch(area);
  } else if (state.view === 'settings') {
    topbarTitle.textContent = 'Settings';
    renderSettings(area, topbarActions);
  }
}

// ── Period tabs HTML ───────────────────────────────────────────────────────
function periodTabsHtml(current) {
  return \`<div class="period-tabs">
    \${['today','week','month'].map(p => \`
      <button class="period-tab \${p===current?'active':''}" data-period="\${p}">
        \${p==='today'?'Today':p==='week'?'Week':'Month'}
      </button>\`).join('')}
  </div>\`;
}

function bindPeriodTabs(container, onChange) {
  container.querySelectorAll('.period-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.period = btn.dataset.period;
      container.querySelectorAll('.period-tab').forEach(b => b.classList.toggle('active', b.dataset.period === state.period));
      onChange(state.period);
    });
  });
}

// ── Overview view ──────────────────────────────────────────────────────────
function renderOverview(area) {
  area.innerHTML = \`
    <div>
      \${periodTabsHtml(state.period)}
      <div style="margin-top:var(--s7)" id="overview-body">
        <div class="skeleton" style="height:60px;width:240px;margin-bottom:var(--s4)"></div>
        <div class="skeleton" style="height:24px;width:180px;margin-bottom:var(--s8)"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s6);margin-bottom:var(--s8)">
          <div class="skeleton" style="height:88px;border-radius:var(--r-lg)"></div>
          <div class="skeleton" style="height:88px;border-radius:var(--r-lg)"></div>
        </div>
      </div>
    </div>\`;
  bindPeriodTabs(area, () => renderOverview(area));

  Promise.all([loadSummary(state.period), loadTxns(state.period, '', '')])
    .then(([summary, txns]) => {
      const body = document.getElementById('overview-body');
      if (!body) return;
      const bal = summary.balance;
      body.innerHTML = \`
        <div class="overview-hero">
          <div class="overview-hero-label">Balance</div>
          <div class="overview-hero-amount \${bal>=0?'positive':'negative'}">\${bal>=0?'':'−'}\${fmtAmt(bal)}</div>
          <div style="margin-top:var(--s3);display:flex;align-items:center;gap:var(--s4)">
            <span class="freshness-badge"><span class="freshness-dot live"></span>Live</span>
          </div>
        </div>
        <div class="summary-row">
          <div class="summary-card income" data-nav-type="income">
            <div class="summary-card-label">Income</div>
            <div class="summary-card-amount">\${fmtAmt(summary.totalIncome)}</div>
          </div>
          <div class="summary-card expense" data-nav-type="expense">
            <div class="summary-card-label">Expenses</div>
            <div class="summary-card-amount">\${fmtAmt(summary.totalExpenses)}</div>
          </div>
        </div>
        <div class="section-header">
          <span class="section-title">Transactions</span>
        </div>
        <div class="txn-cards-wrap" style="max-width:720px">
          <div class="txn-list" id="recent-txn-list">
            \${txns.length ? renderTxnRows(txns) : '<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">No transactions yet</div><div class="empty-state-body">Add your first transaction with the + button.</div></div>'}
          </div>
        </div>\`;
      body.querySelectorAll('[data-nav-type]').forEach(el => {
        el.addEventListener('click', () => navigate('transactions', { type: el.dataset.navType, period: state.period }));
      });
      bindTxnRowClicks(body);
    })
    .catch(err => showToast('Failed to load overview: ' + err.message, 'error'));
}

// ── Transactions view ──────────────────────────────────────────────────────
function renderTransactions(area, topbarActions) {
  // Export button
  topbarActions.innerHTML = \`
    <div class="dropdown-wrap" id="export-wrap">
      <button class="icon-btn" id="export-btn" aria-label="Export CSV" title="Export CSV">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="dropdown-menu" id="export-menu">
        <button class="dropdown-item" id="export-expense">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v7M4 5.5l2.5 2.5 2.5-2.5M1.5 9.5v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Expenses CSV
        </button>
        <button class="dropdown-item" id="export-income">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v7M4 5.5l2.5 2.5 2.5-2.5M1.5 9.5v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Income CSV
        </button>
      </div>
    </div>\`;

  document.getElementById('export-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('export-menu').classList.toggle('open');
  });
  document.addEventListener('click', () => document.getElementById('export-menu')?.classList.remove('open'), { once: true });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById('export-expense').addEventListener('click', () => {
    window.location.href = \`/api/d1/export?type=expense&period=\${state.period}&timeZone=\${encodeURIComponent(tz)}\`;
  });
  document.getElementById('export-income').addEventListener('click', () => {
    window.location.href = \`/api/d1/export?type=income&period=\${state.period}&timeZone=\${encodeURIComponent(tz)}\`;
  });

  area.innerHTML = \`
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s6);flex-wrap:wrap;gap:var(--s4)">
        \${periodTabsHtml(state.period)}
        <div class="type-tabs">
          \${[['','All'],['expense','Expenses'],['income','Income']].map(([v,l]) => \`
            <button class="type-tab \${state.txnType===v?'active':''}" data-type="\${v}">\${l}</button>\`).join('')}
        </div>
      </div>
      <div id="txn-list-body">
        <div class="skeleton" style="height:48px;margin-bottom:8px;border-radius:var(--r-sm)"></div>
        <div class="skeleton" style="height:48px;margin-bottom:8px;border-radius:var(--r-sm)"></div>
        <div class="skeleton" style="height:48px;border-radius:var(--r-sm)"></div>
      </div>
    </div>\`;

  bindPeriodTabs(area, () => loadAndRenderTxns(area));

  area.querySelectorAll('.type-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.txnType = btn.dataset.type;
      area.querySelectorAll('.type-tab').forEach(b => b.classList.toggle('active', b.dataset.type === state.txnType));
      loadAndRenderTxns(area);
    });
  });

  loadAndRenderTxns(area);
}

function loadAndRenderTxns(area) {
  const body = document.getElementById('txn-list-body');
  if (!body) return;
  body.innerHTML = '<div class="skeleton" style="height:48px;border-radius:var(--r-sm)"></div>';
  loadTxns(state.period, state.txnType, state.categoryFilter)
    .then(txns => {
      if (!document.getElementById('txn-list-body')) return;
      if (state.categoryFilter && txns.length) {
        const cat = txns[0]?.category;
        if (cat) {
          state.categoryFilterName = cat;
          const el = document.getElementById('cat-filter-name');
          if (el) el.textContent = cat;
        }
      }
      renderTxnListBody(body, txns);
    })
    .catch(err => showToast('Failed to load transactions: ' + err.message, 'error'));
}

function renderTxnListBody(body, txns) {
  if (!txns.length) {
    const txnType = state.txnType || 'all';
    const icon  = txnType === 'income' ? '💚' : txnType === 'expense' ? '🧾' : '📭';
    const title = txnType === 'income' ? 'No income recorded' : txnType === 'expense' ? 'No expenses recorded' : 'No transactions yet';
    const hint  = txnType === 'income' ? 'Click + Add Transaction and select Income.' : txnType === 'expense' ? 'Click + Add Transaction to log an expense.' : 'Add your first transaction with the + button.';
    const ctaLabel = txnType === 'income' ? '+ Record Income' : '+ Add Expense';
    const ctaMode  = txnType === 'income' ? 'income' : 'expense';
    const ctaStyle = txnType === 'income'
      ? 'margin-top:16px;padding:10px 20px;border-radius:20px;border:none;cursor:pointer;font-weight:600;font-size:14px;background:rgba(0,192,96,0.15);color:#00a050;border:1px solid rgba(0,192,96,0.30);'
      : 'margin-top:16px;padding:10px 20px;border-radius:20px;border:none;cursor:pointer;font-weight:600;font-size:14px;background:rgba(255,70,70,0.10);color:#c03030;border:1px solid rgba(255,70,70,0.25);';
    body.innerHTML = \`<div class="empty-state"><div class="empty-state-icon">\${icon}</div><div class="empty-state-title">\${title}</div><div class="empty-state-body">\${hint}</div><button style="\${ctaStyle}" onclick="openAddPanelForType('\${ctaMode}')">\${ctaLabel}</button></div>\`;
    return;
  }

  // Group by date
  const groups = {};
  for (const t of txns) {
    const d = (t.date||'').split('T')[0];
    if (!groups[d]) groups[d] = [];
    groups[d].push(t);
  }

  body.innerHTML = \`<div class="txn-cards-wrap"><div class="txn-list">
    \${Object.entries(groups).map(([date, rows]) => {
      const net = rows.reduce((s,r) => r.txnType==='income' ? s+r.amount : s-r.amount, 0);
      return \`<div class="txn-day-group">
        <div class="txn-day-header">
          <span class="txn-day-label">\${dayLabel(date)}</span>
          <span class="txn-day-net \${net>=0?'positive':'negative'}">\${fmtAmt(Math.abs(net))}</span>
        </div>
        \${renderTxnRows(rows)}
      </div>\`;
    }).join('')}
  </div></div>\`;
  bindTxnRowClicks(body);
}

function bigIconHtml(icon, fallbackEmoji) {
  if (!icon) return fallbackEmoji;
  if (icon.type === 'emoji') return icon.value;
  if (icon.type === 'lucide') {
    const it = ICONS_LIB.find(x => x.key === 'lucide:' + icon.value);
    if (it) return \`<span style="display:inline-flex;width:24px;height:24px;">\${it.svg}</span>\`;
  }
  if (icon.type === 'bank') {
    const b = BANK_LOGOS.find(x => x.key === 'bank:' + icon.value);
    if (b) return \`<span style="display:inline-flex;width:32px;height:32px;border-radius:6px;overflow:hidden;">\${b.svg}</span>\`;
  }
  if (icon.type === 'brand') {
    const b = BRANDS_LIB.find(x => x.key === 'brand:' + icon.value);
    if (b) return \`<span style="display:inline-flex;width:32px;height:32px;border-radius:6px;overflow:hidden;">\${b.svg}</span>\`;
  }
  if (icon.type === 'image') {
    return \`<img src="\${icon.value}" alt="" style="width:32px;height:32px;border-radius:6px;object-fit:cover;" />\`;
  }
  return fallbackEmoji;
}

function pillIconHtml(icon) {
  if (!icon) return '';
  if (icon.type === 'emoji') return icon.value + ' ';
  if (icon.type === 'lucide') {
    const it = ICONS_LIB.find(x => x.key === 'lucide:' + icon.value);
    if (it) return \`<span style="display:inline-flex;width:14px;height:14px;vertical-align:-2px;margin-right:4px;">\${it.svg}</span>\`;
  }
  if (icon.type === 'bank') {
    const b = BANK_LOGOS.find(x => x.key === 'bank:' + icon.value);
    if (b) return \`<span style="display:inline-flex;width:16px;height:16px;vertical-align:-3px;margin-right:4px;border-radius:3px;overflow:hidden;">\${b.svg}</span>\`;
  }
  if (icon.type === 'brand') {
    const b = BRANDS_LIB.find(x => x.key === 'brand:' + icon.value);
    if (b) return \`<span style="display:inline-flex;width:16px;height:16px;vertical-align:-3px;margin-right:4px;border-radius:3px;overflow:hidden;">\${b.svg}</span>\`;
  }
  if (icon.type === 'image') {
    return \`<img src="\${icon.value}" alt="" style="width:16px;height:16px;vertical-align:-3px;margin-right:4px;border-radius:3px;object-fit:cover;" />\`;
  }
  return '';
}

function renderTxnRows(txns) {
  return txns.map(t => {
    const mainIcon  = t.subcategoryIcon || t.categoryIcon;
    const fallback  = t.txnType==='income' ? '💚' : '🧾';
    const iconHtml  = bigIconHtml(mainIcon, fallback);
    const timeStr   = t.date && t.date.includes('T') ? new Date(t.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
    const catPill   = t.category    ? \`<span class="txn-pill cat">\${pillIconHtml(t.categoryIcon)}\${t.category}</span>\`           : '';
    const subPill   = t.subcategory ? \`<span class="txn-pill cat">\${pillIconHtml(t.subcategoryIcon)}\${t.subcategory}</span>\`     : '';
    const acctPill  = t.account     ? \`<span class="txn-pill acct">\${pillIconHtml(t.accountIcon)}\${t.account}</span>\`            : '';
    return \`<div class="txn-row txn-\${t.txnType==='income'?'income':'expense'}" data-txn-id="\${t.id}" data-txn-type="\${t.txnType}">
      <div class="txn-row-icon \${t.txnType==='income'?'income-icon':'expense-icon'}">\${iconHtml}</div>
      <div class="txn-row-body">
        <div class="txn-row-name">\${t.name || t.category || '—'}</div>
        <div class="txn-row-pills">\${catPill}\${subPill}\${acctPill}</div>
      </div>
      <div class="txn-row-right">
        <div class="txn-row-amount \${t.txnType==='income'?'income':'expense'}">\${fmtAmt(t.amount)}</div>
        \${timeStr ? \`<div class="txn-row-time">\${timeStr}</div>\` : ''}
      </div>
    </div>\`;
  }).join('');
}

function renderTxnRowsMini(txns) {
  return txns.map(t => {
    const mainIcon = t.subcategoryIcon || t.categoryIcon;
    const fallback = t.txnType==='income' ? '💚' : '🧾';
    const iconHtml = bigIconHtml(mainIcon, fallback);
    return \`<div class="txn-row txn-\${t.txnType==='income'?'income':'expense'}" data-txn-id="\${t.id}" data-txn-type="\${t.txnType}">
      <div class="txn-row-icon \${t.txnType==='income'?'income-icon':'expense-icon'}">\${iconHtml}</div>
      <div class="txn-row-body">
        <div class="txn-row-name">\${t.name || t.category || '—'}</div>
      </div>
      <div class="txn-row-right">
        <div class="txn-row-amount \${t.txnType==='income'?'income':'expense'}">\${fmtAmt(t.amount)}</div>
      </div>
    </div>\`;
  }).join('');
}

function bindTxnRowClicks(container) {
  container.querySelectorAll('.txn-row').forEach(row => {
    row.addEventListener('click', () => {
      openPanelDetail(row.dataset.txnId);
    });
  });
}

// ── Analytics view ─────────────────────────────────────────────────────────
function renderAnalytics(area) {
  area.innerHTML = \`
    <div>
      \${periodTabsHtml(state.period)}
      <div style="margin-top:var(--s7)" id="analytics-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s7);margin-bottom:var(--s7)">
          <div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div>
          <div class="skeleton" style="height:200px;border-radius:var(--r-lg)"></div>
        </div>
        <div class="skeleton" style="height:280px;border-radius:var(--r-lg)"></div>
      </div>
    </div>\`;
  bindPeriodTabs(area, () => renderAnalytics(area));

  Promise.all([loadSummary(state.period), loadTxns(state.period,'','')])
    .then(([summary, txns]) => {
      const body = document.getElementById('analytics-body');
      if (!body) return;

      // ── Aggregations ──────────────────────────────────────────────────────
      const COLORS = ['#ff7a59','#5ad6c9','#f2c14e','#7f8cff','#c46cff','#ff5f9e','#58b368','#ff9f43'];

      // Category breakdown (expenses)
      const catTotals = {};
      for (const t of txns) {
        if (t.txnType !== 'expense') continue;
        const key = t.categoryId || '__none__';
        if (!catTotals[key]) catTotals[key] = { name: t.category || 'Uncategorized', amount: 0, count: 0, id: t.categoryId };
        catTotals[key].amount += t.amount;
        catTotals[key].count++;
      }
      const cats = Object.values(catTotals).sort((a,b) => b.amount - a.amount).slice(0,8);
      const catTotal = cats.reduce((s,c) => s+c.amount, 0);

      // Income by source (group by name/description)
      const incSrcTotals = {};
      for (const t of txns) {
        if (t.txnType !== 'income') continue;
        const key = t.name || t.description || 'Unknown';
        if (!incSrcTotals[key]) incSrcTotals[key] = { name: key, amount: 0, count: 0 };
        incSrcTotals[key].amount += t.amount;
        incSrcTotals[key].count++;
      }
      const incSrcs = Object.values(incSrcTotals).sort((a,b) => b.amount - a.amount).slice(0,8);
      const incSrcTotal = incSrcs.reduce((s,c) => s+c.amount, 0);

      // Account spending (expenses by account)
      const acctTotals = {};
      for (const t of txns) {
        if (t.txnType !== 'expense') continue;
        const key = t.account || 'Unknown';
        if (!acctTotals[key]) acctTotals[key] = { name: key, amount: 0, count: 0 };
        acctTotals[key].amount += t.amount;
        acctTotals[key].count++;
      }
      const accts = Object.values(acctTotals).sort((a,b) => b.amount - a.amount).slice(0,8);
      const acctTotal = accts.reduce((s,c) => s+c.amount, 0);

      const maxAmt = Math.max(summary.totalIncome, summary.totalExpenses, 1);

      // ── Helper: render inline list (swatch + name + pct + amt) ────────────
      const renderInlineList = (rows, total, colorFn) =>
        rows.length ? \`
          <div style="display:flex;flex-direction:column;gap:2px">
            \${rows.map((c,i) => \`
              <div style="display:grid;grid-template-columns:36px 1fr 52px 110px;gap:0 var(--s5);align-items:center;padding:var(--s4) var(--s5);border-radius:var(--r-md);transition:background var(--dur-fast)" class="analytics-inline-row">
                <span style="background:\${colorFn(i)};width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:var(--text-xs);font-weight:700;flex-shrink:0">\${c.name.charAt(0).toUpperCase()}</span>
                <div style="overflow:hidden">
                  <div style="font-size:var(--text-base);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${c.name}</div>
                  <div style="font-size:var(--text-xs);color:var(--fg-muted);font-weight:400;margin-top:2px">\${c.count} txn\${c.count===1?'':'s'}</div>
                </div>
                <span style="font-size:var(--text-sm);color:var(--fg-muted);font-weight:600;text-align:right">\${total>0?(c.amount/total*100).toFixed(0):0}%</span>
                <span style="font-size:var(--text-base);font-weight:600;color:var(--color-accent);text-align:right">\${fmtAmt(c.amount)}</span>
              </div>\`).join('')}
          </div>\`
        : '<div class="empty-state" style="padding:var(--s8) 0"><div class="empty-state-icon">📊</div><div class="empty-state-title">No data</div></div>';

      const incomeColor = i => ['#34c78a','#27ae60','#48d1a0','#6ee7b7','#a7f3d0','#059669','#10b981','#52d9a0'][i % 8];
      const acctColor   = i => ['#e05050','#d44444','#cc3a3a','#b83232','#e86060','#f08080','#c84040','#a83030'][i % 8];

      body.innerHTML = \`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s7);margin-bottom:var(--s7)">
          <div class="analytics-card">
            <div class="analytics-card-title">Income vs Expenses</div>
            <div class="bar-chart">
              <div class="bar-row">
                <span class="bar-label" style="color:var(--color-income)">Income</span>
                <div class="bar-track"><div class="bar-fill income" style="width:\${(summary.totalIncome/maxAmt*100).toFixed(1)}%"></div></div>
                <span class="bar-value" style="color:var(--color-income)">\${fmtAmt(summary.totalIncome)}</span>
              </div>
              <div class="bar-row">
                <span class="bar-label" style="color:var(--color-accent)">Expenses</span>
                <div class="bar-track"><div class="bar-fill expense" style="width:\${(summary.totalExpenses/maxAmt*100).toFixed(1)}%"></div></div>
                <span class="bar-value" style="color:var(--color-accent)">\${fmtAmt(summary.totalExpenses)}</span>
              </div>
              <div style="margin-top:var(--s6);padding-top:var(--s5);border-top:1px solid var(--border)">
                <div style="font-size:var(--text-xs);color:var(--fg-muted);margin-bottom:var(--s2)">Net Balance</div>
                <div style="font-family:var(--font-display);font-size:var(--text-xl);font-weight:700;color:\${summary.balance>=0?'var(--color-income)':'var(--color-accent)'}">
                  \${summary.balance>=0?'+':'−'}\${fmtAmt(Math.abs(summary.balance))}
                </div>
              </div>
            </div>
          </div>
          <div class="analytics-card">
            <div class="analytics-card-title">Income by Source</div>
            \${renderInlineList(incSrcs, incSrcTotal, incomeColor)}
          </div>
        </div>
        <div class="analytics-card" style="margin-bottom:var(--s7)">
          <div class="analytics-card-title">Spending by Account</div>
          \${renderInlineList(accts, acctTotal, acctColor)}
        </div>
        \${cats.length ? \`
          <div class="analytics-card" style="margin-top:0">
            <div class="analytics-card-title">Category Breakdown</div>
            <div id="analytics-cat-list" class="cat-list"></div>
          </div>\` : ''}
      \`;

      // Category breakdown list
      const catListEl = document.getElementById('analytics-cat-list');
      if (catListEl && cats.length) {
        catListEl.innerHTML = cats.map((c, i) => \`
          <div class="cat-row" data-cat-id="\${c.id}" data-cat-name="\${c.name}" style="cursor:pointer">
            <span class="cat-row-rank">\${i+1}</span>
            <span class="cat-row-dot" style="background:\${COLORS[i%COLORS.length]}"></span>
            <div class="cat-row-name">
              \${c.name}
              <div style="font-size:var(--text-xs);color:var(--fg-muted);font-weight:400;margin-top:2px">\${c.count} expense\${c.count===1?'':'s'}</div>
            </div>
            <div class="cat-row-bar-wrap">
              <div class="cat-row-bar" style="width:\${catTotal>0?(c.amount/catTotal*100).toFixed(1):0}%;background:\${COLORS[i%COLORS.length]}"></div>
            </div>
            <span class="cat-row-pct">\${catTotal>0?(c.amount/catTotal*100).toFixed(0):0}%</span>
            <span class="cat-row-amt">\${fmtAmt(c.amount)}</span>
          </div>\`).join('');
        catListEl.querySelectorAll('.cat-row').forEach(el => {
          el.addEventListener('click', () => {
            state.categoryFilter = el.dataset.catId;
            state.categoryFilterName = el.dataset.catName;
            navigate('transactions', { category: el.dataset.catId });
          });
        });
      }
    })
    .catch(err => showToast('Failed to load analytics: ' + err.message, 'error'));
}

// ── Search view ────────────────────────────────────────────────────────────
function renderSearch(area) {
  const now = new Date();
  const y = now.getFullYear(), m = String(now.getMonth()+1).padStart(2,'0');
  const fromDefault = \`\${y}-\${m}-01\`;
  const toDefault = \`\${y}-\${m}-\${String(new Date(y,now.getMonth()+1,0).getDate()).padStart(2,'0')}\`;

  let searchType = '';
  let searchCategory = '';
  let searchAccount = '';
  let searchSubcat = '';
  let searchSortBy = 'date';
  let searchSortDir = 'desc';

  const buildSearchUI = (bs) => {
    const cats    = bs.categories    || [];
    const subcats = bs.subcategories || [];
    const accts   = bs.accounts      || [];

    const catChipsHtml  = cats.map(c =>
      \`<button class="cat-filter-chip" data-id="\${c.id}" data-name="\${c.name}">\${c.name}</button>\`).join('');
    const acctChipsHtml = accts.map(a =>
      \`<button class="cat-filter-chip" data-id="\${a.id}" data-name="\${a.name}">\${chipIcon(a.icon,'🏦')} \${a.name}</button>\`).join('');

    const catOptions  = cats.map(c  => \`<option value="\${c.id}">\${c.name}</option>\`).join('');
    const acctOptions = accts.map(a => \`<option value="\${a.id}">\${a.name}</option>\`).join('');

    area.innerHTML = \`
      <div>
        <!-- Search bar row -->
        <div style="display:flex;gap:var(--s4);margin-bottom:var(--s5)">
          <div class="search-bar-wrap" style="flex:1;margin-bottom:0">
            <svg class="search-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <input type="text" class="search-input" id="search-q" placeholder="Search transactions…" autocomplete="off" autofocus/>
          </div>
          <button class="panel-save-btn" id="search-btn" style="flex-shrink:0;padding:0 var(--s7)">Search</button>
          <button id="search-export-btn" title="Export results as CSV" style="flex-shrink:0;padding:0 var(--s5);height:44px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--color-bg-surface);color:var(--fg);font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:var(--s2);">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1v9M5 7l2.5 3 2.5-3M2 11v1.5A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Export CSV</span>
          </button>
        </div>

        <!-- Type + Date + Sort row -->
        <div style="display:flex;align-items:center;gap:var(--s6);margin-bottom:var(--s5);flex-wrap:wrap">
          <div class="type-tabs" id="search-type-tabs">
            \${[['','All'],['expense','Expenses'],['income','Income']].map(([v,l]) => \`
              <button class="type-tab \${searchType===v?'active':''}" data-type="\${v}">\${l}</button>\`).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:var(--s3)">
            <span class="search-filter-label">From</span>
            <input type="date" class="date-input" id="search-from" value="\${fromDefault}"/>
            <span class="search-filter-label">To</span>
            <input type="date" class="date-input" id="search-to" value="\${toDefault}"/>
          </div>
          <div style="display:flex;align-items:center;gap:var(--s3)">
            <span class="search-filter-label">Sort</span>
            <select class="date-input" id="sort-sel" style="height:36px">
              <option value="date-desc">Date: New → Old</option>
              <option value="date-asc">Date: Old → New</option>
              <option value="amount-desc">Amount: High → Low</option>
              <option value="amount-asc">Amount: Low → High</option>
            </select>
          </div>
        </div>

        <!-- Dropdown filters row -->
        <div style="display:flex;align-items:center;gap:var(--s6);margin-bottom:var(--s6);flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:var(--s3)">
            <span class="search-filter-label">Category</span>
            <select class="date-input" id="search-cat-sel" style="min-width:160px;height:36px">
              <option value="">All categories</option>
              \${catOptions}
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:var(--s3)" id="search-subcat-wrap">
            <span class="search-filter-label">Subcategory</span>
            <select class="date-input" id="search-subcat-sel" style="min-width:160px;height:36px">
              <option value="">All subcategories</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:var(--s3)">
            <span class="search-filter-label">Account</span>
            <select class="date-input" id="search-acct-sel" style="min-width:160px;height:36px">
              <option value="">All accounts</option>
              \${acctOptions}
            </select>
          </div>
        </div>

        <div id="search-results-body">
          <div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Start typing to search</div></div>
        </div>
      </div>\`;

    const execSearch = async () => {
      const q    = document.getElementById('search-q')?.value.trim() || '';
      const from = document.getElementById('search-from')?.value || '';
      const to   = document.getElementById('search-to')?.value || '';
      const body = document.getElementById('search-results-body');
      if (!body) return;
      body.innerHTML = '<div class="skeleton" style="height:64px;border-radius:var(--r-lg)"></div>';
      try {
        const txns = await searchTxns(q, from, to, searchType, searchCategory, searchAccount, searchSubcat, searchSortBy, searchSortDir);
        renderTxnListBody(body, txns);
      } catch(err) { showToast('Search failed: ' + err.message, 'error'); }
    };

    let debounce;
    const doSearch = () => { clearTimeout(debounce); debounce = setTimeout(execSearch, 250); };

    // Update subcategory dropdown when category changes
    const updateSubcatDropdown = () => {
      const sel = document.getElementById('search-subcat-sel');
      if (!sel) return;
      const filtered = subcats.filter(s => (s.categoryId || s.category_id) === searchCategory);
      sel.innerHTML = '<option value="">All subcategories</option>' +
        filtered.map(s => \`<option value="\${s.id}">\${s.name}</option>\`).join('');
      searchSubcat = '';
    };

    document.getElementById('search-q').addEventListener('input', doSearch);
    document.getElementById('search-btn').addEventListener('click', execSearch);
    document.getElementById('search-from').addEventListener('change', doSearch);
    document.getElementById('search-to').addEventListener('change', doSearch);

    document.getElementById('sort-sel').addEventListener('change', (e) => {
      const [sb, sd] = e.target.value.split('-');
      searchSortBy = sb; searchSortDir = sd;
      doSearch();
    });

    document.getElementById('search-cat-sel').addEventListener('change', (e) => {
      searchCategory = e.target.value;
      searchSubcat = '';
      updateSubcatDropdown();
      doSearch();
    });
    document.getElementById('search-subcat-sel').addEventListener('change', (e) => {
      searchSubcat = e.target.value; doSearch();
    });
    document.getElementById('search-acct-sel').addEventListener('change', (e) => {
      searchAccount = e.target.value; doSearch();
    });

    // Type tabs
    document.getElementById('search-type-tabs').querySelectorAll('.type-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        searchType = btn.dataset.type;
        document.getElementById('search-type-tabs').querySelectorAll('.type-tab')
          .forEach(b => b.classList.toggle('active', b.dataset.type === searchType));
        doSearch();
      });
    });

    document.getElementById('search-export-btn').addEventListener('click', () => {
      const q    = document.getElementById('search-q')?.value.trim() || '';
      const from = document.getElementById('search-from')?.value || '';
      const to   = document.getElementById('search-to')?.value || '';
      const tz   = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
      let url = \`/api/d1/export?type=\${searchType||'expense'}&timeZone=\${tz}\`;
      if (from) url += \`&from=\${from}\`;
      if (to)   url += \`&to=\${to}\`;
      if (q)    url += \`&q=\${encodeURIComponent(q)}\`;
      if (searchCategory) url += \`&category=\${encodeURIComponent(searchCategory)}\`;
      if (searchSubcat)   url += \`&subcategory=\${encodeURIComponent(searchSubcat)}\`;
      if (searchAccount)  url += \`&account=\${encodeURIComponent(searchAccount)}\`;
      window.location.href = url;
    });

    execSearch();
  };

  // Use cached bootstrap or load it
  if (state.bootstrap) {
    buildSearchUI(state.bootstrap);
  } else {
    area.innerHTML = '<div class="skeleton" style="height:44px;border-radius:var(--r-md);margin-bottom:var(--s4)"></div>';
    loadBootstrap()
      .catch(() => ({ categories: [], subcategories: [], accounts: [] }))
      .then(buildSearchUI);
  }
}

// ── Settings view ──────────────────────────────────────────────────────────
const SETTINGS_EMOJI_QUICKPICK = ["🍽️","🍕","☕","🛒","🚗","✈️","🏠","💡","💊","💰","💸","💳","📈","📉","🎁","🎬","🎵","📱","👕","💄","🧴","⛽","🚇","🚲","🏥","📚","🎓","🐶","🪴","⚙️"];
let settingsTab = 'categories';
let settingsPickerCtx = null;

function renderSettings(area, topbarActions) {
  // Add new item button in topbar
  if (topbarActions) {
    topbarActions.innerHTML = \`
      <button class="panel-save-btn" id="settings-add-btn" style="height:36px;padding:0 var(--s5);font-size:var(--text-sm);">+ Add</button>\`;
    document.getElementById('settings-add-btn').addEventListener('click', () => openAddSettingsModal(area, topbarActions));
  }

  area.innerHTML = \`
    <div style="max-width:760px;margin:0 auto;">
      <div class="settings-tabs" style="display:flex;gap:6px;padding:4px;background:var(--color-bg-surface);border-radius:var(--r-md);margin-bottom:var(--s5);">
        \${['categories','subcategories','accounts'].map(t => \`
          <button class="settings-tab \${t===settingsTab?'active':''}" data-tab="\${t}" style="flex:1;padding:10px;border:none;background:\${t===settingsTab?'var(--color-bg-surface-raised)':'transparent'};color:\${t===settingsTab?'var(--fg)':'var(--fg-soft)'};border-radius:var(--r-sm);font-weight:500;cursor:pointer;text-transform:capitalize;">\${t}</button>
        \`).join('')}
      </div>
      <div id="settings-list" style="display:flex;flex-direction:column;gap:var(--s2);"></div>
    </div>
  \`;

  area.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      settingsTab = btn.dataset.tab;
      renderSettings(area, topbarActions);
    });
  });

  loadBootstrap()
    .catch(() => ({ categories: [], subcategories: [], accounts: [] }))
    .then(bs => {
      const list = document.getElementById('settings-list');
      if (!list) return;
      const items = bs[settingsTab] || [];
      const sorted = [...items].sort((a, b) => (a.name||'').localeCompare(b.name||''));
      const subParents = settingsTab === 'subcategories'
        ? Object.fromEntries((bs.categories||[]).map(c => [c.id, c.name]))
        : null;

      if (!sorted.length) {
        list.innerHTML = '<div class="empty-state" style="padding:var(--s8) 0"><div class="empty-state-icon">📦</div><div class="empty-state-title">Nothing here yet</div></div>';
        return;
      }

      list.innerHTML = sorted.map(item => {
        const fallback = (item.name || '?').charAt(0);
        const meta = subParents ? subParents[item.categoryId] || '' : '';
        const iconHtml = renderSettingsIcon(item.icon, fallback);
        return \`<div class="settings-row" data-row-id="\${item.id}" style="display:flex;align-items:center;gap:var(--s4);padding:var(--s3) var(--s4);background:var(--color-bg-surface);border:1px solid var(--border);border-radius:var(--r-md);">
          <button class="settings-icon-btn" data-edit-icon style="width:44px;height:44px;border-radius:var(--r-sm);background:var(--color-bg-surface-raised);border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden;flex-shrink:0;">\${iconHtml}</button>
          <div style="flex:1;min-width:0;">
            <input class="settings-name-input" data-edit-name value="\${escapeAttr(item.name||'')}" style="width:100%;border:none;background:transparent;color:var(--fg);font-size:var(--text-base);font-weight:500;padding:6px 0;outline:none;border-bottom:1px solid transparent;" />
            \${meta ? \`<div style="font-size:var(--text-xs);color:var(--fg-soft);margin-top:2px;">in \${escapeAttr(meta)}</div>\` : ''}
          </div>
          <button class="icon-btn" data-edit-icon aria-label="Edit icon" style="width:36px;height:36px;border:none;background:transparent;color:var(--fg-soft);border-radius:var(--r-sm);cursor:pointer;" title="Edit icon">✎</button>
          <button class="icon-btn" data-delete-item aria-label="Delete" style="width:36px;height:36px;border:none;background:transparent;color:var(--color-status-error);border-radius:var(--r-sm);cursor:pointer;opacity:.7;" title="Delete">✕</button>
        </div>\`;
      }).join('');

      list.querySelectorAll('.settings-row').forEach(row => {
        const id = row.dataset.rowId;
        const item = sorted.find(x => x.id === id);
        const nameInput = row.querySelector('[data-edit-name]');
        let originalName = item.name || '';
        nameInput.addEventListener('focus', () => { originalName = nameInput.value; nameInput.style.borderBottomColor = 'var(--color-accent)'; });
        nameInput.addEventListener('blur', async () => {
          nameInput.style.borderBottomColor = 'transparent';
          const next = nameInput.value.trim();
          if (!next || next === originalName) { nameInput.value = originalName; return; }
          try {
            await fetch('/api/d1/' + settingsTab + '/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: next })
            }).then(r => { if (!r.ok) throw new Error('rename failed'); });
            item.name = next;
            invalidateBootstrapCache();
            showToast('Renamed');
          } catch {
            nameInput.value = originalName;
            showToast('Couldn\\'t rename');
          }
        });
        nameInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') nameInput.blur();
          if (e.key === 'Escape') { nameInput.value = originalName; nameInput.blur(); }
        });
        row.querySelectorAll('[data-edit-icon]').forEach(btn => {
          btn.addEventListener('click', () => openSettingsPicker(settingsTab, item));
        });
        row.querySelector('[data-delete-item]')?.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm('Delete "' + item.name + '"?')) return;
          try {
            const r = await fetch('/api/d1/' + settingsTab + '/' + id, { method: 'DELETE' });
            if (!r.ok) throw new Error('delete failed');
            invalidateBootstrapCache();
            showToast('Deleted');
            renderSettings(area, topbarActions);
          } catch {
            showToast('Couldn\\'t delete');
          }
        });
      });
    });
}

let addSettingsIconPayload = null;

function openAddSettingsModal(area, topbarActions) {
  let modal = document.getElementById('add-settings-modal');
  if (modal) modal.remove();
  addSettingsIconPayload = null;
  const labels = { categories: 'Category', subcategories: 'Subcategory', accounts: 'Account' };
  const label = labels[settingsTab] || settingsTab;
  const isAccount = settingsTab === 'accounts';
  const isSubcat  = settingsTab === 'subcategories';

  modal = document.createElement('div');
  modal.id = 'add-settings-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:var(--s4);';

  let catSelectHtml = '';
  if (isSubcat && state.bootstrap) {
    const cats = [...(state.bootstrap.categories || [])].sort((a, b) => a.name.localeCompare(b.name));
    catSelectHtml = \`<div style="margin-bottom:var(--s4);">
      <label style="display:block;font-size:var(--text-xs);font-weight:600;color:var(--fg-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:var(--s2);">Parent Category</label>
      <select id="add-settings-cat-sel" style="width:100%;height:44px;padding:0 var(--s5);border:1px solid var(--border);border-radius:var(--r-md);background:var(--color-bg-surface-raised);color:var(--fg);font-size:var(--text-base);">
        <option value="">No parent category</option>
        \${cats.map(c => \`<option value="\${escapeAttr(c.id)}">\${escapeAttr(c.name)}</option>\`).join('')}
      </select>
    </div>\`;
  }

  modal.innerHTML = \`
    <div role="dialog" aria-modal="true" style="background:var(--color-bg-surface);border-radius:var(--r-lg);box-shadow:var(--shadow-md);width:460px;max-width:100%;display:flex;flex-direction:column;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--s5);border-bottom:1px solid var(--border);">
        <div style="font-size:var(--text-lg);font-weight:600;">Add \${label}</div>
        <button id="add-settings-close" style="border:none;background:transparent;font-size:24px;color:var(--fg-soft);cursor:pointer;">×</button>
      </div>
      <div style="padding:var(--s5);display:flex;flex-direction:column;gap:var(--s4);">
        <div style="display:flex;align-items:center;gap:var(--s4);">
          <button id="add-settings-icon-btn" title="Choose icon" style="width:52px;height:52px;border-radius:var(--r-md);background:var(--color-bg-surface-raised);border:1px dashed var(--border);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;" aria-label="Choose icon">
            <span id="add-settings-icon-preview" style="display:inline-flex;width:32px;height:32px;align-items:center;justify-content:center;">+</span>
          </button>
          <input id="add-settings-name" type="text" placeholder="\${label} name…" style="flex:1;height:44px;padding:0 var(--s5);border:1px solid var(--border);border-radius:var(--r-md);background:var(--color-bg-surface-raised);color:var(--fg);font-size:var(--text-base);outline:none;" autofocus/>
        </div>
        \${catSelectHtml}
      </div>
      <div style="padding:0 var(--s5) var(--s5);display:flex;gap:var(--s3);">
        <button id="add-settings-cancel" style="flex:1;height:40px;border:1px solid var(--border);border-radius:var(--r-md);background:transparent;color:var(--fg-soft);font-weight:500;cursor:pointer;">Cancel</button>
        <button id="add-settings-save" style="flex:2;height:40px;border:none;border-radius:var(--r-md);background:var(--color-accent);color:#fff;font-weight:600;cursor:pointer;">Add \${label}</button>
      </div>
    </div>
  \`;
  document.body.appendChild(modal);

  const nameInput = modal.querySelector('#add-settings-name');
  modal.querySelector('#add-settings-close').addEventListener('click', () => modal.remove());
  modal.querySelector('#add-settings-cancel').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  modal.querySelector('#add-settings-icon-btn').addEventListener('click', () => {
    const ctx = { table: settingsTab, id: '__new__', name: nameInput.value || label };
    openSettingsPickerForNew(ctx, (payload) => {
      addSettingsIconPayload = payload;
      // Update preview
      const preview = document.getElementById('add-settings-icon-preview');
      if (!preview) return;
      if (payload.emoji) {
        preview.textContent = payload.emoji;
      } else if (payload.iconUrl) {
        const key = payload.iconUrl;
        if (key.startsWith('lucide:')) {
          const it = ICONS_LIB.find(x => x.key === key);
          preview.innerHTML = it ? \`<span style="display:inline-flex;width:24px;height:24px;">\${it.svg}</span>\` : key;
        } else if (key.startsWith('bank:')) {
          const b = BANK_LOGOS.find(x => x.key === key);
          preview.innerHTML = b ? \`<span style="display:inline-flex;width:32px;height:32px;border-radius:6px;overflow:hidden;">\${b.svg}</span>\` : key;
        } else if (key.startsWith('brand:')) {
          const b = BRANDS_LIB.find(x => x.key === key);
          preview.innerHTML = b ? \`<span style="display:inline-flex;width:32px;height:32px;border-radius:6px;overflow:hidden;">\${b.svg}</span>\` : key;
        }
      }
    });
  });

  async function doSave() {
    const name = nameInput.value.trim();
    if (!name) { nameInput.focus(); return; }
    const body = { name };
    if (addSettingsIconPayload) {
      if (addSettingsIconPayload.emoji)   body.emoji   = addSettingsIconPayload.emoji;
      if (addSettingsIconPayload.iconUrl) body.iconUrl = addSettingsIconPayload.iconUrl;
    }
    if (isSubcat) {
      const sel = document.getElementById('add-settings-cat-sel');
      if (sel && sel.value) body.categoryId = sel.value;
    }
    const saveBtn = document.getElementById('add-settings-save');
    if (saveBtn) saveBtn.disabled = true;
    try {
      const r = await fetch('/api/d1/' + settingsTab, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Create failed'); }
      modal.remove();
      addSettingsIconPayload = null;
      invalidateBootstrapCache();
      showToast(label + ' added');
      renderSettings(area, topbarActions);
    } catch (err) {
      showToast('Couldn\\'t add: ' + err.message);
      if (saveBtn) saveBtn.disabled = false;
    }
  }
  modal.querySelector('#add-settings-save').addEventListener('click', doSave);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSave(); });
}

function openSettingsPickerForNew(ctx, onCommit) {
  let pickerModal = document.getElementById('new-icon-picker-modal');
  if (pickerModal) pickerModal.remove();
  const isAccount = ctx.table === 'accounts';
  const defaultTab = isAccount ? 'banks' : 'icons';

  pickerModal = document.createElement('div');
  pickerModal.id = 'new-icon-picker-modal';
  pickerModal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1100;padding:var(--s4);';
  pickerModal.innerHTML = \`
    <div role="dialog" aria-modal="true" style="background:var(--color-bg-surface);border-radius:var(--r-lg);box-shadow:var(--shadow-md);width:560px;max-width:100%;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--s5);border-bottom:1px solid var(--border);">
        <div style="font-size:var(--text-lg);font-weight:600;">Choose Icon</div>
        <button id="nip-close" style="border:none;background:transparent;font-size:24px;color:var(--fg-soft);cursor:pointer;">×</button>
      </div>
      <div style="display:flex;gap:var(--s2);padding:0 var(--s5);border-bottom:1px solid var(--border);">
        <button class="nip-tab" data-ntab="icons" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Icons</button>
        <button class="nip-tab" data-ntab="emoji" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Emoji</button>
        <button class="nip-tab" data-ntab="brands" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Brands</button>
        \${isAccount ? '<button class="nip-tab" data-ntab="banks" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Banks</button>' : ''}
      </div>
      <div style="padding:var(--s5);overflow-y:auto;flex:1;">
        <div data-npanel="icons" style="display:none;"><div id="nip-icons-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:var(--s2);"></div></div>
        <div data-npanel="emoji" style="display:none;">
          <div style="display:grid;grid-template-columns:1fr auto;gap:var(--s3);margin-bottom:var(--s4);align-items:stretch;">
            <input id="nip-emoji-input" type="text" placeholder="Type any emoji…" maxlength="8" style="height:52px;padding:0 var(--s5);border:1px solid var(--border);border-radius:var(--r-sm);background:var(--color-bg-surface-raised);color:var(--fg);font-size:28px;text-align:center;" />
            <button id="nip-emoji-use" style="height:52px;padding:0 var(--s6);border:none;background:var(--color-accent);color:#fff;border-radius:var(--r-sm);font-weight:600;cursor:pointer;">Use</button>
          </div>
          <div id="nip-emoji-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:var(--s2);"></div>
        </div>
        <div data-npanel="brands" style="display:none;"><div id="nip-brands-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s3);"></div></div>
        \${isAccount ? '<div data-npanel="banks" style="display:none;"><div id="nip-banks-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s3);"></div></div>' : ''}
      </div>
    </div>
  \`;
  document.body.appendChild(pickerModal);

  const setNTab = (tab) => {
    pickerModal.querySelectorAll('[data-ntab]').forEach(b => {
      const a = b.dataset.ntab === tab;
      b.style.borderBottomColor = a ? 'var(--color-accent)' : 'transparent';
      b.style.color = a ? 'var(--fg)' : 'var(--fg-soft)';
    });
    pickerModal.querySelectorAll('[data-npanel]').forEach(p => {
      p.style.display = p.dataset.npanel === tab ? 'block' : 'none';
    });
  };
  pickerModal.querySelectorAll('[data-ntab]').forEach(b => b.addEventListener('click', () => setNTab(b.dataset.ntab)));

  const commit = (payload) => { pickerModal.remove(); onCommit(payload); };
  pickerModal.querySelector('#nip-close').addEventListener('click', () => pickerModal.remove());
  pickerModal.addEventListener('click', e => { if (e.target === pickerModal) pickerModal.remove(); });

  const iconsGrid = pickerModal.querySelector('#nip-icons-grid');
  iconsGrid.innerHTML = ICONS_LIB.map(it => \`<button data-nipkey="\${escapeAttr(it.key)}" aria-label="\${escapeAttr(it.name)}" style="aspect-ratio:1;border:1px solid var(--border);background:var(--color-bg-surface-raised);border-radius:var(--r-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--fg);"><span style="width:24px;height:24px;display:inline-flex;">\${it.svg}</span></button>\`).join('');
  iconsGrid.querySelectorAll('[data-nipkey]').forEach(c => c.addEventListener('click', () => commit({ emoji: null, iconUrl: c.dataset.nipkey })));

  const emojiGrid = pickerModal.querySelector('#nip-emoji-grid');
  emojiGrid.innerHTML = SETTINGS_EMOJI_QUICKPICK.map(e => \`<button style="aspect-ratio:1;border:1px solid var(--border);background:var(--color-bg-surface-raised);border-radius:var(--r-sm);font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;">\${e}</button>\`).join('');
  emojiGrid.querySelectorAll('button').forEach((c, i) => c.addEventListener('click', () => commit({ emoji: SETTINGS_EMOJI_QUICKPICK[i], iconUrl: null })));
  const nipEmojiInput = pickerModal.querySelector('#nip-emoji-input');
  pickerModal.querySelector('#nip-emoji-use').addEventListener('click', () => {
    const v = nipEmojiInput.value.trim();
    if (v) commit({ emoji: v, iconUrl: null });
  });
  nipEmojiInput.addEventListener('keydown', e => { if (e.key === 'Enter') { const v = nipEmojiInput.value.trim(); if (v) commit({ emoji: v, iconUrl: null }); } });

  const brandsGrid = pickerModal.querySelector('#nip-brands-grid');
  brandsGrid.innerHTML = BRANDS_LIB.map(b => \`<button data-nipbrand="\${escapeAttr(b.key)}" aria-label="\${escapeAttr(b.name)}" style="aspect-ratio:1;border:1px solid var(--border);background:transparent;border-radius:var(--r-md);cursor:pointer;overflow:hidden;padding:0;"><span style="display:block;width:100%;height:100%;">\${b.svg}</span></button>\`).join('');
  brandsGrid.querySelectorAll('[data-nipbrand]').forEach(c => c.addEventListener('click', () => commit({ emoji: null, iconUrl: c.dataset.nipbrand })));

  if (isAccount) {
    const banksGrid = pickerModal.querySelector('#nip-banks-grid');
    banksGrid.innerHTML = BANK_LOGOS.map(b => \`<button data-nipbank="\${escapeAttr(b.key)}" aria-label="\${escapeAttr(b.name)}" style="aspect-ratio:1;border:1px solid var(--border);background:transparent;border-radius:var(--r-md);cursor:pointer;overflow:hidden;padding:0;"><span style="display:block;width:100%;height:100%;">\${b.svg}</span></button>\`).join('');
    banksGrid.querySelectorAll('[data-nipbank]').forEach(c => c.addEventListener('click', () => commit({ emoji: null, iconUrl: c.dataset.nipbank })));
  }

  setNTab(defaultTab);
}

function renderSettingsIcon(icon, fallback) {
  if (!icon) return \`<span>\${escapeAttr(fallback)}</span>\`;
  if (icon.type === 'emoji') return \`<span>\${escapeAttr(icon.value)}</span>\`;
  if (icon.type === 'image') return \`<img src="\${escapeAttr(icon.value)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:var(--r-sm);" />\`;
  if (icon.type === 'lucide') {
    const it = ICONS_LIB.find(x => x.key === 'lucide:' + icon.value);
    if (it) return \`<span style="display:inline-flex;width:24px;height:24px;">\${it.svg}</span>\`;
  }
  if (icon.type === 'bank') {
    const b = BANK_LOGOS.find(x => x.key === 'bank:' + icon.value);
    if (b) return \`<span style="display:inline-flex;width:36px;height:36px;border-radius:8px;overflow:hidden;">\${b.svg}</span>\`;
  }
  if (icon.type === 'brand') {
    const b = BRANDS_LIB.find(x => x.key === 'brand:' + icon.value);
    if (b) return \`<span style="display:inline-flex;width:36px;height:36px;border-radius:8px;overflow:hidden;">\${b.svg}</span>\`;
  }
  return \`<span>\${escapeAttr(fallback)}</span>\`;
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function openSettingsPicker(table, item) {
  settingsPickerCtx = { table, id: item.id, name: item.name };
  let modal = document.getElementById('settings-picker-modal');
  if (modal) modal.remove();
  const isAccount = table === 'accounts';
  const defaultTab = isAccount ? 'banks' : 'icons';

  modal = document.createElement('div');
  modal.id = 'settings-picker-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:var(--s4);';
  modal.innerHTML = \`
    <div role="dialog" aria-modal="true" style="background:var(--color-bg-surface);border-radius:var(--r-lg);box-shadow:var(--shadow-md);width:560px;max-width:100%;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--s5);border-bottom:1px solid var(--border);">
        <div style="font-size:var(--text-lg);font-weight:600;">Icon for \${escapeAttr(item.name||'')}</div>
        <button id="settings-picker-close" style="border:none;background:transparent;font-size:24px;color:var(--fg-soft);cursor:pointer;">×</button>
      </div>
      <div style="display:flex;gap:var(--s2);padding:0 var(--s5);border-bottom:1px solid var(--border);">
        <button class="dpicker-tab" data-dtab="icons" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Icons</button>
        <button class="dpicker-tab" data-dtab="emoji" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Emoji</button>
        <button class="dpicker-tab" data-dtab="brands" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Brands</button>
        \${isAccount ? '<button class="dpicker-tab" data-dtab="banks" style="padding:var(--s3) var(--s4);border:none;background:transparent;color:var(--fg);font-weight:500;cursor:pointer;border-bottom:2px solid transparent;">Banks</button>' : ''}
      </div>
      <div style="padding:var(--s5);overflow-y:auto;">
        <div data-dpanel="icons" style="display:none;">
          <div id="dpicker-icons-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:var(--s2);"></div>
        </div>
        <div data-dpanel="emoji" style="display:none;">
          <div style="display:grid;grid-template-columns:1fr auto;gap:var(--s3);margin-bottom:var(--s4);align-items:stretch;">
            <input id="dpicker-emoji-input" type="text" placeholder="Type or paste any emoji…" maxlength="8" size="1" style="width:100%;min-width:0;height:56px;padding:0 var(--s5);border:1px solid var(--border);border-radius:var(--r-sm);background:var(--color-bg-surface-raised);color:var(--fg);font-size:24px;text-align:center;box-sizing:border-box;" />
            <button id="dpicker-emoji-use" type="button" style="height:56px;padding:0 var(--s7);border:none;background:var(--color-accent);color:#fff;border-radius:var(--r-sm);font-weight:600;font-size:15px;cursor:pointer;white-space:nowrap;">Use</button>
          </div>
          <div id="dpicker-emoji-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:var(--s2);"></div>
        </div>
        <div data-dpanel="brands" style="display:none;">
          <div id="dpicker-brands-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s3);"></div>
        </div>
        \${isAccount ? '<div data-dpanel="banks" style="display:none;"><div id="dpicker-banks-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s3);"></div></div>' : ''}
      </div>
    </div>
  \`;
  document.body.appendChild(modal);

  modal.querySelector('#settings-picker-close').addEventListener('click', closeSettingsPicker);
  modal.addEventListener('click', e => { if (e.target === modal) closeSettingsPicker(); });

  const setDTab = (tab) => {
    modal.querySelectorAll('[data-dtab]').forEach(b => {
      const active = b.dataset.dtab === tab;
      b.style.borderBottomColor = active ? 'var(--color-accent)' : 'transparent';
      b.style.color = active ? 'var(--fg)' : 'var(--fg-soft)';
    });
    modal.querySelectorAll('[data-dpanel]').forEach(p => {
      p.style.display = p.dataset.dpanel === tab ? 'block' : 'none';
    });
  };
  modal.querySelectorAll('[data-dtab]').forEach(b => {
    b.addEventListener('click', () => setDTab(b.dataset.dtab));
  });

  // Icons grid
  const iconsGrid = modal.querySelector('#dpicker-icons-grid');
  iconsGrid.innerHTML = ICONS_LIB.map(it =>
    \`<button data-iconkey="\${escapeAttr(it.key)}" aria-label="\${escapeAttr(it.name)}" style="aspect-ratio:1;border:1px solid var(--border);background:var(--color-bg-surface-raised);border-radius:var(--r-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--fg);"><span style="width:24px;height:24px;display:inline-flex;">\${it.svg}</span></button>\`
  ).join('');
  iconsGrid.querySelectorAll('[data-iconkey]').forEach(cell => {
    cell.addEventListener('click', () => commitSettingsPicker({ emoji: null, iconUrl: cell.dataset.iconkey }));
  });

  // Emoji grid
  const emojiGrid = modal.querySelector('#dpicker-emoji-grid');
  emojiGrid.innerHTML = SETTINGS_EMOJI_QUICKPICK.map(e =>
    \`<button data-emoji="\${escapeAttr(e)}" style="aspect-ratio:1;border:1px solid var(--border);background:var(--color-bg-surface-raised);border-radius:var(--r-sm);font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;">\${e}</button>\`
  ).join('');
  emojiGrid.querySelectorAll('[data-emoji]').forEach(cell => {
    cell.addEventListener('click', () => commitSettingsPicker({ emoji: cell.dataset.emoji, iconUrl: null }));
  });
  const dEmojiInput = modal.querySelector('#dpicker-emoji-input');
  const dEmojiUse   = modal.querySelector('#dpicker-emoji-use');
  const dTryCommit = () => {
    const v = dEmojiInput.value.trim();
    if (v && v.length <= 8) commitSettingsPicker({ emoji: v, iconUrl: null });
    else showToast('Enter an emoji first');
  };
  dEmojiUse.addEventListener('click', dTryCommit);
  dEmojiInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); dTryCommit(); }
  });

  // Brands grid
  const brandsGrid = modal.querySelector('#dpicker-brands-grid');
  brandsGrid.innerHTML = BRANDS_LIB.map(b =>
    \`<button data-brandkey="\${escapeAttr(b.key)}" aria-label="\${escapeAttr(b.name)}" style="aspect-ratio:1;border:1px solid var(--border);background:transparent;border-radius:var(--r-md);cursor:pointer;overflow:hidden;padding:0;"><span style="display:block;width:100%;height:100%;">\${b.svg}</span></button>\`
  ).join('');
  brandsGrid.querySelectorAll('[data-brandkey]').forEach(cell => {
    cell.addEventListener('click', () => commitSettingsPicker({ emoji: null, iconUrl: cell.dataset.brandkey }));
  });

  // Banks grid (accounts only)
  if (isAccount) {
    const banksGrid = modal.querySelector('#dpicker-banks-grid');
    banksGrid.innerHTML = BANK_LOGOS.map(b =>
      \`<button data-bankkey="\${escapeAttr(b.key)}" aria-label="\${escapeAttr(b.name)}" style="aspect-ratio:1;border:1px solid var(--border);background:transparent;border-radius:var(--r-md);cursor:pointer;overflow:hidden;padding:0;"><span style="display:block;width:100%;height:100%;">\${b.svg}</span></button>\`
    ).join('');
    banksGrid.querySelectorAll('[data-bankkey]').forEach(cell => {
      cell.addEventListener('click', () => commitSettingsPicker({ emoji: null, iconUrl: cell.dataset.bankkey }));
    });
  }

  // Pick the right default tab — brand match wins for non-account
  const upper = (item.name || '').toUpperCase();
  const brandMatch = BRANDS_LIB.find(b => upper.includes(b.name.toUpperCase()));
  let resolvedTab = defaultTab;
  if (!isAccount && brandMatch) resolvedTab = 'brands';
  setDTab(resolvedTab);
}
function closeSettingsPicker() {
  const m = document.getElementById('settings-picker-modal');
  if (m) m.remove();
  settingsPickerCtx = null;
}
async function commitSettingsPicker(payload) {
  if (!settingsPickerCtx) return;
  try {
    const r = await fetch('/api/d1/' + settingsPickerCtx.table + '/' + settingsPickerCtx.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error('save failed');
    invalidateBootstrapCache();
    closeSettingsPicker();
    showToast('Icon updated');
    renderSettings(document.getElementById('content-area'));
  } catch (err) {
    showToast('Couldn\\'t save');
  }
}

function invalidateBootstrapCache() {
  state.bootstrap = null;
  state.txnsByPeriod = {};
}

// ── Right panel ────────────────────────────────────────────────────────────
let allTxns = {};  // id → txn object (cache for detail/edit)

function openPanel() {
  const overlay = document.getElementById('panel-overlay');
  const panel   = document.getElementById('right-panel');
  overlay.classList.add('open');
  panel.classList.add('open');
  requestAnimationFrame(() => { overlay.classList.add('visible'); });
  state.panelOpen = true;
  document.addEventListener('keydown', handlePanelKey);
}

function closePanel() {
  const overlay = document.getElementById('panel-overlay');
  const panel   = document.getElementById('right-panel');
  overlay.classList.remove('visible');
  panel.classList.remove('open');
  setTimeout(() => overlay.classList.remove('open'), 250);
  state.panelOpen = false;
  document.removeEventListener('keydown', handlePanelKey);
}

function handlePanelKey(e) {
  if (e.key === 'Escape') closePanel();
}

document.getElementById('panel-overlay').addEventListener('click', closePanel);

function openPanelAdd(mode = 'expense') {
  state.panelMode = 'add';
  state.panelTxnType = mode;
  state.panelTxn = null;
  renderPanelAdd();
  openPanel();
}

async function openPanelDetail(id) {
  state.panelMode = 'detail';
  // Try to find txn in cached data
  let txn = allTxns[id];
  if (!txn) {
    // Search in all loaded txn lists
    for (const arr of Object.values(state.txnsByPeriod)) {
      const found = arr.find(t => t.id === id);
      if (found) { txn = found; break; }
    }
  }
  state.panelTxn = txn || { id, name: '…', amount: 0, date: '', txnType: 'expense' };
  renderPanelDetail();
  openPanel();
}

function openPanelEdit(id) {
  state.panelMode = 'edit';
  const txn = allTxns[id] || state.panelTxn;
  state.panelTxn = txn;
  renderPanelEdit();
  openPanel();
}

function renderPanelAdd() {
  const header = document.getElementById('panel-header');
  const body   = document.getElementById('panel-body');
  const footer = document.getElementById('panel-footer');

  header.innerHTML = \`
    <div class="panel-mode-tabs">
      \${[['expense','Expense'],['income','Income'],['transfer','Transfer']].map(([v,l]) => \`
        <button class="panel-mode-tab \${state.panelTxnType===v?'active':''}" data-mode="\${v}">\${l}</button>\`).join('')}
    </div>
    <button class="panel-close-btn" id="panel-close">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>\`;

  header.querySelectorAll('.panel-mode-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.panelTxnType = btn.dataset.mode;
      header.querySelectorAll('.panel-mode-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === state.panelTxnType));
      renderPanelAddBody(body);
    });
  });
  document.getElementById('panel-close').addEventListener('click', closePanel);

  renderPanelAddBody(body);

  footer.innerHTML = \`
    <button class="panel-save-btn" id="panel-save">Save</button>
    <button class="panel-cancel-btn" id="panel-cancel">Cancel</button>\`;
  document.getElementById('panel-save').addEventListener('click', saveTransaction);
  document.getElementById('panel-cancel').addEventListener('click', closePanel);
}

function renderPanelAddBody(body) {
  const bs = state.bootstrap || { categories: [], subcategories: [], accounts: [] };
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const curTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const mode  = state.panelTxnType;

  const rankedCats  = rankByRecency(bs.categories    || [], (bs.recent && bs.recent.categories)    || []);
  const rankedAccts = rankByRecency(bs.accounts      || [], (bs.recent && bs.recent.accounts)      || []);
  const rankedSubs  = rankByRecency(bs.subcategories || [], (bs.recent && bs.recent.subcategories) || []);

  if (mode === 'transfer') {
    body.innerHTML = \`
      <div class="form-field">
        <label class="form-label">Amount</label>
        <input type="number" class="form-input amount-input" id="pf-amount" placeholder="0" min="0" step="0.01" inputmode="decimal" autofocus/>
      </div>
      <div class="form-field">
        <label class="form-label">From Account</label>
        <input type="text" class="chip-search-input" placeholder="Search accounts…" autocomplete="off"/>
        <div class="chip-grid" id="pf-from-acct">
          \${rankedAccts.map(a => \`<button class="chip-item" data-id="\${a.id}" data-name="\${a.name}">\${chipIcon(a.icon,'🏦')} \${a.name}</button>\`).join('')}
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">To Account</label>
        <input type="text" class="chip-search-input" placeholder="Search accounts…" autocomplete="off"/>
        <div class="chip-grid" id="pf-to-acct">
          \${rankedAccts.map(a => \`<button class="chip-item" data-id="\${a.id}" data-name="\${a.name}">\${chipIcon(a.icon,'🏦')} \${a.name}</button>\`).join('')}
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Note</label>
        <input type="text" class="form-input" id="pf-note" placeholder="Optional"/>
      </div>
      <div class="form-field">
        <label class="form-label">Date &amp; Time</label>
        <div class="date-time-row">
          <input type="date" class="form-input" id="pf-date" value="\${today}"/>
          <input type="time" class="form-input" id="pf-time" value="\${curTime}"/>
        </div>
      </div>\`;
  } else if (mode === 'income') {
    body.innerHTML = \`
      <div class="form-field">
        <label class="form-label">Amount</label>
        <input type="number" class="form-input amount-input" id="pf-amount" placeholder="0" min="0" step="0.01" inputmode="decimal" autofocus/>
      </div>
      <div class="form-field">
        <label class="form-label">Source / Note</label>
        <input type="text" class="form-input" id="pf-note" placeholder="e.g. Salary, Freelance"/>
      </div>
      <div class="form-field">
        <label class="form-label">Category</label>
        <input type="text" class="chip-search-input" placeholder="Search categories…" autocomplete="off"/>
        <div class="chip-grid" id="pf-category">
          \${rankedCats.map(c => \`<button class="chip-item" data-id="\${c.id}" data-name="\${c.name}">\${chipIcon(c.icon,'📁')} \${c.name}</button>\`).join('')}
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Account</label>
        <input type="text" class="chip-search-input" placeholder="Search accounts…" autocomplete="off"/>
        <div class="chip-grid" id="pf-account">
          \${rankedAccts.map(a => \`<button class="chip-item" data-id="\${a.id}" data-name="\${a.name}">\${chipIcon(a.icon,'🏦')} \${a.name}</button>\`).join('')}
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Date &amp; Time</label>
        <div class="date-time-row">
          <input type="date" class="form-input" id="pf-date" value="\${today}"/>
          <input type="time" class="form-input" id="pf-time" value="\${curTime}"/>
        </div>
      </div>\`;
  } else {
    body.innerHTML = \`
      <div class="form-field">
        <label class="form-label">Amount</label>
        <input type="number" class="form-input amount-input" id="pf-amount" placeholder="0" min="0" step="0.01" inputmode="decimal" autofocus/>
      </div>
      <div class="form-field">
        <label class="form-label">Category</label>
        <input type="text" class="chip-search-input" placeholder="Search categories…" autocomplete="off"/>
        <div class="chip-grid" id="pf-category">
          \${rankedCats.map(c => \`<button class="chip-item" data-id="\${c.id}" data-name="\${c.name}">\${chipIcon(c.icon,'📁')} \${c.name}</button>\`).join('')}
        </div>
      </div>
      <div class="form-field" id="pf-subcat-field">
        <label class="form-label">Subcategory</label>
        <input type="text" class="chip-search-input" placeholder="Search subcategories…" autocomplete="off"/>
        <div class="chip-grid" id="pf-subcategory"></div>
      </div>
      <div class="form-field">
        <label class="form-label">Account</label>
        <input type="text" class="chip-search-input" placeholder="Search accounts…" autocomplete="off"/>
        <div class="chip-grid" id="pf-account">
          \${rankedAccts.map(a => \`<button class="chip-item" data-id="\${a.id}" data-name="\${a.name}">\${chipIcon(a.icon,'🏦')} \${a.name}</button>\`).join('')}
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Note</label>
        <input type="text" class="form-input" id="pf-note" placeholder="Optional"/>
      </div>
      <div class="form-field">
        <label class="form-label">Date &amp; Time</label>
        <div class="date-time-row">
          <input type="date" class="form-input" id="pf-date" value="\${today}"/>
          <input type="time" class="form-input" id="pf-time" value="\${curTime}"/>
        </div>
      </div>\`;
  }

  // Populate subcategory grid
  const subGrid = body.querySelector('#pf-subcategory');
  if (subGrid) {
    subGrid.innerHTML = rankedSubs.length
      ? rankedSubs.map(s => \`<button class="chip-item" data-id="\${s.id}" data-name="\${s.name}">\${chipIcon(s.icon,'📂')} \${s.name}</button>\`).join('')
      : '<span style="color:var(--fg-soft);font-size:var(--text-sm)">No subcategories</span>';
  }

  // Wire chip single-select
  body.querySelectorAll('.chip-grid').forEach(grid => {
    grid.querySelectorAll('.chip-item').forEach(chip => {
      chip.addEventListener('click', () => {
        grid.querySelectorAll('.chip-item').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });
  });

  // Wire chip search inputs (after grids populated)
  body.querySelectorAll('.chip-search-input').forEach(search => {
    const grid = search.nextElementSibling;
    if (!grid || !grid.classList.contains('chip-grid')) return;
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      grid.querySelectorAll('.chip-item').forEach(chip => {
        chip.style.display = q && !chip.dataset.name.toLowerCase().includes(q) ? 'none' : '';
      });
    });
  });

  // Focus amount
  const amtInput = document.getElementById('pf-amount');
  if (amtInput) setTimeout(() => amtInput.focus(), 50);
}

async function saveTransaction() {
  const btn = document.getElementById('panel-save');
  if (btn) btn.disabled = true;
  let txnBody = null;
  try {
    const amount = parseFloat(document.getElementById('pf-amount')?.value || '0');
    if (!amount || isNaN(amount)) { showToast('Enter an amount', 'error'); return; }
    const note    = document.getElementById('pf-note')?.value?.trim() || '';
    const dateVal = document.getElementById('pf-date')?.value || new Date().toISOString().split('T')[0];
    const timeVal = document.getElementById('pf-time')?.value || '';
    const date    = buildDateTime(dateVal, timeVal);
    const mode    = state.panelTxnType;

    txnBody = { amount, note, date, txnType: mode };

    if (mode === 'transfer') {
      const fromChip = document.getElementById('pf-from-acct')?.querySelector('.chip-item.selected');
      const toChip   = document.getElementById('pf-to-acct')?.querySelector('.chip-item.selected');
      if (!fromChip || !toChip) { showToast('Select From and To accounts', 'error'); return; }
      txnBody.fromAccountId = fromChip.dataset.id;
      txnBody.toAccountId   = toChip.dataset.id;
    } else if (mode === 'income') {
      const catChip  = document.getElementById('pf-category')?.querySelector('.chip-item.selected');
      const acctChip = document.getElementById('pf-account')?.querySelector('.chip-item.selected');
      if (catChip)  txnBody.categoryId = catChip.dataset.id;
      if (acctChip) txnBody.accountId  = acctChip.dataset.id;
    } else {
      const catChip  = document.getElementById('pf-category')?.querySelector('.chip-item.selected');
      const subChip  = document.getElementById('pf-subcategory')?.querySelector('.chip-item.selected');
      const acctChip = document.getElementById('pf-account')?.querySelector('.chip-item.selected');
      if (catChip)  txnBody.categoryId    = catChip.dataset.id;
      if (subChip)  txnBody.subcategoryId = subChip.dataset.id;
      if (acctChip) txnBody.accountId     = acctChip.dataset.id;
    }

    if (!navigator.onLine) throw new TypeError('offline');

    const r = await fetch('/api/d1/expense', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(txnBody) });
    if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Save failed'); }

    closePanel();
    showToast('Transaction saved', 'success');
    state.txnsByPeriod = {};
    state.summaryByPeriod = {};
    renderView();
  } catch(err) {
    if (txnBody && (err instanceof TypeError || !navigator.onLine)) {
      queueOfflineTxn(txnBody);
      closePanel();
      showToast('Saved offline — will sync when back online', 'success');
    } else {
      showToast(err.message, 'error');
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

function renderPanelDetail() {
  const t = state.panelTxn;
  if (!t) return;
  const header = document.getElementById('panel-header');
  const body   = document.getElementById('panel-body');
  const footer = document.getElementById('panel-footer');

  header.innerHTML = \`
    <span style="font-size:var(--text-sm);font-weight:600;color:var(--fg-soft)">Transaction</span>
    <button class="panel-close-btn" id="panel-close">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>\`;
  document.getElementById('panel-close').addEventListener('click', closePanel);

  body.innerHTML = \`
    <div class="detail-actions">
      <button class="detail-edit-btn" id="detail-edit">Edit</button>
      <button class="detail-delete-btn" id="detail-delete">Delete</button>
    </div>
    <div class="detail-field">
      <div class="detail-label">Amount</div>
      <div class="detail-amount \${t.txnType==='income'?'income':'expense'}">
        \${t.txnType==='income'?'+':'−'}\${fmtAmt(t.amount)}
      </div>
    </div>
    <div class="detail-field">
      <div class="detail-label">Note</div>
      <div class="detail-value">\${t.name || '—'}</div>
    </div>
    \${t.category    ? \`<div class="detail-field"><div class="detail-label">Category</div><div class="detail-value">\${t.category}</div></div>\` : ''}
    \${t.subcategory ? \`<div class="detail-field"><div class="detail-label">Subcategory</div><div class="detail-value">\${t.subcategory}</div></div>\` : ''}
    \${t.account     ? \`<div class="detail-field"><div class="detail-label">Account</div><div class="detail-value">\${t.account}</div></div>\` : ''}
    <div class="detail-field">
      <div class="detail-label">Date</div>
      <div class="detail-value">\${fmtDate(t.date)}</div>
    </div>
    <div class="detail-field">
      <div class="detail-label">Type</div>
      <div class="detail-value" style="text-transform:capitalize">\${t.txnType}</div>
    </div>\`;

  document.getElementById('detail-edit').addEventListener('click', () => {
    state.panelMode = 'edit';
    renderPanelEdit();
  });
  document.getElementById('detail-delete').addEventListener('click', async () => {
    if (!confirm('Delete this transaction?')) return;
    try {
      const r = await fetch(\`/api/d1/expense/\${t.id}?type=\${t.txnType}\`, { method:'DELETE' });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error||'Delete failed'); }
      closePanel();
      showToast('Transaction deleted', 'success');
      state.txnsByPeriod = {};
      state.summaryByPeriod = {};
      renderView();
    } catch(err) { showToast(err.message, 'error'); }
  });

  footer.innerHTML = '';
}

function renderPanelEdit() {
  const t = state.panelTxn;
  if (!t) return;
  const header = document.getElementById('panel-header');
  const body   = document.getElementById('panel-body');
  const footer = document.getElementById('panel-footer');

  header.innerHTML = \`
    <span style="font-size:var(--text-sm);font-weight:600;color:var(--fg-soft)">Edit Transaction</span>
    <button class="panel-close-btn" id="panel-close">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>\`;
  document.getElementById('panel-close').addEventListener('click', closePanel);

  const bs = state.bootstrap || { categories: [], subcategories: [], accounts: [] };
  const isExpense = (t.txnType || 'expense') === 'expense';
  const existingTime = t.date && t.date.includes('T') ? t.date.substring(11, 16) : '';
  const rankedCats  = rankByRecency(bs.categories   || [], (bs.recent && bs.recent.categories)    || []);
  const rankedAccts = rankByRecency(bs.accounts     || [], (bs.recent && bs.recent.accounts)      || []);
  const rankedSubs  = rankByRecency(bs.subcategories || [], (bs.recent && bs.recent.subcategories) || []);

  body.innerHTML = \`
    <div class="form-field">
      <label class="form-label">Amount</label>
      <input type="number" class="form-input amount-input" id="pf-amount" value="\${t.amount}" min="0" step="0.01"/>
    </div>
    <div class="form-field">
      <label class="form-label">Category</label>
      <input type="text" class="chip-search-input" placeholder="Search categories…" autocomplete="off"/>
      <div class="chip-grid" id="pf-category">
        \${rankedCats.map(c => \`<button class="chip-item \${c.id===t.categoryId?'selected':''}" data-id="\${c.id}" data-name="\${c.name}">\${chipIcon(c.icon,'📁')} \${c.name}</button>\`).join('')}
      </div>
    </div>
    \${isExpense ? \`<div class="form-field">
      <label class="form-label">Subcategory</label>
      <input type="text" class="chip-search-input" placeholder="Search subcategories…" autocomplete="off"/>
      <div class="chip-grid" id="pf-subcategory"></div>
    </div>\` : ''}
    <div class="form-field">
      <label class="form-label">Account</label>
      <input type="text" class="chip-search-input" placeholder="Search accounts…" autocomplete="off"/>
      <div class="chip-grid" id="pf-account">
        \${rankedAccts.map(a => \`<button class="chip-item \${a.id===t.accountId?'selected':''}" data-id="\${a.id}" data-name="\${a.name}">\${chipIcon(a.icon,'🏦')} \${a.name}</button>\`).join('')}
      </div>
    </div>
    <div class="form-field">
      <label class="form-label">Note</label>
      <input type="text" class="form-input" id="pf-note" value="\${t.name||''}"/>
    </div>
    <div class="form-field">
      <label class="form-label">Date &amp; Time</label>
      <div class="date-time-row">
        <input type="date" class="form-input" id="pf-date" value="\${(t.date||'').split('T')[0]}"/>
        <input type="time" class="form-input" id="pf-time" value="\${existingTime}"/>
      </div>
    </div>\`;

  // Populate subcategory grid
  const subGridEdit = body.querySelector('#pf-subcategory');
  if (isExpense && subGridEdit) {
    subGridEdit.innerHTML = rankedSubs.length
      ? rankedSubs.map(s => \`<button class="chip-item \${s.id===t.subcategoryId?'selected':''}" data-id="\${s.id}" data-name="\${s.name}">\${chipIcon(s.icon,'📂')} \${s.name}</button>\`).join('')
      : '<span style="color:var(--fg-soft);font-size:var(--text-sm)">No subcategories</span>';
  }

  // Wire chip single-select
  body.querySelectorAll('.chip-grid').forEach(grid => {
    grid.querySelectorAll('.chip-item').forEach(chip => {
      chip.addEventListener('click', () => {
        grid.querySelectorAll('.chip-item').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });
  });

  // Wire chip search inputs
  body.querySelectorAll('.chip-search-input').forEach(search => {
    const grid = search.nextElementSibling;
    if (!grid || !grid.classList.contains('chip-grid')) return;
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      grid.querySelectorAll('.chip-item').forEach(chip => {
        chip.style.display = q && !chip.dataset.name.toLowerCase().includes(q) ? 'none' : '';
      });
    });
  });

  footer.innerHTML = \`
    <button class="panel-save-btn" id="panel-save">Save Changes</button>
    <button class="panel-cancel-btn" id="panel-cancel">Cancel</button>\`;

  document.getElementById('panel-save').addEventListener('click', async () => {
    const btn = document.getElementById('panel-save');
    if (btn) btn.disabled = true;
    try {
      const amount  = parseFloat(document.getElementById('pf-amount')?.value || '0');
      if (!amount || isNaN(amount)) { showToast('Enter an amount', 'error'); return; }
      const note     = document.getElementById('pf-note')?.value?.trim() || '';
      const dateVal  = document.getElementById('pf-date')?.value || (t.date || '').split('T')[0];
      const timeVal  = document.getElementById('pf-time')?.value || '';
      const date     = buildDateTime(dateVal, timeVal);
      const catChip  = document.getElementById('pf-category')?.querySelector('.chip-item.selected');
      const subChip  = document.getElementById('pf-subcategory')?.querySelector('.chip-item.selected');
      const acctChip = document.getElementById('pf-account')?.querySelector('.chip-item.selected');
      const body = {
        amount, note, date, txnType: t.txnType,
        categoryId:    catChip?.dataset.id  || t.categoryId    || '',
        subcategoryId: subChip?.dataset.id  || (t.txnType === 'income' ? '' : ''),
        accountId:     acctChip?.dataset.id || t.accountId     || '',
      };
      const r = await fetch(\`/api/d1/expense/\${t.id}\`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error||'Update failed'); }
      showToast('Transaction updated', 'success');
      state.txnsByPeriod = {};
      state.summaryByPeriod = {};
      state.panelTxn = { ...t, amount, name: note, date, categoryId: body.categoryId, accountId: body.accountId };
      state.panelMode = 'detail';
      renderPanelDetail();
      renderView();
    } catch(err) { showToast(err.message, 'error'); }
    finally { if (btn) btn.disabled = false; }
  });
  document.getElementById('panel-cancel').addEventListener('click', () => {
    state.panelMode = 'detail';
    renderPanelDetail();
  });
}

// ── Command palette ────────────────────────────────────────────────────────
function openPalette() {
  const bd = document.getElementById('palette-backdrop');
  bd.classList.add('open');
  requestAnimationFrame(() => bd.classList.add('visible'));
  document.getElementById('palette-input').focus();
  state.paletteOpen = true;
  state.paletteFocus = -1;
  document.getElementById('palette-results').innerHTML = '';
  document.getElementById('palette-count').textContent = '';
  document.addEventListener('keydown', handlePaletteKey);
}

function closePalette() {
  const bd = document.getElementById('palette-backdrop');
  bd.classList.remove('visible');
  setTimeout(() => bd.classList.remove('open'), 150);
  state.paletteOpen = false;
  document.getElementById('palette-input').value = '';
  document.removeEventListener('keydown', handlePaletteKey);
}

function handlePaletteKey(e) {
  if (e.key === 'Escape') { closePalette(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); movePaletteFocus(1); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); movePaletteFocus(-1); }
  if (e.key === 'Enter') {
    const items = document.querySelectorAll('.palette-result');
    if (state.paletteFocus >= 0 && items[state.paletteFocus]) items[state.paletteFocus].click();
  }
}

function movePaletteFocus(dir) {
  const items = document.querySelectorAll('.palette-result');
  items.forEach(i => i.classList.remove('focused'));
  state.paletteFocus = Math.max(-1, Math.min(items.length - 1, state.paletteFocus + dir));
  if (state.paletteFocus >= 0) items[state.paletteFocus]?.classList.add('focused');
}

document.getElementById('palette-backdrop').addEventListener('click', (e) => {
  if (e.target === document.getElementById('palette-backdrop')) closePalette();
});

let paletteDebounce;
document.getElementById('palette-input').addEventListener('input', (e) => {
  clearTimeout(paletteDebounce);
  paletteDebounce = setTimeout(async () => {
    const q = e.target.value.trim();
    const resultsEl = document.getElementById('palette-results');
    const countEl   = document.getElementById('palette-count');
    if (!q) { resultsEl.innerHTML = ''; countEl.textContent = ''; return; }
    resultsEl.innerHTML = '<div class="palette-empty">Searching…</div>';
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const d = await apiFetch(\`/api/d1/expenses?q=\${encodeURIComponent(q)}&timeZone=\${encodeURIComponent(tz)}\`);
      const txns = d.expenses || [];
      state.paletteResults = txns;
      if (!txns.length) {
        resultsEl.innerHTML = '<div class="palette-empty">No results</div>';
        countEl.textContent = '';
        return;
      }
      resultsEl.innerHTML = txns.slice(0,12).map((t,i) => \`
        <div class="palette-result" data-idx="\${i}" data-id="\${t.id}" role="option">
          <div class="palette-result-name">\${t.name||'—'}</div>
          <div class="palette-result-meta">\${fmtDate(t.date)} · \${t.category||t.account||''}</div>
          <div class="palette-result-amount \${t.txnType==='income'?'income':'expense'}">
            \${t.txnType==='income'?'+':'−'}\${fmtAmt(t.amount)}
          </div>
        </div>\`).join('');
      countEl.textContent = txns.length > 12 ? \`Showing 12 of \${txns.length} results\` : \`\${txns.length} result\${txns.length===1?'':'s'}\`;
      resultsEl.querySelectorAll('.palette-result').forEach(el => {
        el.addEventListener('click', () => {
          const txn = state.paletteResults[Number(el.dataset.idx)];
          if (txn) { allTxns[txn.id] = txn; }
          closePalette();
          openPanelDetail(el.dataset.id);
        });
      });
      state.paletteFocus = -1;
    } catch { resultsEl.innerHTML = '<div class="palette-empty">Error searching</div>'; }
  }, 200);
});

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const stack = document.getElementById('toast-stack');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  stack.appendChild(el);
  el.addEventListener('click', () => el.remove());
  setTimeout(() => el.remove(), 3500);
}

// ── Keyboard shortcuts ─────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input,textarea,select')) return;
  if (state.paletteOpen || state.panelOpen) return;

  if (e.key === 'n' || e.key === 'N') {
    e.preventDefault();
    loadBootstrap().then(() => openPanelAdd('expense'));
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openPalette();
  }
  if (e.key === '/') {
    e.preventDefault();
    navigate('search');
  }
});

// Cmd+K from anywhere (including when in input, except palette input)
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !state.paletteOpen) {
    e.preventDefault();
    openPalette();
  }
}, true);

// ── Sidebar wiring ─────────────────────────────────────────────────────────
document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.view));
});

document.getElementById('sidebar-add-btn').addEventListener('click', () => {
  loadBootstrap().then(() => openPanelAdd('expense'));
});

function openAddPanelForType(mode) {
  loadBootstrap().then(() => openPanelAdd(mode));
}

// Theme toggle
const savedTheme = localStorage.getItem('ne-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

document.getElementById('theme-toggle-btn').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ne-theme', next);
  document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#111111' : '#f5f5f5';
});

// Sidebar collapse on 1024–1279px
function updateSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed', window.innerWidth < 1280 && window.innerWidth >= 768);
}
window.addEventListener('resize', updateSidebarCollapse);
updateSidebarCollapse();

// ── Init ──────────────────────────────────────────────────────────────────
window.addEventListener('online', () => syncPendingTxns().catch(() => {}));

(async function init() {
  // Sync any offline-queued transactions
  syncPendingTxns().catch(() => {});

  // Load bootstrap in background
  loadBootstrap().catch(() => {});

  // Parse initial route
  const { view, params } = parseHash();
  applyRoute(view, params);

  // Default to overview if no hash
  if (!location.hash) navigate('overview');
})();
</script>
</body>
</html>`;
