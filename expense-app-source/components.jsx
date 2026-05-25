// Shared glass components, helpers, formatters, background variants.
const { useState, useEffect, useMemo, useRef } = React;

// ── Color helpers ──────────────────────────────────────────────────────
function hexToRgbTriplet(hex) {
  if (!hex) return '252, 97, 141';
  const m = hex.replace('#', '');
  const h = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  const r = parseInt(h.slice(0,2), 16);
  const g = parseInt(h.slice(2,4), 16);
  const b = parseInt(h.slice(4,6), 16);
  if ([r,g,b].some(v => isNaN(v))) return '252, 97, 141';
  return `${r}, ${g}, ${b}`;
}

// ── Currency formatter (INR Indian grouping) ───────────────────────────
function fmtINR(n, { withSym = true, withFrac = true } = {}) {
  const sign = n < 0 ? '-' : '';
  const abs  = Math.abs(n);
  const whole = Math.floor(abs);
  const frac  = Math.round((abs - whole) * 100);
  // Indian grouping: 1,23,45,678
  const wholeStr = whole.toString();
  let result;
  if (wholeStr.length <= 3) result = wholeStr;
  else {
    const last3 = wholeStr.slice(-3);
    const rest  = wholeStr.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = grouped + ',' + last3;
  }
  const sym = withSym ? '₹' : '';
  if (!withFrac) return sign + sym + result;
  return sign + sym + result + '.' + String(frac).padStart(2, '0');
}

// formatINR returning {sign, sym, whole, frac} for styled rendering
function fmtParts(n) {
  const sign = n < 0 ? '−' : '';
  const formatted = fmtINR(Math.abs(n), { withSym: false, withFrac: true });
  const [whole, frac] = formatted.split('.');
  return { sign, sym: '₹', whole, frac };
}

// ── Date helpers ───────────────────────────────────────────────────────
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayLabel(d) {
  const today = new Date();
  const yest = new Date(); yest.setDate(today.getDate() - 1);
  if (isSameDay(d, today)) return 'Today';
  if (isSameDay(d, yest))  return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
function timeLabel(d) {
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
}

// ── Period filtering ───────────────────────────────────────────────────
function filterByPeriod(txns, period) {
  const now = new Date();
  return txns.filter(t => {
    const d = new Date(t.date);
    if (period === 'today') return isSameDay(d, now);
    if (period === 'week')  { const w = new Date(); w.setDate(now.getDate() - 7); return d >= w; }
    if (period === 'month') { const m = new Date(); m.setDate(now.getDate() - 30); return d >= m; }
    return true;
  });
}

// ── Aggregations ───────────────────────────────────────────────────────
function summarize(txns) {
  let income = 0, expense = 0;
  for (const t of txns) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

function groupByDay(txns) {
  const m = new Map();
  for (const t of [...txns].sort((a, b) => new Date(b.date) - new Date(a.date))) {
    const d = new Date(t.date);
    const key = d.toDateString();
    if (!m.has(key)) m.set(key, { date: d, items: [], net: 0 });
    const g = m.get(key);
    g.items.push(t);
    g.net += (t.type === 'income' ? t.amount : -t.amount);
  }
  return [...m.values()];
}

// ── Background variants ────────────────────────────────────────────────
function Background({ kind }) {
  if (kind === 'mesh') {
    // Single-hue mesh — handled entirely via .bg-mesh CSS
    return <div className="bg-layer bg-mesh"></div>;
  }
  if (kind === 'aurora') {
    return (
      <div className="bg-layer bg-aurora">
        <div className="band band-1"></div>
        <div className="band band-2"></div>
        <div className="band band-3"></div>
      </div>
    );
  }
  // default — orbs
  return (
    <div className="bg-layer bg-orbs">
      <div className="orb orb-1"></div>
      <div className="orb orb-spec"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );
}

// ── Glass card wrapper ─────────────────────────────────────────────────
function GlassCard({ className = '', children, style, onClick }) {
  return (
    <div className={`glass ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

// ── Period segmented pill ──────────────────────────────────────────────
function PeriodTabs({ value, onChange }) {
  const opts = [['today','Today'], ['week','Week'], ['month','Month']];
  return (
    <div className="period-pill">
      {opts.map(([v, label]) => (
        <button key={v} className={value === v ? 'active' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Type tabs (All / Income / Expense) ────────────────────────────────
function TypeTabs({ value, onChange }) {
  const opts = [['all','All'], ['income','Income'], ['expense','Expense']];
  return (
    <div className="type-tabs">
      {opts.map(([v, l]) => (
        <button key={v} className={value === v ? 'active' : ''} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );
}

// ── Account chip lookup ───────────────────────────────────────────────
// Small round badge before the txn arrow — shows the bank logo if available,
// otherwise short initials on a tonal pill.
const ACCOUNT_HUES = ['200', '320', '40', '160', '280', '100', '0'];
function accountKey(name) {
  if (!name) return '';
  return name.toLowerCase().split(' ')[0]; // "ICICI Credit" → "icici"
}
function accountLogo(name) {
  const k = accountKey(name);
  const lib = window.BANK_LOGOS || [];
  return (lib.find(b => b.key === 'bank:' + k) || null);
}
function accountInitials(name) {
  if (!name) return '?';
  const w = name.split(' ').filter(Boolean);
  if (w.length === 1) return w[0].slice(0, 2).toUpperCase();
  return (w[0][0] + (w[1][0] || '')).toUpperCase();
}
function AccountBadge({ account, size = 26 }) {
  const logo = accountLogo(account);
  if (logo) {
    return (
      <span style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        flexShrink: 0, display:'inline-flex', alignItems:'center', justifyContent:'center',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
      }}
      dangerouslySetInnerHTML={{ __html: logo.svg.replace('<svg ', `<svg width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice" `) }}
      />
    );
  }
  // initials fallback — hue derived from name so each account gets a stable color
  const hue = ACCOUNT_HUES[(accountKey(account).charCodeAt(0) || 0) % ACCOUNT_HUES.length];
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      background: `hsl(${hue} 30% 22%)`,
      color: `hsl(${hue} 60% 80%)`,
      fontSize: 9, fontWeight: 700, letterSpacing: '0.02em',
      fontFamily: 'var(--font-display)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06)',
    }}>{accountInitials(account)}</span>
  );
}

