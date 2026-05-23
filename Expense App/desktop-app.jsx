// Desktop layout for the Glass expense app.
// Reuses styles, data, icons, and atomic components from the mobile version.
// Adds: full-viewport shell, sidebar nav, multi-column dashboard screens.

const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;

const DESKTOP_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "background": "mesh",
  "palette": "#fc618d",
  "accent": "#fc618d"
}/*EDITMODE-END*/;
const DESKTOP_INITIAL = { ...DESKTOP_DEFAULTS, ...((typeof window !== 'undefined' && window.APP_OVERRIDES) || {}) };

const PALETTES_D = [
  '#fc618d','#fd9353','#fce566','#7bd88f','#5ad4e6','#948ae3','#e3beae','#0e0e14',
];

/* ──────────────────────────────────────────────────────────────────────
   ROOT
   ────────────────────────────────────────────────────────────────────── */
function DesktopApp() {
  const [t, setTweak] = useTweaks(DESKTOP_INITIAL);
  const [view, setView] = useStateD('home');
  const [period, setPeriod] = useStateD('month');
  const [typeFilter, setTypeFilter] = useStateD('all');
  const [sheetOpen, setSheetOpen] = useStateD(false);
  const [addForm, setAddForm] = useStateD(null);
  const [editTxn, setEditTxn] = useStateD(null);
  const [toast, setToast] = useStateD(null);
  const [txns, setTxns] = useStateD(APP_DATA.txns);
  const [catalog, setCatalog] = useStateD({
    categories:    APP_DATA.categories,
    subcategories: APP_DATA.subcategories,
    accounts:      APP_DATA.accounts,
  });

  const isLight = t.theme === 'light';
  const toggleTheme = () => setTweak('theme', isLight ? 'dark' : 'light');

  function openAdd() { setSheetOpen(true); }
  function pickType(k) { setSheetOpen(false); setTimeout(() => setAddForm(k), 220); }
  function openEdit(txn) { setEditTxn(txn); }
  function closeForm() { setAddForm(null); setEditTxn(null); }
  function saveTxn(data) {
    if (editTxn) {
      setTxns(txns.map(t => t.id === editTxn.id ? { ...t, ...data } : t));
      setToast({ msg: 'Transaction updated', kind: editTxn.type });
    } else {
      const newTxn = {
        id: 'n' + Date.now(), type: addForm,
        amount: data.amount || 280,
        name: data.name || (addForm === 'income' ? 'New income' : 'New expense'),
        category: data.category || (addForm === 'income' ? 'Salary' : 'Food'),
        sub: data.sub || null,
        account: data.account || 'HDFC',
        date: data.date || new Date().toISOString(),
        icon: addForm === 'income' ? '💼' : '🍱',
      };
      setTxns([newTxn, ...txns]);
      setToast({ msg: `${addForm === 'income' ? 'Income' : 'Expense'} saved`, kind: addForm });
    }
    setAddForm(null);
    setEditTxn(null);
    setTimeout(() => setToast(null), 1800);
  }

  const appStyle = { '--seed': t.palette, '--accent': t.accent, '--accent-rgb': hexToRgbTriplet(t.accent || '#fc618d') };

  return (
    <div className="desktop-shell" data-page-theme={t.theme}>
      <div className="app desktop-app" data-theme={t.theme} style={appStyle}>
        <Background kind={t.background} />

        <Sidebar
          view={view} setView={setView}
          theme={t.theme} onToggleTheme={toggleTheme}
          onOpenAdd={openAdd}
        />

        <main className="desktop-main">
          <DesktopTopBar
            view={view}
            theme={t.theme}
            onToggleTheme={toggleTheme}
            onOpenAdd={openAdd}
          />
          <div className="desktop-content">
            {view === 'home'         && <HomeDesktop txns={txns} period={period} setPeriod={setPeriod} onGoto={setView} onOpenAdd={openAdd} setTypeFilter={setTypeFilter} onEdit={openEdit} />}
            {view === 'transactions' && <TransactionsDesktop txns={txns} period={period} setPeriod={setPeriod} typeFilter={typeFilter} setTypeFilter={setTypeFilter} onEdit={openEdit} />}
            {view === 'analytics'    && <AnalyticsDesktop txns={txns} period={period} setPeriod={setPeriod} />}
            {view === 'search'       && <SearchDesktop txns={txns} onEdit={openEdit} />}
            {view === 'manage'       && <ManageDesktop catalog={catalog} setCatalog={setCatalog} onBack={() => setView('home')} />}
            {view === 'appearance'   && <AppearanceDesktop t={t} setTweak={setTweak} />}
          </div>
        </main>

        {/* Add sheet (centered modal on desktop) */}
        <div className={`desktop-modal-backdrop ${sheetOpen?'show':''}`} onClick={() => setSheetOpen(false)}></div>
        <div className={`desktop-modal sheet ${sheetOpen?'show':''}`}>
          <div className="grabber"></div>
          <h3>New transaction</h3>
          <div className="modal-sub">What kind of entry are you adding?</div>
          <div className="type-choice">
            <div className="opt" onClick={() => pickType('expense')}>
              <div className="ic out"><Icon name="arrow-up-right" size={22}/></div>
              <div className="label">Expense</div>
              <div className="helper">Money going out — bills, food, transport, shopping.</div>
            </div>
            <div className="opt" onClick={() => pickType('income')}>
              <div className="ic in"><Icon name="arrow-down-left" size={22}/></div>
              <div className="label">Income</div>
              <div className="helper">Money coming in — salary, freelance, refunds, gifts.</div>
            </div>
          </div>
        </div>

        {(addForm || editTxn) && (
          <div className="desktop-modal-backdrop show" onClick={closeForm}>
            <div className="desktop-form-wrap" onClick={e => e.stopPropagation()}>
              <AddForm
                kind={addForm || editTxn.type}
                editTxn={editTxn}
                onClose={closeForm}
                onSave={saveTxn}
              />
            </div>
          </div>
        )}

        {toast && (
          <div className="desktop-toast">
            <span className="dot" style={{
              background: toast.kind === 'income' ? 'var(--income)' : 'var(--surface-active)',
              color: 'var(--surface-active-fg)'
            }}><Icon name="check" size={11} strokeWidth={2.2}/></span>
            {toast.msg}
          </div>
        )}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakRadio
            label="Theme"
            value={t.theme}
            options={[{value:'dark',label:'Dark'},{value:'light',label:'Light'}]}
            onChange={v => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection label="Palette">
          <TweakColor
            label="Hue"
            value={t.palette}
            options={PALETTES_D}
            onChange={v => setTweak('palette', v)}
          />
        </TweakSection>
        <TweakSection label="Background">
          <TweakRadio
            label="Style"
            value={t.background}
            options={[
              {value:'mesh',  label:'Mesh'},
              {value:'orbs',  label:'Orbs'},
              {value:'aurora',label:'Aurora'},
            ]}
            onChange={v => setTweak('background', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────────────────────────────────── */
function Sidebar({ view, setView, theme, onToggleTheme, onOpenAdd }) {
  const isDark = theme !== 'light';
  const items = [
    ['home',         'Overview',    'home'],
    ['transactions', 'Transactions','list'],
    ['analytics',    'Analytics',   'analytics'],
    ['search',       'Search',      'search'],
    ['appearance',   'Appearance',  'palette'],
    ['manage',       'Settings',    'settings'],
  ];
  return (
    <aside className="desktop-sidebar glass">
      <div className="sb-brand">
        <div className="sb-mark">C</div>
        <div>
          <div className="sb-name">CASEX</div>
          <div className="sb-tag">Expense ledger</div>
        </div>
      </div>

      <button className="sb-add" onClick={onOpenAdd}>
        <Icon name="plus" size={16}/> New transaction
      </button>

      <nav className="sb-nav">
        {items.map(([k, label, icon]) => (
          <button key={k} className={`sb-link ${view === k ? 'active' : ''}`} onClick={() => setView(k)}>
            <Icon name={icon} size={17} />
            <span>{label}</span>
            {view === k && <span className="sb-dot"></span>}
          </button>
        ))}
      </nav>

      <div className="sb-foot">
        <button className="sb-theme" onClick={onToggleTheme}>
          <Icon name={isDark ? 'sun' : 'moon'} size={15} />
          <span>{isDark ? 'Light theme' : 'Dark theme'}</span>
          <span className="sb-kbd">⌥T</span>
        </button>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   TOP BAR — greeting + actions
   ────────────────────────────────────────────────────────────────────── */
function DesktopTopBar({ view, theme, onToggleTheme, onOpenAdd }) {
  const titles = {
    home: ['Overview',     'A glance at your money this period.'],
    transactions: ['Transactions','Every entry, grouped by day.'],
    analytics: ['Analytics',     'Trends, categories, signals.'],
    search:    ['Search',        'Find any expense by range and filter.'],
    appearance:['Appearance',    'Theme, background, hue and button tint.'],
    manage:    ['Settings',      'Categories, subcategories, and accounts.'],
  };
  const [title, sub] = titles[view] || titles.home;
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
  return (
    <div className="desktop-topbar">
      <div>
        <div className="dt-date">{today}</div>
        <h1 className="dt-title">{title}</h1>
        <div className="dt-sub">{sub}</div>
      </div>
      <div className="dt-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} size={42} />
        <button className="dt-add" onClick={onOpenAdd}>
          <Icon name="plus" size={15}/> Add
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   HOME — overview dashboard
   ────────────────────────────────────────────────────────────────────── */
function HomeDesktop({ txns, period, setPeriod, onGoto, onOpenAdd, setTypeFilter, onEdit }) {
  const scoped = useMemoD(() => filterByPeriod(txns, period), [txns, period]);
  const sum = useMemoD(() => summarize(scoped), [scoped]);
  const recent = useMemoD(() =>
    [...txns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7),
    [txns]
  );
  const { sign, sym, whole, frac } = fmtParts(sum.net);
  const trend = useMemoD(() => buildTrendD(txns, period), [txns, period]);

  // category breakdown
  const catBreakdown = useMemoD(() => {
    const m = new Map();
    scoped.filter(t => t.type === 'expense').forEach(t => {
      if (!m.has(t.category)) m.set(t.category, { name: t.category, total: 0, icon: t.icon });
      m.get(t.category).total += t.amount;
    });
    const total = sum.expense || 1;
    return [...m.values()].map(c => ({ ...c, pct: c.total / total })).sort((a,b) => b.total - a.total);
  }, [scoped]);

  return (
    <div className="dt-grid">
      {/* Row 1: hero + period */}
      <GlassCard className="hero dt-hero">
        <div className="pill-tag">Net · {period === 'today' ? 'Today' : period === 'week' ? 'This week' : 'This month'}</div>
        <div className="label">Balance</div>
        <div className="balance">
          {sign && <span className="sym">{sign}</span>}
          <span className="sym">{sym}</span>
          <span>{whole}</span>
          <span className="frac">.{frac}</span>
        </div>
        <div className="dt-hero-foot">
          <PeriodTabs value={period} onChange={setPeriod} />
          <div className="dt-hero-meta">
            <span><b>{scoped.length}</b> entries this period</span>
            <span className="sep">·</span>
            <span><b>{catBreakdown.length}</b> categories</span>
          </div>
        </div>
      </GlassCard>

      {/* Row 2: 3 stat cards */}
      <GlassCard className="stat-card in dt-stat" onClick={() => { setTypeFilter('income'); onGoto('transactions'); }}>
        <div className="lbl">Income</div>
        <div className="val">+{fmtINR(sum.income, { withFrac:false })}</div>
        <div className="delta up"><Icon name="arrow-down-left" size={10}/> {scoped.filter(t => t.type==='income').length} entries</div>
      </GlassCard>
      <GlassCard className="stat-card out dt-stat" onClick={() => { setTypeFilter('expense'); onGoto('transactions'); }}>
        <div className="lbl">Expense</div>
        <div className="val">−{fmtINR(sum.expense, { withFrac:false })}</div>
        <div className="delta down"><Icon name="arrow-up-right" size={10}/> {scoped.filter(t => t.type==='expense').length} entries</div>
      </GlassCard>
      <GlassCard className="stat-card dt-stat dt-savings">
        <div className="lbl">Net savings</div>
        <div className="val" style={{ color: sum.net >= 0 ? 'var(--income)' : 'var(--expense)' }}>
          {sum.net >= 0 ? '+' : '−'}{fmtINR(Math.abs(sum.net), { withFrac:false })}
        </div>
        <div className="delta" style={{ background:'var(--glass-fill)', color:'var(--text-2)' }}>
          {sum.expense ? Math.round((sum.net / Math.max(sum.income, 1)) * 100) : 0}% of income
        </div>
      </GlassCard>

      {/* Row 3 left: recent transactions */}
      <GlassCard className="dt-card dt-recent">
        <div className="dt-card-head">
          <div className="title">Recent transactions</div>
          <div className="see-all" onClick={() => onGoto('transactions')}>See all <Icon name="chevron-right" size={12}/></div>
        </div>
        <div className="txn-list">
          {recent.map(t => <TxnRow key={t.id} t={t} onClick={onEdit ? () => onEdit(t) : undefined} />)}
        </div>
      </GlassCard>

      {/* Row 3 right: chart + categories */}
      <div className="dt-side">
        <GlassCard className="chart-card dt-card">
          <div className="head">
            <div className="title">Spend trend</div>
            <div className="legend">
              <span><span className="swatch" style={{ background:'var(--text-1)' }}></span>Expense</span>
              <span><span className="swatch" style={{ background:'var(--income)' }}></span>Income</span>
            </div>
          </div>
          <TrendChartD series={trend} />
        </GlassCard>
        <GlassCard className="chart-card dt-card">
          <div className="head">
            <div className="title">Top categories</div>
            <div className="legend">{catBreakdown.length} active</div>
          </div>
          {catBreakdown.length === 0 ? (
            <div className="empty"><div className="ic">⌀</div>No expenses yet.</div>
          ) : catBreakdown.slice(0, 5).map(c => (
            <div key={c.name} className="cat-row">
              <div className="ic">{c.icon}</div>
              <div className="meta">
                <div className="name">{c.name}</div>
                <div className="bar"><div style={{ width: `${Math.max(6, c.pct * 100)}%` }}></div></div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="amt">{fmtINR(c.total, { withFrac:false })}</div>
                <div className="pct">{(c.pct*100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   TRANSACTIONS — full table-like list
   ────────────────────────────────────────────────────────────────────── */
function TransactionsDesktop({ txns, period, setPeriod, typeFilter, setTypeFilter, onEdit }) {
  const scoped = useMemoD(() => filterByPeriod(txns, period), [txns, period]);
  const filtered = useMemoD(() => typeFilter==='all' ? scoped : scoped.filter(t => t.type === typeFilter), [scoped, typeFilter]);
  const groups = useMemoD(() => groupByDay(filtered), [filtered]);
  const sum = useMemoD(() => summarize(filtered), [filtered]);

  return (
    <div className="dt-tx">
      <div className="dt-tx-toolbar">
        <PeriodTabs value={period} onChange={setPeriod} />
        <TypeTabs value={typeFilter} onChange={setTypeFilter} />
      </div>

      <div className="dt-tx-summary">
        <GlassCard className="dt-card dt-sum">
          <div className="lbl">{typeFilter==='all' ? 'Net flow' : typeFilter==='income' ? 'Total income' : 'Total spent'}</div>
          <div className="val">
            {typeFilter==='income' ? '+' : typeFilter==='expense' ? '−' : sum.net >= 0 ? '+' : '−'}
            {fmtINR(typeFilter==='income' ? sum.income : typeFilter==='expense' ? sum.expense : Math.abs(sum.net), { withFrac:false })}
          </div>
        </GlassCard>
        <GlassCard className="dt-card dt-sum">
          <div className="lbl">Entries</div>
          <div className="val">{filtered.length}</div>
        </GlassCard>
        <GlassCard className="dt-card dt-sum">
          <div className="lbl">Average</div>
          <div className="val">
            {fmtINR(filtered.length ? Math.round((typeFilter==='income' ? sum.income : sum.expense) / Math.max(filtered.length,1)) : 0, { withFrac:false })}
          </div>
        </GlassCard>
        <GlassCard className="dt-card dt-sum">
          <div className="lbl">Top day</div>
          <div className="val" style={{ fontSize: 20 }}>
            {groups[0] ? dayLabel(groups[0].date) : '—'}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="dt-card dt-tx-list">
        {filtered.length === 0 && (
          <div className="empty"><div className="ic">∅</div>No transactions in this view.</div>
        )}
        {groups.map((g, i) => (
          <div key={i}>
            <DayHead d={g.date} net={g.net} />
            <div className="txn-list">
              {g.items.map(t => <TxnRow key={t.id} t={t} onClick={onEdit ? () => onEdit(t) : undefined} />)}
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ANALYTICS — chart grid
   ────────────────────────────────────────────────────────────────────── */
function AnalyticsDesktop({ txns, period, setPeriod }) {
  const scoped = useMemoD(() => filterByPeriod(txns, period), [txns, period]);
  const sum = useMemoD(() => summarize(scoped), [scoped]);
  const trend = useMemoD(() => buildTrendD(txns, period), [txns, period]);

  const catBreakdown = useMemoD(() => {
    const m = new Map();
    scoped.filter(t => t.type==='expense').forEach(t => {
      if (!m.has(t.category)) m.set(t.category, { name: t.category, total: 0, icon: t.icon });
      m.get(t.category).total += t.amount;
    });
    const total = sum.expense || 1;
    return [...m.values()].map(c => ({ ...c, pct: c.total/total })).sort((a,b) => b.total - a.total);
  }, [scoped]);

  const accountBreakdown = useMemoD(() => {
    const m = new Map();
    scoped.filter(t => t.type==='expense').forEach(t => {
      if (!m.has(t.account)) m.set(t.account, { name: t.account, total: 0 });
      m.get(t.account).total += t.amount;
    });
    const total = sum.expense || 1;
    return [...m.values()].map(a => ({ ...a, pct: a.total/total })).sort((a,b) => b.total - a.total);
  }, [scoped]);

  return (
    <div className="dt-an">
      <div className="dt-tx-toolbar">
        <PeriodTabs value={period} onChange={setPeriod} />
      </div>

      <div className="dt-an-grid">
        <GlassCard className="stat-card in dt-stat">
          <div className="lbl">Income</div>
          <div className="val">{fmtINR(sum.income, { withFrac:false })}</div>
          <div className="delta up"><Icon name="trend-up" size={10}/> +12.4%</div>
        </GlassCard>
        <GlassCard className="stat-card out dt-stat">
          <div className="lbl">Spent</div>
          <div className="val">{fmtINR(sum.expense, { withFrac:false })}</div>
          <div className="delta down"><Icon name="arrow-up-right" size={10}/> +4.1%</div>
        </GlassCard>
        <GlassCard className="stat-card dt-stat">
          <div className="lbl">Savings rate</div>
          <div className="val">{sum.income ? Math.round((sum.net/sum.income)*100) : 0}%</div>
          <div className="delta" style={{ background:'var(--glass-fill)', color:'var(--text-2)' }}>
            target 30%
          </div>
        </GlassCard>
        <GlassCard className="stat-card dt-stat">
          <div className="lbl">Avg / day</div>
          <div className="val">{fmtINR(Math.round(sum.expense/Math.max(trend.length,1)), { withFrac:false })}</div>
          <div className="delta" style={{ background:'var(--glass-fill)', color:'var(--text-2)' }}>
            over {trend.length} days
          </div>
        </GlassCard>

        <GlassCard className="chart-card dt-card dt-an-chart">
          <div className="head">
            <div className="title">Spend trend</div>
            <div className="legend">
              <span><span className="swatch" style={{ background:'var(--text-1)' }}></span>Expense</span>
              <span><span className="swatch" style={{ background:'var(--income)' }}></span>Income</span>
            </div>
          </div>
          <TrendChartD series={trend} height={220} />
        </GlassCard>

        <GlassCard className="chart-card dt-card">
          <div className="head"><div className="title">By category</div><div className="legend">{catBreakdown.length} active</div></div>
          {catBreakdown.length === 0
            ? <div className="empty"><div className="ic">⌀</div>No expenses.</div>
            : catBreakdown.slice(0,8).map(c => (
              <div key={c.name} className="cat-row">
                <div className="ic">{c.icon}</div>
                <div className="meta">
                  <div className="name">{c.name}</div>
                  <div className="bar"><div style={{ width: `${Math.max(6, c.pct*100)}%` }}></div></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="amt">{fmtINR(c.total, { withFrac:false })}</div>
                  <div className="pct">{(c.pct*100).toFixed(0)}%</div>
                </div>
              </div>
            ))
          }
        </GlassCard>

        <GlassCard className="chart-card dt-card">
          <div className="head"><div className="title">By account</div><div className="legend">{accountBreakdown.length} used</div></div>
          {accountBreakdown.length === 0
            ? <div className="empty"><div className="ic">⌀</div>No expenses.</div>
            : accountBreakdown.map(a => (
              <div key={a.name} className="cat-row">
                <AccountBadge account={a.name} size={34}/>
                <div className="meta">
                  <div className="name">{a.name}</div>
                  <div className="bar"><div style={{ width: `${Math.max(6, a.pct*100)}%` }}></div></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="amt">{fmtINR(a.total, { withFrac:false })}</div>
                  <div className="pct">{(a.pct*100).toFixed(0)}%</div>
                </div>
              </div>
            ))
          }
        </GlassCard>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   SEARCH — desktop two-column form + results
   ────────────────────────────────────────────────────────────────────── */
function SearchDesktop({ txns, onEdit }) {
  return (
    <div className="dt-search">
      <SearchScreen txns={txns} onEdit={onEdit} />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────
   MANAGE / SETTINGS — reuse the mobile ManageScreen in a centred column
   ─────────────────────────────────────────────────────────────────── */
function ManageDesktop({ catalog, setCatalog, onBack }) {
  return (
    <div className="dt-manage">
      <ManageScreen catalog={catalog} setCatalog={setCatalog} onBack={onBack} />
    </div>
  );
}

function AppearanceDesktop({ t, setTweak }) {
  return (
    <div className="dt-appearance">
      <AppearanceScreen t={t} setTweak={setTweak} palettes={PALETTES_D} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Helpers — TrendChart copy (slightly larger viewport) & buildTrend
   ────────────────────────────────────────────────────────────────────── */
function buildTrendD(txns, period) {
  const days = period === 'today' ? 7 : period === 'week' ? 7 : 14;
  const today = new Date(); today.setHours(0,0,0,0);
  const buckets = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate()-i);
    buckets.push({ date: d, income: 0, expense: 0 });
  }
  for (const t of txns) {
    const d = new Date(t.date); d.setHours(0,0,0,0);
    const idx = buckets.findIndex(b => b.date.getTime() === d.getTime());
    if (idx >= 0) {
      if (t.type === 'income') buckets[idx].income += t.amount;
      else buckets[idx].expense += t.amount;
    }
  }
  return buckets;
}

function TrendChartD({ series, height = 160 }) {
  const W = 560, H = height, P = 14;
  const max = Math.max(1, ...series.map(b => Math.max(b.expense, b.income)));
  const x = i => P + i * (W - 2*P) / Math.max(1, series.length-1);
  const y = v => H - P - (v/max) * (H - 2*P);

  const linePath = (key) => {
    const pts = series.map((b,i) => [x(i), y(b[key])]);
    if (!pts.length) return '';
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px,py] = pts[i-1];
      const [cx,cy] = pts[i];
      const mx = (px+cx)/2;
      d += ` Q ${px},${py} ${mx},${(py+cy)/2}`;
      d += ` T ${cx},${cy}`;
    }
    return d;
  };
  const areaPath = (key) => {
    const base = linePath(key);
    if (!base) return '';
    return `${base} L ${x(series.length-1)},${H-P} L ${x(0)},${H-P} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <defs>
        <linearGradient id="expGradD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.32)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)"/>
        </linearGradient>
        <linearGradient id="incGradD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(123,227,168,0.30)"/>
          <stop offset="100%" stopColor="rgba(123,227,168,0.0)"/>
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75].map(p => (
        <line key={p} x1={P} x2={W-P} y1={P+p*(H-2*P)} y2={P+p*(H-2*P)} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      ))}
      <path d={areaPath('expense')} fill="url(#expGradD)"/>
      <path d={linePath('expense')} fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={areaPath('income')} fill="url(#incGradD)"/>
      <path d={linePath('income')} fill="none" stroke="var(--income)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={x(series.length-1)} cy={y(series[series.length-1].expense)} r="3.5" fill="currentColor"/>
      <circle cx={x(series.length-1)} cy={y(series[series.length-1].income)}  r="3" fill="var(--income)"/>
    </svg>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DesktopApp />);
