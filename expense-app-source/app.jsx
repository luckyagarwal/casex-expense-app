// Mobile PWA root — full-viewport (no iOS chrome), localStorage tweaks, D1-backed data.
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useCallback: useCallbackA } = React;

const APP_DEFAULTS = {
  theme: 'dark',
  background: 'mesh',
  palette: '#fc618d',
  accent: '#fc618d',
};

const PALETTES = ['#fc618d','#fd9353','#fce566','#7bd88f','#5ad4e6','#948ae3','#e3beae','#0e0e14'];
const STORAGE_KEY = 'casex.glass.tweaks';

// localStorage-backed tweak hook (replaces the prototype's host-iframe useTweaks).
function useLocalTweaks(defaults) {
  const [values, setValues] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {}
    return defaults;
  });
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => {
      const next = { ...prev, ...edits };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);
  return [values, setTweak];
}

// Server returns {type, value}; client renders the resolved emoji or SVG string.
function resolveIcon(iconObj, fallback = '') {
  if (!iconObj) return fallback;
  if (typeof iconObj === 'string') return iconObj;
  const { type, value } = iconObj;
  if (!value) return fallback;
  if (type === 'emoji') return value;
  if (type === 'lucide') {
    const hit = (window.ICONS_LIB || []).find(i => i.key === 'lucide:' + value);
    return hit ? hit.svg : fallback;
  }
  if (type === 'bank') {
    const hit = (window.BANK_LOGOS || []).find(i => i.key === 'bank:' + value);
    return hit ? hit.svg : fallback;
  }
  if (type === 'brand') {
    const hit = (window.BRANDS_LIB || []).find(i => i.key === 'brand:' + value);
    return hit ? hit.svg : fallback;
  }
  if (type === 'image') return value;
  return fallback;
}

// Convert client icon string back into the API's {emoji, iconUrl} shape.
function iconToApiPayload(iconStr) {
  if (!iconStr) return { emoji: null, iconUrl: null };
  if (iconStr.startsWith('<svg')) {
    const inLib = (lib) => (lib || []).find(i => i.svg === iconStr);
    const hit = inLib(window.ICONS_LIB) || inLib(window.BANK_LOGOS) || inLib(window.BRANDS_LIB);
    if (hit) return { emoji: null, iconUrl: hit.key };
    return { emoji: null, iconUrl: null };
  }
  return { emoji: iconStr, iconUrl: null };
}

function mapCatalog(boot) {
  return {
    categories:    (boot.categories || []).map(c => ({ id: c.id, name: c.name, icon: resolveIcon(c.icon, '📁') })),
    subcategories: (boot.subcategories || []).map(s => ({ id: s.id, categoryId: s.categoryId, name: s.name, icon: resolveIcon(s.icon, '🏷️') })),
    accounts:      (boot.accounts || []).map(a => ({ id: a.id, name: a.name, icon: resolveIcon(a.icon, '🏦'), tail: null })),
  };
}

function mapTxns(rows) {
  return (rows || []).map(r => ({
    id: r.id,
    type: r.txnType,
    amount: r.amount,
    name: r.name || r.category || (r.txnType === 'income' ? 'Income' : 'Expense'),
    category: r.category || '',
    sub: r.subcategory || null,
    account: r.account || '',
    date: r.date,
    icon: resolveIcon(r.categoryIcon || r.subcategoryIcon, r.txnType === 'income' ? '💼' : '💸'),
    subIcon: resolveIcon(r.subcategoryIcon, null),
    categoryId: r.categoryId, subcategoryId: r.subcategoryId, accountId: r.accountId,
  }));
}

async function apiJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