// ── Transaction row ───────────────────────────────────────────────────
function TxnIcon({ icon, size }) {
  if (!size) size = 36;
  if (!icon) return <div className="ic" style={{width:size,height:size}}></div>;
  if (icon.startsWith('<svg')) {
    return <div className="ic" style={{width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}
      dangerouslySetInnerHTML={{__html: icon.replace('<svg ', '<svg width="' + (size-10) + '" height="' + (size-10) + '" ')}} />;
  }
  return <div className="ic">{icon}</div>;
}

const SUB_HUES = [340, 280, 200, 160, 50, 20, 130, 260];
function SubBadge({ icon, name, size = 20 }) {
  if (icon && icon.startsWith('<svg')) {
    return (
      <span style={{width:size,height:size,borderRadius:'50%',overflow:'hidden',flexShrink:0,
        display:'inline-flex',alignItems:'center',justifyContent:'center',
        background:'var(--glass-fill-strong)'}}
        dangerouslySetInnerHTML={{__html: icon.replace('<svg ', `<svg width="${size-4}" height="${size-4}" `)}}
      />
    );
  }
  const hue = SUB_HUES[((name || '').charCodeAt(0) || 0) % SUB_HUES.length];
  return (
    <span style={{width:size,height:size,borderRadius:'50%',flexShrink:0,
      display:'inline-flex',alignItems:'center',justifyContent:'center',
      background:`hsl(${hue} 35% 22%)`,color:`hsl(${hue} 60% 80%)`,
      fontSize:8,fontWeight:700,letterSpacing:'0.02em',fontFamily:'var(--font-display)',
      boxShadow:'inset 0 1px 0 rgba(255,255,255,0.10)',
    }}>{(name||'?').slice(0,1).toUpperCase()}</span>
  );
}

function TxnRow({ t, onClick }) {
  const isIn = t.type === 'income';
  const d = new Date(t.date);
  // Footer: show sub if present, else fall back to category
  const footerLeft = t.sub
    ? { icon: t.subIcon, name: t.sub, isSub: true }
    : t.category
      ? { icon: t.icon, name: t.category, isSub: false }
      : null;
  return (
    <div className={`txn ${isIn ? 'income' : 'expense'}`} onClick={onClick}>
      <div className="txn-top">
        <div className="txn-name-col">
          <div className={`txn-name ${isIn ? 'income' : ''}`}>{t.name}</div>
          <div className="txn-subtime">{dayLabel(d)} · {timeLabel(d)}</div>
        </div>
        <div className={`txn-amt ${isIn ? 'income' : 'expense'}`}>
          {isIn ? '+' : '−'}{fmtINR(t.amount, { withFrac: false })}
        </div>
      </div>
      <div className="txn-divider" />
      <div className="txn-foot">
        {footerLeft && (
          <span className="txn-foot-item">
            <SubBadge icon={footerLeft.icon} name={footerLeft.name} size={20} />
            <span className="txn-foot-label">{footerLeft.name}</span>
          </span>
        )}
        {footerLeft && t.account && <span className="txn-foot-sep">·</span>}
        {t.account && (
          <span className="txn-foot-item">
            <AccountBadge account={t.account} size={20} />
            <span className="txn-foot-label">{t.account}</span>
          </span>
        )}
      </div>
    </div>
  );
}

// ── Day header ────────────────────────────────────────────────────────
function DayHead({ d, net }) {
  return (
    <div className="day-head">
      <span>{dayLabel(d)}</span>
      <span className="net">Net {net >= 0 ? '+' : '−'}{fmtINR(Math.abs(net), { withFrac: false })}</span>
    </div>
  );
}

Object.assign(window, {
  hexToRgbTriplet,
  fmtINR, fmtParts, isSameDay, dayLabel, timeLabel,
  filterByPeriod, summarize, groupByDay,
  Background, GlassCard, PeriodTabs, TypeTabs, TxnRow, TxnIcon, SubBadge, DayHead, AccountBadge,
  ThemeToggle,
});

// ── Theme toggle CTA ──────────────────────────────────────────────────
// A round glass icon button that swaps light/dark. Used in topbar / screen-head.
function ThemeToggle({ theme, onToggle, size = 40 }) {
  const isDark = theme !== 'light';
  return (
    <div
      className="icon-btn theme-toggle"
      onClick={onToggle}
      role="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      style={{ width: size, height: size }}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={Math.round(size * 0.45)} />
    </div>
  );
}
