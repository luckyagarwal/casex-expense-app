// All 5 screens for the glass expense app.
const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS, useRef: useRefS } = React;

/* ──────────────────────────────────────────────────────────────────────
   HOME
   ────────────────────────────────────────────────────────────────────── */
function HomeScreen({ txns, period, setPeriod, onOpenAdd, onGoto, theme, onToggleTheme, onEdit }) {
  const scoped = useMemoS(() => filterByPeriod(txns, period), [txns, period]);
  const sum = useMemoS(() => summarize(scoped), [scoped]);
  const recent = useMemoS(() =>
  [...txns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
  [txns]
  );
  const { sign, sym, whole, frac } = fmtParts(sum.net);

  return (
    <div className="screen-enter">
      <div className="topbar">
        <div className="brand-mark">CASEX</div>
        <div className="right-icons">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <div className="icon-btn" onClick={() => onGoto('appearance')} title="Appearance"><Icon name="palette" size={18} /></div>
          <div className="icon-btn" onClick={() => onGoto('manage')} title="Manage categories &amp; accounts"><Icon name="settings" size={18} /></div>
        </div>
      </div>

      <div className="screen-scroll">
        {/* Hero balance card */}
        <GlassCard className="hero">
          <div className="pill-tag">Net · {period === 'today' ? 'Today' : period === 'week' ? 'This week' : 'This month'}</div>
          <div className="label">Balance</div>
          <div className="balance">
            {sign && <span className="sym">{sign}</span>}
            <span className="sym">{sym}</span>
            <span>{whole}</span>
            <span className="frac">.{frac}</span>
          </div>
        </GlassCard>

        {/* Period switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <PeriodTabs value={period} onChange={setPeriod} />
        </div>

        {/* Income / Expense split */}
        <div className="stat-row">
          <GlassCard className="stat-card in" onClick={() => onGoto('transactions', { typeFilter: 'income' })}>
            <div className="lbl">Income</div>
            <div className="val">+{fmtINR(sum.income, { withFrac: false })}</div>
            <div className="delta up"><Icon name="arrow-down-left" size={10} /> {scoped.filter((t) => t.type === 'income').length} entries</div>
          </GlassCard>
          <GlassCard className="stat-card out" onClick={() => onGoto('transactions', { typeFilter: 'expense' })}>
            <div className="lbl">Expense</div>
            <div className="val">−{fmtINR(sum.expense, { withFrac: false })}</div>
            <div className="delta down"><Icon name="arrow-up-right" size={10} /> {scoped.filter((t) => t.type === 'expense').length} entries</div>
          </GlassCard>
        </div>

        {/* Recent transactions */}
        <div className="section-head">
          <div className="title">Recent</div>
          <div className="see-all" onClick={() => onGoto('transactions')}>See all <Icon name="chevron-right" size={12} /></div>
        </div>
        <div className="txn-list">
          {recent.map((t) => <TxnRow key={t.id} t={t} onClick={onEdit ? () => onEdit(t) : undefined} />)}
        </div>
      </div>
    </div>);

}

/* ──────────────────────────────────────────────────────────────────────
   TRANSACTIONS
   ────────────────────────────────────────────────────────────────────── */
function TransactionsScreen({ txns, period, setPeriod, typeFilter, setTypeFilter, theme, onToggleTheme, onEdit }) {
  const scoped = useMemoS(() => filterByPeriod(txns, period), [txns, period]);
  const filtered = useMemoS(() => typeFilter === 'all' ? scoped : scoped.filter((t) => t.type === typeFilter), [scoped, typeFilter]);
  const groups = useMemoS(() => groupByDay(filtered), [filtered]);
  const sum = useMemoS(() => summarize(filtered), [filtered]);

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h1>Transactions</h1>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} size={38} />
      </div>

      <div className="screen-scroll" style={{ paddingTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <PeriodTabs value={period} onChange={setPeriod} />
        </div>

        <TypeTabs value={typeFilter} onChange={setTypeFilter} />

        <GlassCard style={{ padding: '14px 18px', margin: '14px 0 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {typeFilter === 'all' ? 'Net flow' : typeFilter === 'income' ? 'Total income' : 'Total spent'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', marginTop: 6, color: typeFilter === 'income' ? 'var(--income)' : 'var(--text-1)' }}>
              {typeFilter === 'income' ? '+' : typeFilter === 'expense' ? '−' : sum.net >= 0 ? '+' : '−'}
              {fmtINR(typeFilter === 'income' ? sum.income : typeFilter === 'expense' ? sum.expense : Math.abs(sum.net), { withFrac: false })}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Entries</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, marginTop: 6 }}>{filtered.length}</div>
          </div>
        </GlassCard>

        {filtered.length === 0 &&
        <div className="empty">
            <div className="ic">∅</div>
            No transactions in this view.
          </div>
        }

        {groups.map((g, i) =>
        <div key={i}>
            <DayHead d={g.date} net={g.net} />
            <div className="txn-list">
              {g.items.map((t) => <TxnRow key={t.id} t={t} onClick={onEdit ? () => onEdit(t) : undefined} />)}
            </div>
          </div>
        )}
      </div>
    </div>);

}

/* ──────────────────────────────────────────────────────────────────────
   ANALYTICS
   ────────────────────────────────────────────────────────────────────── */
function AnalyticsScreen({ txns, period, setPeriod, theme, onToggleTheme }) {
  const scoped = useMemoS(() => filterByPeriod(txns, period), [txns, period]);
  const sum = useMemoS(() => summarize(scoped), [scoped]);

  // category breakdown for expenses
  const catBreakdown = useMemoS(() => {
    const m = new Map();
    scoped.filter((t) => t.type === 'expense').forEach((t) => {
      if (!m.has(t.category)) m.set(t.category, { name: t.category, total: 0, icon: t.icon });
      m.get(t.category).total += t.amount;
    });
    const total = sum.expense || 1;
    return [...m.values()].
    map((c) => ({ ...c, pct: c.total / total })).
    sort((a, b) => b.total - a.total);
  }, [scoped]);

  // trend (last 14 days expense)
  const trend = useMemoS(() => buildTrend(txns, period), [txns, period]);

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h1>Analytics</h1>
        <div style={{ display:'flex', gap: 8 }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} size={38} />
          <div className="icon-btn" style={{ width:38, height:38 }}><Icon name="calendar" size={16} /></div>
        </div>
      </div>

      <div className="screen-scroll" style={{ paddingTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <PeriodTabs value={period} onChange={setPeriod} />
        </div>

        <div className="stat-row">
          <GlassCard className="stat-card in">
            <div className="lbl">Income</div>
            <div className="val">{fmtINR(sum.income, { withFrac: false })}</div>
            <div className="delta up"><Icon name="trend-up" size={10} /> +12.4%</div>
          </GlassCard>
          <GlassCard className="stat-card out">
            <div className="lbl">Spent</div>
            <div className="val">{fmtINR(sum.expense, { withFrac: false })}</div>
            <div className="delta down"><Icon name="arrow-up-right" size={10} /> +4.1%</div>
          </GlassCard>
        </div>

        {/* Trend chart */}
        <GlassCard className="chart-card">
          <div className="head">
            <div className="title">Spend trend</div>
            <div className="legend">
              <span><span className="swatch" style={{ background: 'rgba(255,255,255,0.9)' }}></span>Expense</span>
              <span><span className="swatch" style={{ background: 'var(--income)' }}></span>Income</span>
            </div>
          </div>
          <TrendChart series={trend} />
        </GlassCard>

        {/* Category breakdown */}
        <GlassCard className="chart-card">
          <div className="head">
            <div className="title">By category</div>
            <div className="legend">{catBreakdown.length} active</div>
          </div>
          {catBreakdown.length === 0 ?
          <div className="empty"><div className="ic">⌀</div>No expenses in this period.</div> :
          catBreakdown.slice(0, 6).map((c) =>
          <div key={c.name} className="cat-row">
                <TxnIcon icon={c.icon} size={34} />
                <div className="meta">
                  <div className="name">{c.name}</div>
                  <div className="bar"><div style={{ width: `${Math.max(6, c.pct * 100)}%` }}></div></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="amt">{fmtINR(c.total, { withFrac: false })}</div>
                  <div className="pct">{(c.pct * 100).toFixed(0)}%</div>
                </div>
              </div>
          )
          }
        </GlassCard>
      </div>
    </div>);

}

// build a synthetic trend series from txns (income/expense per day, last N days)
function buildTrend(txns, period) {
  const days = period === 'today' ? 7 : period === 'week' ? 7 : 14;
  const today = new Date();today.setHours(0, 0, 0, 0);
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);d.setDate(today.getDate() - i);
    buckets.push({ date: d, income: 0, expense: 0 });
  }
  for (const t of txns) {
    const d = new Date(t.date);d.setHours(0, 0, 0, 0);
    const idx = buckets.findIndex((b) => b.date.getTime() === d.getTime());
    if (idx >= 0) {
      if (t.type === 'income') buckets[idx].income += t.amount;else
      buckets[idx].expense += t.amount;
    }
  }
  return buckets;
}

