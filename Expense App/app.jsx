// Root app: device frame + screens + bottom nav + sheet + tweaks panel.
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const APP_DEFAULTS_BASE = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "background": "mesh",
  "palette": "#fc618d",
  "accent": "#fc618d"
}/*EDITMODE-END*/;
// Per-page overrides (set inline before app.jsx loads, e.g. in the Light/Desktop variants)
const APP_DEFAULTS = { ...APP_DEFAULTS_BASE, ...((typeof window !== 'undefined' && window.APP_OVERRIDES) || {}) };

// Monokai Spectrum accent seeds — each drives the mesh background bloom.
const PALETTES = [
  '#fc618d', // Monokai magenta (default)
  '#fd9353', // orange
  '#fce566', // yellow
  '#7bd88f', // green
  '#5ad4e6', // cyan
  '#948ae3', // purple
  '#e3beae', // peach
  '#0e0e14', // ink
];

function App() {
  const [t, setTweak] = useTweaks(APP_DEFAULTS);
  const [view, setView] = useStateA('home');
  const [period, setPeriod] = useStateA('month');
  const [typeFilter, setTypeFilter] = useStateA('all');
  const [sheetOpen, setSheetOpen] = useStateA(false);
  const [addForm, setAddForm] = useStateA(null);
  const [editTxn, setEditTxn] = useStateA(null);
  const [toast, setToast] = useStateA(null);
  const [txns, setTxns] = useStateA(APP_DATA.txns);
  const [catalog, setCatalog] = useStateA({
    categories:    APP_DATA.categories,
    subcategories: APP_DATA.subcategories,
    accounts:      APP_DATA.accounts,
  });

  function goto(v, opts = {}) {
    if (opts.typeFilter) setTypeFilter(opts.typeFilter);
    setView(v === 'transactions' ? 'transactions' : v);
  }

  function openAdd() { setSheetOpen(true); }
  function pickType(k) { setSheetOpen(false); setTimeout(() => setAddForm(k), 240); }
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

  // Apply --seed, --accent, and data-theme to the .app element via inline style + attr
  const accentRgb = hexToRgbTriplet(t.accent || '#fc618d');
  const appStyle = { '--seed': t.palette, '--accent': t.accent, '--accent-rgb': accentRgb };
  const isLight = t.theme === 'light';
  const toggleTheme = () => setTweak('theme', isLight ? 'dark' : 'light');

  return (
    <div className="page" data-page-theme={t.theme}>
      <IOSDevice dark={!isLight} width={402} height={874}>
      <div className="app" data-theme={t.theme} style={appStyle}>
        <Background kind={t.background} />

        <div className="screen" style={{ position:'relative', zIndex: 1 }}>
          {view === 'home' && (
            <HomeScreen txns={txns} period={period} setPeriod={setPeriod} onOpenAdd={openAdd} onGoto={goto} theme={t.theme} onToggleTheme={toggleTheme} onEdit={openEdit} />
          )}
          {view === 'transactions' && (
            <TransactionsScreen txns={txns} period={period} setPeriod={setPeriod}
              typeFilter={typeFilter} setTypeFilter={setTypeFilter} theme={t.theme} onToggleTheme={toggleTheme} onEdit={openEdit} />
          )}
          {view === 'analytics' && (
            <AnalyticsScreen txns={txns} period={period} setPeriod={setPeriod} theme={t.theme} onToggleTheme={toggleTheme} />
          )}
          {view === 'search' && (
            <SearchScreen txns={txns} theme={t.theme} onToggleTheme={toggleTheme} />
          )}
          {view === 'manage' && (
            <ManageScreen catalog={catalog} setCatalog={setCatalog} onBack={() => setView('home')} />
          )}
          {view === 'appearance' && (
            <AppearanceScreen t={t} setTweak={setTweak} onBack={() => setView('home')} palettes={PALETTES} />
          )}
        </div>

        {view !== 'manage' && view !== 'appearance' && (
          <div className="bottom-nav-wrap">
            <nav className="bottom-nav">
              <button className={`nav-tab ${view==='home'?'active':''}`} onClick={() => setView('home')} aria-label="Home"><Icon name="home" size={18}/></button>
              <button className={`nav-tab ${view==='transactions'?'active':''}`} onClick={() => setView('transactions')} aria-label="Transactions"><Icon name="list" size={18}/></button>
              <button className="nav-tab add" onClick={openAdd} aria-label="Add"><Icon name="plus" size={20}/></button>
              <button className={`nav-tab ${view==='analytics'?'active':''}`} onClick={() => setView('analytics')} aria-label="Analytics"><Icon name="analytics" size={18}/></button>
              <button className={`nav-tab ${view==='search'?'active':''}`} onClick={() => setView('search')} aria-label="Search"><Icon name="search" size={18}/></button>
            </nav>
          </div>
        )}

        {/* Add type sheet */}
        <div className={`sheet-backdrop ${sheetOpen?'show':''}`} onClick={() => setSheetOpen(false)}></div>
        <div className={`sheet ${sheetOpen?'show':''}`}>
          <div className="grabber"></div>
          <h3>New transaction</h3>
          <div className="type-choice">
            <div className="opt" onClick={() => pickType('expense')}>
              <div className="ic out"><Icon name="arrow-up-right" size={18}/></div>
              <div className="label">Expense</div>
              <div className="helper">Money going out</div>
            </div>
            <div className="opt" onClick={() => pickType('income')}>
              <div className="ic in"><Icon name="arrow-down-left" size={18}/></div>
              <div className="label">Income</div>
              <div className="helper">Money coming in</div>
            </div>
          </div>
        </div>

        {(addForm || editTxn) && (
          <AddForm
            kind={addForm || editTxn.type}
            editTxn={editTxn}
            onClose={closeForm}
            onSave={saveTxn}
          />
        )}

        {toast && (
          <div style={{
            position:'absolute', bottom: 100, left: '50%', transform:'translateX(-50%)', zIndex: 70,
            padding:'10px 18px', borderRadius:999,
            background: isLight ? 'rgba(250,248,253,0.9)' : 'rgba(20,20,26,0.85)',
            backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
            boxShadow:'inset 0 1px 0 var(--inner-highlight), 0 12px 30px rgba(0,0,0,0.5)',
            color:'var(--text-1)', fontSize: 13, fontWeight: 500,
            display:'flex', alignItems:'center', gap: 8,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: toast.kind === 'income' ? 'var(--income)' : 'var(--surface-active)',
              color: 'var(--surface-active-fg)', display:'flex', alignItems:'center', justifyContent:'center'
            }}><Icon name="check" size={11} strokeWidth={2.2}/></span>
            {toast.msg}
          </div>
        )}
      </div>
      </IOSDevice>

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
            options={PALETTES}
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

function Root() {
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