function App() {
  const [t, setTweak] = useLocalTweaks(APP_DEFAULTS);
  const [view, setView] = useStateA('home');
  const [period, setPeriod] = useStateA('month');
  const [typeFilter, setTypeFilter] = useStateA('all');
  const [sheetOpen, setSheetOpen] = useStateA(false);
  const [addForm, setAddForm] = useStateA(null);
  const [editTxn, setEditTxn] = useStateA(null);
  const [detailTxn, setDetailTxn] = useStateA(null);
  const [toast, setToast] = useStateA(null);
  const [txns, setTxns] = useStateA([]);
  const [catalog, setCatalog] = useStateA({ categories: [], subcategories: [], accounts: [] });
  const [loading, setLoading] = useStateA(true);

  const reloadCatalog = useCallbackA(async () => {
    try {
      const boot = await apiJson('/api/d1/bootstrap');
      setCatalog(mapCatalog(boot));
    } catch (e) { console.warn('bootstrap failed', e); }
  }, []);

  const reloadTxns = useCallbackA(async (p) => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const r = await apiJson('/api/d1/expenses?period=' + p + '&timeZone=' + encodeURIComponent(tz));
      setTxns(mapTxns(r.expenses));
    } catch (e) { console.warn('txns failed', e); }
  }, []);

  useEffectA(() => {
    (async () => {
      setLoading(true);
      await Promise.all([reloadCatalog(), reloadTxns(period)]);
      setLoading(false);
    })();
  }, []);
  useEffectA(() => { reloadTxns(period); }, [period, reloadTxns]);

  function goto(v, opts = {}) { if (opts.typeFilter) setTypeFilter(opts.typeFilter); setView(v); }
  function openAdd() { setSheetOpen(true); }
  function pickType(k) { setSheetOpen(false); setTimeout(() => setAddForm(k), 240); }
  function openDetail(txn) { setDetailTxn(txn); }
  function closeDetail() { setDetailTxn(null); }
  function openEdit(txn) { setDetailTxn(null); setEditTxn(txn); }
  function closeForm() { setAddForm(null); setEditTxn(null); }

  async function deleteTxn(txn) {
    try {
      await apiJson('/api/d1/expense/' + txn.id + '?type=' + (txn.type || 'expense'), { method: 'DELETE' });
      await reloadTxns(period);
      setDetailTxn(null);
      flashToast('Transaction deleted', txn.type);
    } catch (e) {
      flashToast('Failed to delete', 'expense');
    }
  }

  function flashToast(msg, kind) {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 1800);
  }

  async function saveTxn(form) {
    const cat = (catalog.categories || []).find(c => c.name === form.cat);
    const sub = (catalog.subcategories || []).find(s => s.name === form.sub);
    const acc = (catalog.accounts || []).find(a => a.name === form.acc);
    const body = {
      amount: form.amount,
      note: form.name || '',
      txnType: form.type,
      date: form.date || new Date().toISOString(),
      categoryId: cat ? cat.id : null,
      subcategoryId: sub ? sub.id : null,
      accountId: acc ? acc.id : null,
    };
    try {
      if (form.editTxn) {
        await apiJson('/api/d1/expense/' + form.editTxn.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        flashToast('Transaction updated', form.type);
      } else {
        await apiJson('/api/d1/expense', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        flashToast((form.type === 'income' ? 'Income' : 'Expense') + ' saved', form.type);
      }
      await reloadTxns(period);
      closeForm();
    } catch (e) {
      flashToast('Failed to save', 'expense');
    }
  }

  // ManageScreen mutates a local `catalog`; this wrapper diffs old vs new and pushes API calls.
  const setCatalogApi = useCallbackA((next) => {
    const prev = catalog;
    setCatalog(next);
    (async () => {
      for (const table of ['categories', 'subcategories', 'accounts']) {
        const oldList = prev[table] || [];
        const newList = next[table] || [];
        const oldById = new Map(oldList.map(x => [x.id, x]));
        const newById = new Map(newList.map(x => [x.id, x]));
        for (const item of newList) {
          if (!oldById.has(item.id)) {
            const payload = { name: item.name, ...iconToApiPayload(item.icon) };
            try { await apiJson('/api/d1/' + table, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); }
            catch (e) { console.warn('add failed', e); }
          }
        }
        for (const item of newList) {
          const old = oldById.get(item.id);
          if (old && (old.name !== item.name || old.icon !== item.icon)) {
            const payload = { name: item.name, ...iconToApiPayload(item.icon) };
            try { await apiJson('/api/d1/' + table + '/' + item.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); }
            catch (e) { console.warn('update failed', e); }
          }
        }
        for (const item of oldList) {
          if (!newById.has(item.id)) {
            try { await apiJson('/api/d1/' + table + '/' + item.id, { method: 'DELETE' }); }
            catch (e) { console.warn('delete failed', e); }
          }
        }
      }
      await reloadCatalog();
    })();
  }, [catalog, reloadCatalog]);

  const accentRgb = hexToRgbTriplet(t.accent || '#fc618d');
  const appStyle = { '--seed': t.palette, '--accent': t.accent, '--accent-rgb': accentRgb, position: 'fixed', inset: 0, height: '100dvh', width: '100vw' };
  const isLight = t.theme === 'light';
  const toggleTheme = () => setTweak('theme', isLight ? 'dark' : 'light');

  useEffectA(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    const meta = document.getElementById('themeColorMeta');
    if (meta) meta.setAttribute('content', isLight ? '#f5ece2' : '#050507');
  }, [t.theme]);

  return (
    <div className="app" data-theme={t.theme} style={appStyle}>
      <Background kind={t.background} />

      <div className="screen" style={{ position:'relative', zIndex: 1 }}>
        {view === 'home' && (
          <HomeScreen txns={txns} period={period} setPeriod={setPeriod} onOpenAdd={openAdd} onGoto={goto} theme={t.theme} onToggleTheme={toggleTheme} onEdit={openDetail} />
        )}
        {view === 'transactions' && (
          <TransactionsScreen txns={txns} period={period} setPeriod={setPeriod} typeFilter={typeFilter} setTypeFilter={setTypeFilter} theme={t.theme} onToggleTheme={toggleTheme} onEdit={openDetail} />
        )}
        {view === 'analytics' && (
          <AnalyticsScreen txns={txns} period={period} setPeriod={setPeriod} theme={t.theme} onToggleTheme={toggleTheme} />
        )}
        {view === 'search' && (
          <SearchScreen txns={txns} theme={t.theme} onToggleTheme={toggleTheme} onEdit={openDetail} />
        )}
        {view === 'manage' && (
          <ManageScreen catalog={catalog} setCatalog={setCatalogApi} onBack={() => setView('home')} />
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

      {detailTxn && (
        <TxnDetailSheet
          txn={detailTxn}
          catalog={catalog}
          onClose={closeDetail}
          onEdit={() => openEdit(detailTxn)}
          onDelete={() => deleteTxn(detailTxn)}
        />
      )}

      {(addForm || editTxn) && <AddForm kind={addForm || editTxn.type} editTxn={editTxn} onClose={closeForm} onSave={saveTxn} catalog={catalog} />}

      {toast && (
        <div style={{
          position:'fixed', bottom: 110, left: '50%', transform:'translateX(-50%)', zIndex: 70,
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

      {loading && txns.length === 0 && (
        <div style={{ position:'absolute', top: 80, left: 0, right: 0, textAlign:'center', color:'var(--text-3)', fontSize: 12, zIndex: 5 }}>
          Loading…
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