// Smooth area chart (expense) + line (income overlay)
function TrendChart({ series }) {
  const W = 320,H = 140,P = 12;
  const max = Math.max(1, ...series.map((b) => Math.max(b.expense, b.income)));
  const x = (i) => P + i * (W - 2 * P) / Math.max(1, series.length - 1);
  const y = (v) => H - P - v / max * (H - 2 * P);

  const linePath = (key) => {
    const pts = series.map((b, i) => [x(i), y(b[key])]);
    if (pts.length === 0) return '';
    // smooth
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1];
      const [cx, cy] = pts[i];
      const mx = (px + cx) / 2;
      d += ` Q ${px},${py} ${mx},${(py + cy) / 2}`;
      d += ` T ${cx},${cy}`;
    }
    return d;
  };

  const areaPath = (key) => {
    const base = linePath(key);
    if (!base) return '';
    const last = x(series.length - 1),first = x(0);
    return `${base} L ${last},${H - P} L ${first},${H - P} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <defs>
        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>
        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(123,227,168,0.30)" />
          <stop offset="100%" stopColor="rgba(123,227,168,0.0)" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((p) =>
      <line key={p} x1={P} x2={W - P} y1={P + p * (H - 2 * P)} y2={P + p * (H - 2 * P)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      )}
      {/* expense area */}
      <path d={areaPath('expense')} fill="url(#expGrad)" />
      <path d={linePath('expense')} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* income area + line */}
      <path d={areaPath('income')} fill="url(#incGrad)" />
      <path d={linePath('income')} fill="none" stroke="var(--income)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0" />
      {/* end-point dots */}
      <circle cx={x(series.length - 1)} cy={y(series[series.length - 1].expense)} r="3" fill="#fff" />
      <circle cx={x(series.length - 1)} cy={y(series[series.length - 1].income)} r="2.5" fill="var(--income)" />
    </svg>);

}

// ── Icon renderer ──────────────────────────────────────────────────────
// `icon` may be:
//   - an SVG string starting with "<svg" (lucide / brand / bank) — render as-is, currentColor inherits text
//   - any other string (emoji or fallback char) — render as text
function ItemIcon({ icon, size = 18, mono = true }) {
  if (!icon) return null;
  if (typeof icon === 'string' && icon.trim().startsWith('<svg')) {
    // For lucide icons we force monochrome (currentColor → white). Brand/bank logos contain their own
    // fill colors via <rect fill="..."> + <text fill="...">; let them through unchanged.
    return (
      <span
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'currentColor' }}
        dangerouslySetInnerHTML={{ __html: icon.replace('<svg ', `<svg width="${size}" height="${size}" `) }} />);


  }
  return <span style={{ fontSize: size }}>{icon}</span>;
}

/* ──────────────────────────────────────────────────────────────────────
   APPEARANCE — dedicated theme studio (mobile + desktop both consume it)
   ────────────────────────────────────────────────────────────────────── */
function AppearanceScreen({ t, setTweak, onBack, palettes }) {
  const customRef = useRefS(null);
  const customAccentRef = useRefS(null);
  const isPreset = palettes.includes(t.palette);
  const isAccentPreset = palettes.includes(t.accent);

  function HueChooser({ value, onChange, customInputRef, isPresetVal }) {
    return (
      <>
        <div className="appr-palette-grid">
          {palettes.map(c => (
            <button key={c}
              className={`appr-swatch ${value === c ? 'active' : ''}`}
              onClick={() => onChange(c)}
              style={{ '--swatch': c }}
              aria-label={`Hue ${c}`}>
              <span className="swatch-blob"></span>
              {value === c && <span className="swatch-check"><Icon name="check" size={12} strokeWidth={2.6} /></span>}
            </button>
          ))}
          <button
            className={`appr-swatch appr-swatch-custom ${!isPresetVal ? 'active' : ''}`}
            onClick={() => customInputRef.current && customInputRef.current.click()}
            style={{ '--swatch': !isPresetVal ? value : 'transparent' }}
            aria-label="Custom hue"
            title="Pick any color">
            <span className="swatch-blob custom-blob"></span>
            <span className="swatch-custom-label">{!isPresetVal ? (value || '').toUpperCase() : 'Custom'}</span>
            <input
              ref={customInputRef}
              type="color"
              value={value || '#fc618d'}
              onChange={e => onChange(e.target.value)}
              style={{ position:'absolute', inset:0, opacity:0, width:'100%', height:'100%', cursor:'pointer' }}
            />
          </button>
        </div>
        <HueSlider value={value} onChange={onChange} />
      </>
    );
  }

  return (
    <div className="screen-enter appearance-screen">
      <div className="screen-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && <div className="back" onClick={onBack}><Icon name="arrow-left" size={16} /></div>}
          <h1>Appearance</h1>
        </div>
        <ThemeToggle theme={t.theme} onToggle={() => setTweak('theme', t.theme === 'light' ? 'dark' : 'light')} size={38} />
      </div>

      <div className="screen-scroll appearance-body">
        {/* THEME */}
        <div className="appr-section">
          <div className="appr-section-head">
            <div className="title">Theme</div>
            <div className="hint">Pick a mood</div>
          </div>
          <div className="appr-theme-grid">
            {[
              ['dark',  'Dark',  'Cinematic, low-light, glass-on-ink'],
              ['light', 'Light', 'Warm cream, daytime calm'],
            ].map(([v, label, helper]) => (
              <div key={v}
                className={`appr-theme-card ${t.theme === v ? 'active' : ''}`}
                data-preview={v}
                onClick={() => setTweak('theme', v)}>
                <div className={`mp mp-${v}`}>
                  <div className="mp-blob mp-blob-1"></div>
                  <div className="mp-blob mp-blob-2"></div>
                  <div className="mp-bar"></div>
                  <div className="mp-pill"></div>
                  <div className="mp-line"></div>
                  <div className="mp-line short"></div>
                </div>
                <div className="appr-row-meta">
                  <div className="appr-label">{label}</div>
                  <div className="appr-helper">{helper}</div>
                </div>
                {t.theme === v && <span className="appr-check"><Icon name="check" size={12} strokeWidth={2.4} /></span>}
              </div>
            ))}
          </div>
        </div>

        {/* BACKGROUND STYLE */}
        <div className="appr-section">
          <div className="appr-section-head">
            <div className="title">Background</div>
            <div className="hint">Atmosphere behind your money</div>
          </div>
          <div className="appr-bg-grid">
            {[
              ['mesh',   'Mesh',   'Soft single-hue bloom'],
              ['orbs',   'Orbs',   'Heavy 3D spheres'],
              ['aurora', 'Aurora', 'Flowing horizontal bands'],
            ].map(([v, label, helper]) => (
              <div key={v}
                className={`appr-bg-card ${t.background === v ? 'active' : ''}`}
                onClick={() => setTweak('background', v)}>
                <div className={`bgp bgp-${v}`}>
                  {v === 'mesh' && <>
                    <div className="bgp-bloom bgp-bloom-a"></div>
                    <div className="bgp-bloom bgp-bloom-b"></div>
                  </>}
                  {v === 'orbs' && <>
                    <div className="bgp-orb bgp-orb-a"></div>
                    <div className="bgp-orb bgp-orb-b"></div>
                  </>}
                  {v === 'aurora' && <>
                    <div className="bgp-band bgp-band-a"></div>
                    <div className="bgp-band bgp-band-b"></div>
                    <div className="bgp-band bgp-band-c"></div>
                  </>}
                </div>
                <div className="appr-label">{label}</div>
                <div className="appr-helper">{helper}</div>
                {t.background === v && <span className="appr-check"><Icon name="check" size={11} strokeWidth={2.4} /></span>}
              </div>
            ))}
          </div>
        </div>

        {/* BACKGROUND HUE — palette/seed */}
        <div className="appr-section">
          <div className="appr-section-head">
            <div className="title">Background hue</div>
            <div className="hint">Mesh, orbs, and aurora colour</div>
          </div>
          <HueChooser
            value={t.palette}
            onChange={v => setTweak('palette', v)}
            customInputRef={customRef}
            isPresetVal={isPreset}
          />
        </div>

        {/* BUTTON TINT — accent */}
        <div className="appr-section">
          <div className="appr-section-head">
            <div className="title">Button tint</div>
            <div className="hint">Primary CTAs &amp; selected pills</div>
          </div>
          <HueChooser
            value={t.accent}
            onChange={v => setTweak('accent', v)}
            customInputRef={customAccentRef}
            isPresetVal={isAccentPreset}
          />
        </div>

        {/* LIVE PREVIEW */}
        <div className="appr-section">
          <div className="appr-section-head">
            <div className="title">Preview</div>
            <div className="hint">Live · reflects your picks</div>
          </div>
          <GlassCard className="appr-preview">
            <div className="appr-preview-row">
              <span className="appr-preview-label">Balance</span>
              <span className="appr-preview-pill">{t.theme === 'light' ? 'Light' : 'Dark'} · {t.background}</span>
            </div>
            <div className="appr-preview-balance">
              <span className="sym">₹</span><span>56,475</span><span className="frac">.00</span>
            </div>
            <div className="appr-preview-actions">
              <button className="appr-preview-btn primary">Add transaction</button>
              <button className="appr-preview-btn ghost">Cancel</button>
            </div>
            <div className="appr-preview-txns">
              <div className="txn income">
                <div className="ic">💼</div>
                <div className="meta">
                  <div className="name">Salary</div>
                  <div className="sub">Income · today</div>
                </div>
                <div className="amt income">+₹85,000</div>
              </div>
              <div className="txn expense">
                <div className="ic">🍱</div>
                <div className="meta">
                  <div className="name">Swiggy</div>
                  <div className="sub">Food · today</div>
                </div>
                <div className="amt expense">−₹482</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// Constant-chroma hue slider — drags through the spectrum in OKLCH.
function HueSlider({ value, onChange }) {
  // We persist as hex; convert hex→hue for the input position.
  const [hue, setHue] = useStateS(() => hexToHue(value));
  useEffectS(() => { setHue(hexToHue(value)); }, [value]);
  return (
    <div className="hue-slider-wrap">
      <input
        type="range" min="0" max="360" step="1"
        value={hue}
        onChange={e => {
          const h = +e.target.value;
          setHue(h);
          onChange(hslToHex(h, 70, 62));
        }}
        className="hue-slider"
      />
      <div className="hue-slider-meta">
        <span>Hue {Math.round(hue)}°</span>
        <span className="hue-swatch" style={{ background: value }}></span>
      </div>
    </div>
  );
}
// ── color helpers ─────────────────────────────────────────────────────
function hexToHue(hex) {
  if (!hex) return 340;
  const m = hex.replace('#','');
  const r = parseInt(m.slice(0,2),16)/255, g = parseInt(m.slice(2,4),16)/255, b = parseInt(m.slice(4,6),16)/255;
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx-mn;
  if (d === 0) return 0;
  let h;
  if (mx === r) h = ((g-b)/d) % 6;
  else if (mx === g) h = (b-r)/d + 2;
  else h = (r-g)/d + 4;
  h = Math.round(h * 60);
  return (h + 360) % 360;
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h/30) % 12;
  const a = s * Math.min(l, 1-l);
  const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
  const to = x => Math.round(255 * f(x)).toString(16).padStart(2,'0');
  return '#' + to(0) + to(8) + to(4);
}

Object.assign(window, { AppearanceScreen, HueSlider });

/* ──────────────────────────────────────────────────────────────────────
   MANAGE — categories, subcategories, accounts (add / edit / delete)
   ────────────────────────────────────────────────────────────────────── */
function ManageScreen({ catalog, setCatalog, onBack }) {
  const [tab, setTab] = useStateS('categories');
  const [adding, setAdding] = useStateS(false);
  const [newName, setNewName] = useStateS('');
  const [newIcon, setNewIcon] = useStateS('');
  const [editingId, setEditingId] = useStateS(null);
  const [editValue, setEditValue] = useStateS('');
  const [editingTailId, setEditingTailId] = useStateS(null);
  const [editTailValue, setEditTailValue] = useStateS('');
  const [newTail, setNewTail] = useStateS('');
  const [iconPickFor, setIconPickFor] = useStateS(null); // item id whose icon we're picking
  const [toast, setToast] = useStateS(null);
  const [query, setQuery] = useStateS('');
  // Reset search when switching tabs.
  useEffectS(() => { setQuery(''); }, [tab]);
  const tablabels = { categories: 'Category', subcategories: 'Subcategory', accounts: 'Account' };

  const items = useMemoS(() => {
    const list = catalog[tab] || [];
    const sorted = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(x => {
      const name = (x.name || '').toLowerCase();
      const tail = (x.tail || '').toString().toLowerCase();
      return name.includes(q) || tail.includes(q);
    });
  }, [tab, catalog, query]);

  function defaultIcon(t) {return t === 'accounts' ? '🏦' : t === 'subcategories' ? '🏷️' : '📁';}

  function flash(msg) {setToast(msg);setTimeout(() => setToast(null), 1400);}

  function startAdd() {setAdding(true);setNewName('');setNewIcon('');setNewTail('');}
  function cancelAdd() {setAdding(false);setNewName('');setNewIcon('');setNewTail('');}
  function commitAdd() {
    const name = newName.trim();
    if (!name) return flash('Name required');
    const tailDigits = newTail.replace(/\D/g, '').slice(0, 4);
    if (tab === 'accounts' && newTail.trim() && tailDigits.length < 4) {
      return flash('Card / account number must be 4 digits');
    }
    const newItem = {
      id: 'x' + Date.now(),
      name,
      icon: newIcon || defaultIcon(tab)
    };
    if (tab === 'accounts') newItem.tail = tailDigits || null;
    setCatalog({ ...catalog, [tab]: [...catalog[tab], newItem] });
    cancelAdd();
    flash(`${tablabels[tab]} added`);
  }

  function startRename(item) {setEditingId(item.id);setEditValue(item.name);}
  function commitRename(item) {
    const name = editValue.trim();
    if (!name) {setEditingId(null);return;}
    if (name === item.name) {setEditingId(null);return;}
    setCatalog({ ...catalog, [tab]: catalog[tab].map((x) => x.id === item.id ? { ...x, name } : x) });
    setEditingId(null);
    flash('Renamed');
  }

  function startTailEdit(item) {setEditingTailId(item.id);setEditTailValue(item.tail || '');}
  function commitTailEdit(item) {
    const digits = (editTailValue || '').replace(/\D/g, '').slice(0, 4);
    if (digits && digits.length < 4) { flash('Use 4 digits or leave empty'); return; }
    const next = digits || null;
    if (next === item.tail) { setEditingTailId(null); return; }
    setCatalog({ ...catalog, [tab]: catalog[tab].map((x) => x.id === item.id ? { ...x, tail: next } : x) });
    setEditingTailId(null);
    flash(next ? 'Card number updated' : 'Card number removed');
  }

  function removeItem(item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    const next = { ...catalog, [tab]: catalog[tab].filter((x) => x.id !== item.id) };
    setCatalog(next);
    flash('Deleted');
  }

  function setItemIcon(item, icon) {
    if (!icon) return;
    setCatalog({ ...catalog, [tab]: catalog[tab].map((x) => x.id === item.id ? { ...x, icon } : x) });
    setIconPickFor(null);
  }

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="back" onClick={onBack}><Icon name="arrow-left" size={16} /></div>
          <h1>Manage</h1>
        </div>
        <div className="icon-btn" onClick={startAdd} title="Add"><Icon name="plus" size={16} /></div>
      </div>

      <div className="screen-scroll" style={{ paddingTop: 4 }}>
        {/* Sub-tabs: categories / subcategories / accounts */}
        <div className="type-tabs" style={{ marginBottom: 12 }}>
          <button className={tab === 'categories' ? 'active' : ''} onClick={() => {setTab('categories');cancelAdd();}}>Categories</button>
          <button className={tab === 'subcategories' ? 'active' : ''} onClick={() => {setTab('subcategories');cancelAdd();}}>Subcats</button>
          <button className={tab === 'accounts' ? 'active' : ''} onClick={() => {setTab('accounts');cancelAdd();}}>Accounts</button>
        </div>

        {/* Search within current tab */}
        <div className="search-input-wrap" style={{ padding: '10px 14px', borderRadius: 14, marginBottom: 14 }}>
          <Icon name="search" size={14} color="currentColor" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${tab === 'categories' ? 'categories' : tab === 'subcategories' ? 'subcategories' : 'accounts'}…`}
            style={{ fontSize: 13 }}
          />
          {query && (
            <div onClick={() => setQuery('')} style={{ cursor:'pointer', color:'var(--text-3)' }}>
              <Icon name="x" size={12} />
            </div>
          )}
        </div>

        {/* Add form */}
        {adding &&
        <GlassCard className="strong" style={{ padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
              onClick={() => setIconPickFor('__new')}
              style={{
                width: 44, height: 44, borderRadius: 14, border: 'none',
                background: 'rgba(255,255,255,0.07)', color: 'var(--text-1)',
                fontSize: 20, cursor: 'pointer', flexShrink: 0,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}
              title="Pick icon">
              {newIcon ? <ItemIcon icon={newIcon} size={24} /> : <span style={{ color: 'var(--text-3)' }}>+</span>}</button>
              <input
              placeholder={tablabels[tab] + ' name…'}
              value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {if (e.key === 'Enter') commitAdd();if (e.key === 'Escape') cancelAdd();}}
              autoFocus
              style={{
                flex: 1, background: 'rgba(255,255,255,0.04)', border: 'none', outline: 'none',
                padding: '12px 14px', borderRadius: 14, color: 'var(--text-1)',
                fontFamily: 'var(--font-body)', fontSize: 14,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
              }} />
            
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={commitAdd}
            style={{ flex: 1, padding: '10px 14px', border: 'none', cursor: 'pointer',
              borderRadius: 999, background: 'rgba(255,255,255,0.95)', color: '#0a0a0d',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>
                Add
              </button>
              <button onClick={cancelAdd}
            style={{ padding: '10px 18px', border: 'none', cursor: 'pointer',
              borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: 'var(--text-2)',
              fontFamily: 'var(--font-body)', fontSize: 13,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                Cancel
              </button>
            </div>
          </GlassCard>
        }

        {/* Item list */}
        {items.length === 0 &&
        <div className="empty">
            <div className="ic">{query ? '🔎' : '📦'}</div>
            {query ? <>No {tablabels[tab].toLowerCase()} matches “{query}”</> : <>Nothing here yet<br /><span style={{ fontSize: 12, color: 'var(--text-4)' }}>Tap + to add your first {tablabels[tab].toLowerCase()}</span></>}
          </div>
        }

        <div className="txn-list">
          {items.map((item) =>
          <div key={item.id} className="txn" style={{ cursor: 'default' }}>
              <button
              onClick={() => setIconPickFor(item.id)}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.07)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
                flexShrink: 0, color: 'var(--text-1)', overflow: 'hidden'
              }}>
              <ItemIcon icon={item.icon || defaultIcon(tab)} size={20} /></button>

              <div className="meta">
                {editingId === item.id ?
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => commitRename(item)}
                onKeyDown={(e) => {if (e.key === 'Enter') commitRename(item);if (e.key === 'Escape') setEditingId(null);}}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  outline: 'none', borderRadius: 8, padding: '6px 10px',
                  color: 'var(--text-1)', fontSize: 14, fontFamily: 'var(--font-body)',
                  width: '100%', boxSizing: 'border-box'
                }} /> :


              <div className="name" onClick={() => startRename(item)} style={{ cursor: 'pointer' }}>{item.name}</div>
              }
                {tab === 'accounts' && item.tail &&
              <div className="sub">···· {item.tail}</div>
              }
              </div>

              <button
              onClick={() => startRename(item)}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.04)', color: 'var(--text-3)', cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Rename">
              ✎</button>
              <button
              onClick={() => removeItem(item)}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: 'rgba(255,138,138,0.10)', color: 'var(--expense)', cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,138,138,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14
              }}
              title="Delete">
              ✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Icon picker sheet */}
      {iconPickFor !== null &&
      <IconPickerSheet
        current={iconPickFor === '__new' ? newIcon : (items.find((x) => x.id === iconPickFor) || {}).icon}
        onPick={(icon) => {
          if (iconPickFor === '__new') {setNewIcon(icon);setIconPickFor(null);} else
          setItemIcon(items.find((x) => x.id === iconPickFor), icon);
        }}
        onClose={() => setIconPickFor(null)} />

      }

      {/* Tiny toast */}
      {toast &&
      <div style={{
        position: 'absolute', bottom: 110, left: '50%', transform: 'translateX(-50%)', zIndex: 80,
        padding: '8px 16px', borderRadius: 999,
        background: 'rgba(20,20,26,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 12px 30px rgba(0,0,0,0.5)',
        color: 'var(--text-1)', fontSize: 12
      }}>{toast}</div>
      }
    </div>);

}

