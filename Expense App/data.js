// Sample INR data for the glass expense app prototype.
// Categories and accounts match the seed.sql vibe.

window.APP_DATA = (() => {
  const today = new Date();
  const d = (offsetDays, h = 13, m = 0) => {
    const x = new Date(today);
    x.setDate(x.getDate() - offsetDays);
    x.setHours(h, m, 0, 0);
    return x.toISOString();
  };

  const txns = [
    // Today
    { id: 't1',  type: 'expense', amount: 482,    name: 'Swiggy',          category: 'Food',      sub: 'Order',    account: 'ICICI Credit', date: d(0, 13, 24), icon: '🍱' },
    { id: 't2',  type: 'expense', amount: 219,    name: 'Blinkit',         category: 'Groceries', sub: 'Quick',    account: 'HDFC',         date: d(0, 11, 12), icon: '🛒' },
    { id: 't3',  type: 'expense', amount: 180,    name: 'Auto rickshaw',   category: 'Transport', sub: 'Auto',     account: 'Cash',         date: d(0,  9, 45), icon: '🛺' },
    // Yesterday
    { id: 't4',  type: 'income',  amount: 85000,  name: 'Monthly salary',  category: 'Salary',    sub: null,       account: 'SBI Savings',  date: d(1, 10,  3), icon: '💼' },
    { id: 't5',  type: 'expense', amount: 1249,   name: 'Uber',            category: 'Transport', sub: 'Cab',      account: 'ICICI Credit', date: d(1, 19, 28), icon: '🚕' },
    { id: 't6',  type: 'expense', amount: 649,    name: 'Netflix',         category: 'Subs',      sub: 'OTT',      account: 'HDFC',         date: d(1, 14,  0), icon: '🎬' },
    // 2 days ago
    { id: 't7',  type: 'expense', amount: 3420,   name: 'Big Bazaar',      category: 'Groceries', sub: 'Monthly',  account: 'HDFC',         date: d(2, 17, 50), icon: '🥬' },
    { id: 't8',  type: 'expense', amount: 280,    name: 'Blue Tokai',      category: 'Cafe',      sub: 'Coffee',   account: 'Cash',         date: d(2, 10, 20), icon: '☕' },
    // 3 days ago
    { id: 't9',  type: 'expense', amount: 28000,  name: 'Rent — Nov',      category: 'Housing',   sub: 'Rent',     account: 'SBI Savings',  date: d(3,  9,  0), icon: '🏠' },
    { id: 't10', type: 'income',  amount: 15000,  name: 'Design freelance',category: 'Freelance', sub: null,       account: 'SBI Savings',  date: d(3, 16, 18), icon: '✏️' },
    { id: 't11', type: 'expense', amount: 749,    name: 'Airtel postpaid', category: 'Bills',     sub: 'Phone',    account: 'HDFC',         date: d(3, 12,  0), icon: '📱' },
    // 4 days ago
    { id: 't12', type: 'expense', amount: 2400,   name: 'Electricity',     category: 'Bills',     sub: 'Utility',  account: 'HDFC',         date: d(4, 11, 30), icon: '💡' },
    { id: 't13', type: 'expense', amount: 820,    name: 'PVR Inox',        category: 'Entertain', sub: 'Movie',    account: 'ICICI Credit', date: d(4, 20,  5), icon: '🎟️' },
    // 5 days ago
    { id: 't14', type: 'expense', amount: 390,    name: 'Zomato',          category: 'Food',      sub: 'Order',    account: 'ICICI Credit', date: d(5, 21, 10), icon: '🍜' },
    { id: 't15', type: 'expense', amount: 1180,   name: 'Petrol',          category: 'Transport', sub: 'Fuel',     account: 'HDFC',         date: d(5,  8, 22), icon: '⛽' },
    { id: 't16', type: 'income',  amount: 4500,   name: 'Cashback — Cred', category: 'Other',     sub: null,       account: 'ICICI Credit',date: d(5, 13,  0), icon: '💸' },
    // older
    { id: 't17', type: 'expense', amount: 1850,   name: 'Decathlon',       category: 'Shopping',  sub: 'Sport',    account: 'HDFC',         date: d(6, 16,  0), icon: '🎽' },
    { id: 't18', type: 'expense', amount: 459,    name: 'Apollo Pharmacy', category: 'Health',    sub: 'Meds',     account: 'Cash',         date: d(6, 19,  0), icon: '💊' },
    { id: 't19', type: 'expense', amount: 199,    name: 'Spotify',         category: 'Subs',      sub: 'Music',    account: 'HDFC',         date: d(7, 10,  0), icon: '🎧' },
    { id: 't20', type: 'expense', amount: 5499,   name: 'Amazon',          category: 'Shopping',  sub: 'Online',   account: 'ICICI Credit', date: d(7, 22, 13), icon: '📦' },
  ];

  const categories = [
    { id: 'c1',  name: 'Food',       icon: '🍱' },
    { id: 'c2',  name: 'Groceries',  icon: '🛒' },
    { id: 'c3',  name: 'Transport',  icon: '🚕' },
    { id: 'c4',  name: 'Bills',      icon: '💡' },
    { id: 'c5',  name: 'Subs',       icon: '🎬' },
    { id: 'c6',  name: 'Housing',    icon: '🏠' },
    { id: 'c7',  name: 'Cafe',       icon: '☕' },
    { id: 'c8',  name: 'Shopping',   icon: '🛍️' },
    { id: 'c9',  name: 'Health',     icon: '💊' },
    { id: 'c10', name: 'Entertain',  icon: '🎟️' },
  ];

  const subcategories = [
    { id: 's1',  categoryId: 'c1',  name: 'Order',    icon: '🛵' },
    { id: 's2',  categoryId: 'c1',  name: 'Dine-in',  icon: '🍽️' },
    { id: 's3',  categoryId: 'c2',  name: 'Quick',    icon: '⚡' },
    { id: 's4',  categoryId: 'c2',  name: 'Monthly',  icon: '📅' },
    { id: 's5',  categoryId: 'c3',  name: 'Auto',     icon: '🛺' },
    { id: 's6',  categoryId: 'c3',  name: 'Cab',      icon: '🚖' },
    { id: 's7',  categoryId: 'c3',  name: 'Fuel',     icon: '⛽' },
    { id: 's8',  categoryId: 'c3',  name: 'Metro',    icon: '🚇' },
    { id: 's9',  categoryId: 'c4',  name: 'Phone',    icon: '📱' },
    { id: 's10', categoryId: 'c4',  name: 'Utility',  icon: '💡' },
    { id: 's11', categoryId: 'c4',  name: 'Internet', icon: '📡' },
    { id: 's12', categoryId: 'c5',  name: 'OTT',      icon: '📺' },
    { id: 's13', categoryId: 'c5',  name: 'Music',    icon: '🎧' },
    { id: 's14', categoryId: 'c6',  name: 'Rent',     icon: '🔑' },
    { id: 's15', categoryId: 'c7',  name: 'Coffee',   icon: '☕' },
    { id: 's16', categoryId: 'c8',  name: 'Online',   icon: '📦' },
    { id: 's17', categoryId: 'c8',  name: 'Sport',    icon: '🎽' },
    { id: 's18', categoryId: 'c9',  name: 'Meds',     icon: '💊' },
    { id: 's19', categoryId: 'c9',  name: 'Doctor',   icon: '🩺' },
    { id: 's20', categoryId: 'c10', name: 'Movie',    icon: '🎟️' },
  ];

  const accounts = [
    { id: 'a1', name: 'HDFC',         tail: '4209', icon: '🏦' },
    { id: 'a2', name: 'ICICI Credit', tail: '8821', icon: '💳' },
    { id: 'a3', name: 'SBI Savings',  tail: '0314', icon: '🏛️' },
    { id: 'a4', name: 'Cash',         tail: null,   icon: '💵' },
    { id: 'a5', name: 'GPay UPI',     tail: null,   icon: '📲' },
  ];

  return { txns, categories, subcategories, accounts };
})();