// Icon picker: 3 tabs — Icons (lucide library) / Brands (banks + brand logos) / Emoji
function IconPickerSheet({ current, onPick, onClose }) {
  const [tab, setTab] = useStateS('icons');
  const [custom, setCustom] = useStateS('');
  const [q, setQ] = useStateS('');
  useEffectS(() => { setQ(''); }, [tab]);
  const commonEmojis = [
  '🍱', '🍜', '🍔', '🍕', '☕', '🍵', '🍺', '🥬', '🛒', '📦',
  '🚕', '🛺', '🚇', '⛽', '🚲', '✈️', '🏠', '🔑', '💡', '💧',
  '📱', '📡', '🎬', '🎧', '🎟️', '🎮', '📺', '💳', '💵', '💼',
  '✏️', '🎁', '💊', '🩺', '🧴', '🛍️', '🎽', '🏛️', '🏦', '📲',
  '⚡', '🌿', '🎉', '📅', '💸', '🪙', '✨', '📁', '🏷️', '🪪'];

  const lucideAll = window.ICONS_LIB || [];
  const brandsAll = [...(window.BRANDS_LIB || []), ...(window.BANK_LOGOS || [])];
  const matches = (item) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return item.name.toLowerCase().includes(s) || item.key.toLowerCase().includes(s);
  };
  const lucide = lucideAll.filter(matches);
  const brands = brandsAll.filter(matches);

  // tap → store the SVG string (so the icon survives without needing the lookup tables).
  const pickSvgItem = (item) => onPick(item.svg);
  const pickEmoji = (e) => onPick(e);

  const isCurrent = (val) => val && current && val === current;

  return (
    <>
      <div className="sheet-backdrop show" onClick={onClose}></div>
      <div className="sheet show" style={{ maxHeight: '78%' }}>
        <div className="grabber"></div>
        <h3>Choose an icon</h3>

        {/* Tabs */}
        <div className="type-tabs" style={{ marginBottom: 12 }}>
          <button className={tab === 'icons' ? 'active' : ''} onClick={() => setTab('icons')}>Icons</button>
          <button className={tab === 'brands' ? 'active' : ''} onClick={() => setTab('brands')}>Brands</button>
          <button className={tab === 'emoji' ? 'active' : ''} onClick={() => setTab('emoji')}>Emoji</button>
        </div>

        {(tab === 'icons' || tab === 'brands') && (
          <div className="search-input-wrap" style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 10 }}>
            <Icon name="search" size={14} color="rgba(255,255,255,0.5)" />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder={tab === 'icons' ? 'Search icons…' : 'Search brands & banks…'}
              style={{ fontSize: 13 }}
              autoFocus
            />
            {q && <div onClick={() => setQ('')} style={{ cursor: 'pointer', color: 'var(--text-3)' }}><Icon name="x" size={12} /></div>}
          </div>
        )}

        {/* Icons grid — lucide stroke icons (forced white) */}
        {tab === 'icons' &&
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8,
          maxHeight: 360, overflowY: 'auto', padding: '4px 2px 12px'
        }}>
            {lucide.map((item) =>
          <button key={item.key} onClick={() => pickSvgItem(item)} title={item.name}
          style={{
            aspectRatio: '1/1', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: isCurrent(item.svg) ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.05)',
            color: 'var(--text-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isCurrent(item.svg) ?
            'inset 0 1px 0 rgba(255,255,255,0.20), 0 0 0 1px rgba(255,255,255,0.18)' :
            'inset 0 1px 0 rgba(255,255,255,0.06)',
            transition: 'background 120ms ease'
          }}><ItemIcon icon={item.svg} size={22} /></button>
          )}
          </div>
        }
        {tab === 'icons' && q.trim() && lucide.length === 0 && (
          <div style={{ padding:'22px 14px', textAlign:'center', color:'var(--text-3)', fontSize: 12 }}>
            No icons match “{q}”
          </div>
        )}

        {/* Brands & banks — colorful logos rendered at their natural rounded-square aspect */}
        {tab === 'brands' &&
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          maxHeight: 360, overflowY: 'auto', padding: '4px 2px 16px'
        }}>
            {brands.map((item) =>
          <button key={item.key} onClick={() => pickSvgItem(item)} title={item.name}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: 6, border: 'none', cursor: 'pointer',
            background: 'transparent', borderRadius: 16
          }}>
                <span style={{
              width: 56, height: 56, borderRadius: 14, overflow: 'hidden',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isCurrent(item.svg) ?
              '0 0 0 2px rgba(255,255,255,0.9), 0 6px 18px rgba(0,0,0,0.35)' :
              '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              transition: 'box-shadow 150ms ease, transform 120ms ease'
            }}
            dangerouslySetInnerHTML={{ __html: item.svg.replace('<svg ', '<svg width="56" height="56" preserveAspectRatio="xMidYMid meet" ') }} />
            
                <span style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.02em', textAlign: 'center', maxWidth: 84, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
              </button>
          )}
          </div>
        }
        {tab === 'brands' && q.trim() && brands.length === 0 && (
          <div style={{ padding:'22px 14px', textAlign:'center', color:'var(--text-3)', fontSize: 12 }}>
            No brands match “{q}”
          </div>
        )}

        {/* Emoji palette + custom input */}
        {tab === 'emoji' &&
        <>
            <div style={{ padding: '0 4px 12px' }}>
              <input
              value={custom} onChange={(e) => setCustom(e.target.value)}
              placeholder="Or type any emoji from your keyboard…"
              onKeyDown={(e) => {if (e.key === 'Enter' && custom.trim()) pickEmoji(custom.trim());}}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.05)', border: 'none', outline: 'none',
                color: 'var(--text-1)', fontFamily: 'var(--font-body)', fontSize: 15,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                boxSizing: 'border-box'
              }} />
            
              <div style={{ fontSize: 11, color: 'var(--text-3)', padding: '6px 4px 0', letterSpacing: '0.02em' }}>
                Tip: long-press your keyboard's emoji button on mobile, or use ⌘/Win + ; on desktop.
              </div>
            </div>
            <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6,
            padding: '4px 2px 12px', maxHeight: 280, overflowY: 'auto'
          }}>
              {commonEmojis.map((e) =>
            <button key={e} onClick={() => pickEmoji(e)}
            style={{
              aspectRatio: '1/1', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: isCurrent(e) ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
              fontSize: 18, color: 'var(--text-1)',
              boxShadow: isCurrent(e) ?
              'inset 0 1px 0 rgba(255,255,255,0.20), 0 0 0 1px rgba(255,255,255,0.18)' :
              'inset 0 1px 0 rgba(255,255,255,0.06)'
            }}>{e}</button>
            )}
            </div>
            {custom.trim() &&
          <button
            onClick={() => pickEmoji(custom.trim())}
            className="save-btn" style={{ marginTop: 4 }}>
                Use “{custom.trim()}” as icon
              </button>
          }
          </>
        }
      </div>
    </>);

}

/* ──────────────────────────────────────────────────────────────────────
   SEARCH — mirrors existing app's filter-based search
   (date range required, category/sub/account filters, sort, run button)
   ────────────────────────────────────────────────────────────────────── */
function SearchScreen({ txns, theme, onToggleTheme, onEdit }) {
  // default range: last 30 days
  const defaultFrom = useMemoS(() => {const d = new Date();d.setDate(d.getDate() - 30);return d.toISOString().slice(0, 10);}, []);
  const defaultTo = useMemoS(() => new Date().toISOString().slice(0, 10), []);

  const [from, setFrom] = useStateS(defaultFrom);
  const [to, setTo] = useStateS(defaultTo);
  const [category, setCategory] = useStateS(''); // '' = all
  const [subcat, setSubcat] = useStateS(''); // '' = all (within category)
  const [account, setAccount] = useStateS(''); // '' = all
  const [dateSort, setDateSort] = useStateS('desc'); // desc | asc
  const [amtSort, setAmtSort] = useStateS(''); // '' | amount-desc | amount-asc
  const [ran, setRan] = useStateS(false);
  const [results, setResults] = useStateS([]);
  const [err, setErr] = useStateS(null);

  // derive category / subcategory / account options from existing expenses
  const allCats = useMemoS(() => [...new Set(txns.filter((t) => t.type === 'expense').map((t) => t.category))], [txns]);
  const allAccs = useMemoS(() => [...new Set(txns.filter((t) => t.type === 'expense').map((t) => t.account))], [txns]);
  const allSubs = useMemoS(() => [...new Set(txns.filter((t) => t.type === 'expense' && t.sub).map((t) => t.sub))], [txns]);
  const subsForCat = useMemoS(() => {
    if (!category) return allSubs;
    return [...new Set(txns.filter((t) => t.category === category && t.sub).map((t) => t.sub))];
  }, [category, txns, allSubs]);

  // reset subcat when category changes
  useEffectS(() => {setSubcat('');}, [category]);

  function runSearch() {
    setErr(null);
    if (!from || !to) {setErr('Choose both From and To dates');return;}
    if (from > to) {setErr('From date must be before To date');return;}

    let r = txns.filter((t) => t.type === 'expense');
    const fromMs = new Date(from + 'T00:00:00').getTime();
    const toMs = new Date(to + 'T23:59:59').getTime();
    r = r.filter((t) => {const d = new Date(t.date).getTime();return d >= fromMs && d <= toMs;});
    if (category) r = r.filter((t) => t.category === category);
    if (subcat) r = r.filter((t) => t.sub === subcat);
    if (account) r = r.filter((t) => t.account === account);

    // sort: amount takes precedence (matches existing applySearchSort)
    const sort = amtSort || dateSort;
    if (sort === 'amount-desc') r.sort((a, b) => b.amount - a.amount);else
    if (sort === 'amount-asc') r.sort((a, b) => a.amount - b.amount);else
    if (sort === 'asc') r.sort((a, b) => new Date(a.date) - new Date(b.date));else
    r.sort((a, b) => new Date(b.date) - new Date(a.date));

    setResults(r);
    setRan(true);
  }

  function reset() {
    setCategory('');setSubcat('');setAccount('');
    setDateSort('desc');setAmtSort('');
    setFrom(defaultFrom);setTo(defaultTo);
    setRan(false);setResults([]);setErr(null);
  }

  const total = useMemoS(() => results.reduce((s, t) => s + t.amount, 0), [results]);
  // group by day for the results list (matches existing renderExpenseGroups)
  const groups = useMemoS(() => {
    if (!ran || results.length === 0) return [];
    // groupByDay sorts internally — re-sort within day to honor our chosen sort
    const sort = amtSort || dateSort;
    const out = groupByDay(results);
    if (sort === 'amount-desc') out.forEach((g) => g.items.sort((a, b) => b.amount - a.amount));
    if (sort === 'amount-asc') out.forEach((g) => g.items.sort((a, b) => a.amount - b.amount));
    if (sort === 'asc') out.reverse();
    return out;
  }, [results, ran, dateSort, amtSort]);

  return (
    <div className="screen-enter">
      <div className="screen-head">
        <h1>Search</h1>
        <div style={{ display:'flex', gap: 8 }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} size={38} />
          <div className="icon-btn" style={{ width:38, height:38 }} onClick={reset} title="Reset"><Icon name="x" size={14} /></div>
        </div>
      </div>

      <div className="screen-scroll" style={{ paddingTop: 4 }}>
        {/* Date range */}
        <div className="field">
          <div className="lbl">Range</div>
          <GlassCard style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <DateField label="From" value={from} onChange={setFrom} />
            <DateField label="To" value={to} onChange={setTo} />
          </GlassCard>
          {err && <div style={{ fontSize: 12, color: 'var(--expense)', padding: '8px 4px 0' }}>{err}</div>}
        </div>

        {/* Sort */}
        <div className="field">
          <div className="lbl">Sort by</div>
          <GlassCard style={{ padding: 12 }}>
            <SortRow axis="Date" value={dateSort} options={[
            ['desc', 'New → Old'],
            ['asc', 'Old → New']]
            } onChange={setDateSort} />
            <div style={{ height: 8 }}></div>
            <SortRow axis="Amount" value={amtSort} options={[
            ['', 'Default'],
            ['amount-desc', 'High → Low'],
            ['amount-asc', 'Low → High']]
            } onChange={setAmtSort} />
          </GlassCard>
        </div>

        {/* Category */}
        <div className="field">
          <div className="lbl">Category</div>
          <GlassSelect
            value={category} onChange={setCategory}
            placeholder="All categories"
            options={allCats.map((c) => ({ value: c, label: c }))} />
          
        </div>

        {/* Subcategory — always visible; narrows when a category is picked */}
        {subsForCat.length > 0 &&
        <div className="field">
            <div className="lbl">Subcategory{category ? ` · in ${category}` : ''}</div>
            <GlassSelect
            value={subcat} onChange={setSubcat}
            placeholder={category ? `All subcategories in ${category}` : 'All subcategories'}
            options={subsForCat.map((s) => ({ value: s, label: s }))} />
          
          </div>
        }

        {/* Account */}
        <div className="field">
          <div className="lbl">Account</div>
          <GlassSelect
            value={account} onChange={setAccount}
            placeholder="All accounts"
            options={allAccs.map((a) => ({ value: a, label: a }))} />
          
        </div>

        {/* Run */}
        <button className="save-btn" style={{ marginTop: 6, marginBottom: 22 }} onClick={runSearch}>
          Search expenses
        </button>

        {/* Results */}
        <div className="section-head">
          <div className="title">Results</div>
          {ran && results.length > 0 &&
          <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.04em' }}>{results.length} {results.length === 1 ? 'entry' : 'entries'}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginTop: 2 }}>{fmtINR(total, { withFrac: false })}</div>
            </div>
          }
        </div>

        {!ran &&
        <div className="empty">
            <div className="ic">🔍</div>
            Search your transactions<br />
            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Pick a date range and filters, then tap Search</span>
          </div>
        }

        {ran && results.length === 0 &&
        <div className="empty">
            <div className="ic">🔎</div>
            No matches found<br />
            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Try different dates or filters</span>
          </div>
        }

        {ran && groups.map((g, i) =>
        <div key={i}>
            <DayHead d={g.date} net={-g.items.reduce((s, t) => s + t.amount, 0)} />
            <div className="txn-list">
              {g.items.map((t) => <TxnRow key={t.id} t={t} onClick={onEdit ? () => onEdit(t) : undefined} />)}
            </div>
          </div>
        )}
      </div>
    </div>);

}

// ── Subcomponents for SearchScreen ─────────────────────────────────────
function DateField({ label, value, onChange }) {
  return (
    <div style={{
      borderRadius: 14, padding: '10px 14px',
      background: 'rgba(255,255,255,0.04)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      position: 'relative'
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <input
        type="date" value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--text-1)', fontFamily: 'var(--font-mono)', fontSize: 13,
          width: '100%', padding: 0, colorScheme: 'dark'
        }} />
      
    </div>);

}

function SortRow({ axis, value, options, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 64, fontSize: 12, color: 'var(--text-3)', letterSpacing: '0.02em' }}>{axis}</div>
      <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
        {options.map(([v, l]) =>
        <button
          key={v || 'def'}
          onClick={() => onChange(v)}
          style={{
            border: 'none', cursor: 'pointer',
            padding: '6px 12px', borderRadius: 999,
            fontSize: 12, fontFamily: 'var(--font-body)',
            background: value === v ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.05)',
            color: value === v ? '#0a0a0d' : 'var(--text-2)',
            boxShadow: value === v ? '0 2px 6px rgba(0,0,0,0.2)' : 'inset 0 1px 0 rgba(255,255,255,0.06)',
            transition: 'background 120ms ease, color 120ms ease'
          }}>
            {l}
          </button>
        )}
      </div>
    </div>);

}

// ── Glass-styled native dropdown ──────────────────────────────────────
// Native <select> for accessibility + mobile-keyboard friendliness,
// dressed up to match the glass aesthetic.
function GlassSelect({ value, onChange, options, placeholder = 'Select…' }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 14,
      background: 'var(--glass-fill)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      <span style={{
        position:'absolute', inset: 0, borderRadius: 14, padding: 1,
        background: 'var(--glass-border-grad)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor', maskComposite: 'exclude',
        pointerEvents: 'none',
      }}></span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          background: 'transparent', border: 'none', outline: 'none',
          color: value ? 'var(--text-1)' : 'var(--text-3)',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
          padding: '14px 40px 14px 16px',
          width: '100%', cursor: 'pointer',
          letterSpacing: '-0.005em',
        }}
      >
        <option value="" style={{ background: '#0a0a0d', color: 'var(--text-3)' }}>{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background:'#0a0a0d', color:'var(--text-1)' }}>{o.label}</option>
        ))}
      </select>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        style={{ position:'absolute', right: 14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color: 'var(--text-3)' }}>
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function AmountField({ isIncome, value, onChange, hasError }) {
  const [shaking, setShaking] = useStateS(false);
  useEffectS(() => {
    if (hasError) { setShaking(true); const t = setTimeout(() => setShaking(false), 500); return () => clearTimeout(t); }
  }, [hasError]);
  return (
    <div className={hasError ? `field-error${shaking ? ' shaking' : ''}` : ''} style={{ marginBottom: 18 }}>
      <GlassCard className="amount-card">
        <div className="lbl">{isIncome ? 'Income amount' : 'Expense amount'}</div>
        <div className="num" style={isIncome ? { color: 'var(--income)' } : {}}>
          <span className="sym">₹</span>
          <input
            inputMode="decimal"
            value={value}
            placeholder="0"
            onChange={e => {
              const v = e.target.value.replace(/[^0-9.]/g, '');
              const parts = v.split('.');
              onChange(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : v);
            }}
            style={{
              background:'transparent', border:'none', outline:'none',
              color: 'inherit', font: 'inherit', textAlign:'center',
              width: 'min(280px, 60vw)', padding: 0,
              caretColor: isIncome ? 'var(--income)' : 'var(--text-1)',
              fontFeatureSettings:'"tnum"',
            }}
          />
        </div>
      </GlassCard>
      {hasError && <div className="field-error-msg">Amount is required</div>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ADD (expense / income form)
   ────────────────────────────────────────────────────────────────────── */
function AddForm({ kind, editTxn, onClose, onSave, catalog = { categories: [], subcategories: [], accounts: [] } }) {
  const isEditing = !!editTxn;
  const isIncome = isEditing ? editTxn.type === 'income' : kind === 'income';
  const [amount, setAmount] = useStateS(isEditing ? String(editTxn.amount) : '');
  const [name, setName] = useStateS(isEditing ? editTxn.name : '');
  const [cat, setCat] = useStateS(isEditing ? (editTxn.category || '') : '');
  const [sub, setSub] = useStateS(isEditing ? (editTxn.sub || '') : '');
  const [acc, setAcc] = useStateS(isEditing ? (editTxn.account || '') : '');
  const [saving, setSaving] = useStateS(false);
  const [errors, setErrors] = useStateS({});
  const amountRef = useRefS(null);
  const nowIso = useMemoS(() => {
    const d = isEditing && editTxn.date ? new Date(editTxn.date) : new Date();
    // Use local date/time (not UTC) for the inputs
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return { date: dateStr, time: timeStr };
  }, []);
  const [dateVal, setDateVal] = useStateS(nowIso.date);
  const [timeVal, setTimeVal] = useStateS(nowIso.time);
  const datetime = `${dateVal}T${timeVal}`;

  // Cat / subcat / acc options from catalog (passed by parent — backed by D1)
  const incomeCatNames = ['Salary', 'Freelance', 'Other', 'Gift', 'Refund'];
  const expenseCatNames = (catalog.categories || []).map((c) => c.name);
  const cats = isIncome ? incomeCatNames : expenseCatNames;
  const subs = !isIncome ? (catalog.subcategories || []).map(s => s.name) : [];
  const accs = (catalog.accounts || []).map((a) => a.name);

  function handleSave() {
    if (saving) return;
    const num = Number(amount);
    const errs = {};
    if (!num || isNaN(num)) errs.amount = 'Amount is required';
    if (!cat) errs.cat = 'Category is required';
    if (!acc) errs.acc = 'Account is required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    Promise.resolve(onSave({
      type: isEditing ? editTxn.type : kind, amount: num, name, cat, sub, acc,
      date: datetime, catalog, editTxn,
    })).finally(() => setSaving(false));
  }


  return (
    <div className="form-screen screen-enter" style={{ background: 'rgba(6,6,10,0.92)', backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)' }}>
      <div className="form-head">
        <div className="icon-btn" onClick={onClose}><Icon name="arrow-left" size={16} /></div>
        <div className="title">{isEditing ? 'Edit' : 'Add'} {isIncome ? 'income' : 'expense'}</div>
        <div className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></div>
      </div>
      <div className="form-body">
        <AmountField
          isIncome={isIncome}
          value={amount}
          hasError={!!errors.amount}
          onChange={v => { setAmount(v); if (v) setErrors(e => ({ ...e, amount: null })); }}
        />

        <div className="field">
          <div className="lbl">{isIncome ? 'Source' : 'What was it?'}</div>
          <div className="input-row">
            <input placeholder={isIncome ? 'e.g. Monthly salary' : 'e.g. Coffee at Blue Tokai'} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <CompactPicker
          label="Category"
          items={cats}
          value={cat}
          onChange={v => { setCat(v); if (v) setErrors(e => ({ ...e, cat: null })); }}
          placeholder="Pick a category…"
          hasError={!!errors.cat}
          errorMsg={errors.cat}
          iconFor={(c) => {
            if (isIncome) return null;
            const hit = (catalog.categories || []).find(x => x.name === c);
            return hit ? hit.icon : null;
          }}
        />

        {!isIncome && (
          <CompactPicker
            label="Subcategory"
            items={subs}
            value={sub}
            onChange={setSub}
            placeholder="Pick a subcategory…"
            emptyText="No subcategories yet — add them from Settings."
            iconFor={(s) => {
              const hit = (catalog.subcategories || []).find(x => x.name === s);
              return hit ? hit.icon : null;
            }}
          />
        )}

        <CompactPicker
          label="Account"
          items={accs}
          value={acc}
          onChange={v => { setAcc(v); if (v) setErrors(e => ({ ...e, acc: null })); }}
          placeholder="Pick an account…"
          hasError={!!errors.acc}
          errorMsg={errors.acc}
          iconFor={(a) => {
            const hit = (catalog.accounts || []).find(x => x.name === a);
            return hit ? hit.icon : null;
          }}
        />

        <div className="field">
          <div className="lbl">Date &amp; time</div>
          <div className="datetime-row">
            <GlassCard className="datetime-part">
              <Icon name="calendar" size={14} color="var(--text-3)" />
              <input
                type="date"
                className="datetime-input"
                value={dateVal}
                onChange={e => setDateVal(e.target.value)}
              />
            </GlassCard>
            <GlassCard className="datetime-part">
              <Icon name="clock" size={14} color="var(--text-3)" />
              <input
                type="time"
                className="datetime-input"
                value={timeVal}
                onChange={e => setTimeVal(e.target.value)}
              />
            </GlassCard>
          </div>
        </div>
      </div>

      <div className="save-bar">
        <button className={`save-btn ${isIncome ? 'income' : ''}`} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : `${isEditing ? 'Update' : 'Save'} ${isIncome ? 'income' : 'expense'}${amount ? ` · ₹${amount}` : ''}`}
        </button>
      </div>
    </div>);

}

// ── Compact picker — shows selected value; tap to open full overlay ──
function CompactPicker({ label, items, value, onChange, placeholder, emptyText, iconFor, hasError, errorMsg }) {
  const [open, setOpen] = useStateS(false);
  const [q, setQ] = useStateS('');
  const [shaking, setShaking] = useStateS(false);
  const filtered = items.filter(i => !q.trim() || i.toLowerCase().includes(q.toLowerCase()));
  const selIcon = value && iconFor ? iconFor(value) : null;

  useEffectS(() => {
    if (hasError) { setShaking(true); const t = setTimeout(() => setShaking(false), 500); return () => clearTimeout(t); }
  }, [hasError]);

  return (
    <div className={`compact-picker${hasError ? ' field-error' : ''}${shaking ? ' shaking' : ''}`}>
      <div className="lbl">{label}</div>
      <div className="compact-pick-row" onClick={() => setOpen(true)}>
        <div className="compact-pick-selected">
          {value ? (
            <div className="chip active" style={{ pointerEvents: 'none' }}>
              {selIcon && (
                <span style={{ display:'inline-flex', alignItems:'center', width:16, height:16, overflow:'hidden', fontSize:13 }}>
                  <ItemIcon icon={selIcon} size={14} />
                </span>
              )}
              <span>{value}</span>
            </div>
          ) : (
            <span className="compact-pick-placeholder">{placeholder || `Pick ${label.toLowerCase()}…`}</span>
          )}
        </div>
        {value && (
          <button className="compact-pick-clear" onClick={e => { e.stopPropagation(); onChange(''); }}>
            <Icon name="x" size={10} strokeWidth={2.5} />
          </button>
        )}
        <span className="compact-pick-chevron"><Icon name="chevron-right" size={14} /></span>
      </div>
      {hasError && errorMsg && <div className="field-error-msg">{errorMsg}</div>}

      {open && (
        <div className="picker-overlay">
          <div className="picker-overlay-head">
            <div className="picker-overlay-title">{label}</div>
            <div className="icon-btn" onClick={() => { setOpen(false); setQ(''); }}><Icon name="x" size={16} /></div>
          </div>
          <div className="picker-overlay-body">
            <div className="picker-search-row">
              <Icon name="search" size={14} color="var(--text-3)" />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                autoFocus
              />
              {q && <div onClick={() => setQ('')} style={{ cursor:'pointer', color:'var(--text-3)' }}><Icon name="x" size={12} /></div>}
            </div>
            {filtered.length === 0 ? (
              <div style={{ fontSize:12, color:'var(--text-3)', padding:'12px 14px', borderRadius:12, background:'var(--glass-fill-soft)' }}>
                {emptyText || (q ? `No matches for "${q}"` : 'No items yet')}
              </div>
            ) : (
              <div className="chip-row">
                {filtered.map(item => {
                  const icon = iconFor ? iconFor(item) : null;
                  return (
                    <div key={item} className={`chip ${value === item ? 'active' : ''}`}
                      onClick={() => { onChange(item); setOpen(false); setQ(''); }}>
                      {icon && (
                        <span style={{ display:'inline-flex', alignItems:'center', width:18, height:18, overflow:'hidden', fontSize:14 }}>
                          <ItemIcon icon={icon} size={16} />
                        </span>
                      )}
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Transaction detail sheet ──────────────────────────────────────────
function TxnDetailSheet({ txn, onClose, onEdit, onDelete, catalog }) {
  const isIn = txn.type === 'income';
  const d = new Date(txn.date);
  const dateStr = d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  const timeStr = d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12: true });
  const accObj = (catalog?.accounts || []).find(a => a.name === txn.account);
  const subObj = (catalog?.subcategories || []).find(s => s.name === txn.sub);

  return (
    <>
      <div className="sheet-backdrop show" onClick={onClose} />
      <div className="sheet show" style={{ zIndex: 46 }}>
        <div className="grabber" />

        <div className="txn-detail-hero">
          <div className="txn-detail-icon">
            {txn.icon && txn.icon.startsWith('<svg')
              ? <span dangerouslySetInnerHTML={{ __html: txn.icon.replace('<svg ', '<svg width="28" height="28" ') }} />
              : <span>{txn.icon || (isIn ? '💼' : '💸')}</span>
            }
          </div>
          <div className="txn-detail-meta">
            <div className="txn-detail-name">{txn.name}</div>
            <div className="txn-detail-sub">{txn.category}{txn.sub ? ` · ${txn.sub}` : ''}</div>
          </div>
          <div className={`txn-detail-amount ${isIn ? 'income' : 'expense'}`}>
            {isIn ? '+' : '−'}{fmtINR(txn.amount, { withFrac: false })}
          </div>
        </div>

        <div className="txn-detail-rows">
          {txn.account && (
            <div className="txn-detail-row">
              <span className="txn-detail-row-label">Account</span>
              <span className="txn-detail-row-val" style={{ display:'flex', alignItems:'center', gap: 7 }}>
                {accObj?.icon && (
                  <span style={{ width:20, height:20, borderRadius:6, overflow:'hidden', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <ItemIcon icon={accObj.icon} size={18} />
                  </span>
                )}
                {txn.account}
              </span>
            </div>
          )}
          {txn.sub && (
            <div className="txn-detail-row">
              <span className="txn-detail-row-label">Subcategory</span>
              <span className="txn-detail-row-val" style={{ display:'flex', alignItems:'center', gap: 7 }}>
                {subObj?.icon && (
                  <span style={{ width:20, height:20, borderRadius:6, overflow:'hidden', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <ItemIcon icon={subObj.icon} size={18} />
                  </span>
                )}
                {txn.sub}
              </span>
            </div>
          )}
          <div className="txn-detail-row">
            <span className="txn-detail-row-label">Date</span>
            <span className="txn-detail-row-val">{dateStr}</span>
          </div>
          <div className="txn-detail-row">
            <span className="txn-detail-row-label">Time</span>
            <span className="txn-detail-row-val">{timeStr}</span>
          </div>
          <div className="txn-detail-row">
            <span className="txn-detail-row-label">Type</span>
            <span className="txn-detail-row-val" style={{ color: isIn ? 'var(--income)' : 'var(--text-1)' }}>
              {isIn ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>

        <div className="txn-detail-actions">
          <button className="txn-detail-btn delete" onClick={onDelete}>
            <Icon name="x" size={15} strokeWidth={2} />
            Delete
          </button>
          <button className="txn-detail-btn edit-action" onClick={onEdit}>
            <Icon name="edit" size={15} />
            Edit
          </button>
        </div>
      </div>
    </>
  );
}

// ── Searchable chip picker (legacy — kept for ManageScreen) ───────────
function SearchableChips({ label, items, value, onChange, placeholder, emptyText, iconFor }) {
  const [q, setQ] = useStateS('');
  const filtered = items.filter(i => !q.trim() || i.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="field">
      <div className="lbl">{label}</div>
      <div className="search-input-wrap" style={{ padding: '10px 14px', borderRadius: 14, marginBottom: 10 }}>
        <Icon name="search" size={14} color="rgba(255,255,255,0.5)" />
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder={placeholder || `Search ${label.toLowerCase()}…`}
          style={{ fontSize: 13 }}
        />
        {q && <div onClick={() => setQ('')} style={{ cursor:'pointer', color:'var(--text-3)' }}><Icon name="x" size={12} /></div>}
      </div>
      {filtered.length === 0 ? (
        <div style={{
          fontSize: 12, color: 'var(--text-3)',
          padding: '12px 14px', borderRadius: 12,
          background: 'var(--glass-fill-soft)',
          boxShadow: 'inset 0 1px 0 var(--inner-highlight)',
        }}>{emptyText || (q ? `No matches for "${q}"` : 'No items yet')}</div>
      ) : (
        <div className="chip-row">
          {filtered.map(item => {
            const icon = iconFor ? iconFor(item) : null;
            return (
              <div key={item} className={`chip ${value === item ? 'active' : ''}`} onClick={() => onChange(item)}>
                {icon && (
                  <span style={{
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width: 18, height: 18, overflow: 'hidden',
                    fontSize: 14, lineHeight: 1,
                  }}>
                    <ItemIcon icon={icon} size={16} />
                  </span>
                )}
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  HomeScreen, TransactionsScreen, AnalyticsScreen, SearchScreen, AddForm, ManageScreen, IconPickerSheet,
  SearchableChips, CompactPicker, TxnDetailSheet, buildTrend, TrendChart, DateField, SortRow, GlassSelect
});