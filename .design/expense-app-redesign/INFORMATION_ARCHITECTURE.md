# Information Architecture: Expense App Redesign

## Site Map

Single-page application. No URL router — navigation is view-state based. Views map to bottom tab selections or drill-down pushes.

```
App
├── Home                        (tab 1 — default landing)
│   └── [taps income summary]   → Transactions (filtered: income)
│   └── [taps expense summary]  → Transactions (filtered: expenses)
│   └── [taps recent item]      → Transaction Detail sheet
├── Transactions                (tab 2)
│   ├── All / Income / Expenses (type tabs)
│   ├── Today / Weekly / Monthly (period tabs)
│   └── [taps transaction]      → Transaction Detail sheet
│       └── [taps edit]         → Add Form (pre-filled)
├── Add                         (tab 3 — center)
│   ├── [type sheet]            → Expense Form
│   └── [type sheet]            → Income Form
│       └── [saves]             → returns to previous view
├── Analytics                   (tab 4)
│   ├── Today / Weekly / Monthly (period tabs)
│   ├── Income vs Expense bars
│   ├── Spending trend bars
│   ├── Category donut chart
│   ├── Top categories list
│   └── [taps category]         → Category Detail view
│       └── [back]              → Analytics
└── Search                      (tab 5)
    ├── Filter: category / subcategory / account / type
    └── [taps result]           → Transaction Detail sheet
```

## Navigation Model

- **Primary navigation**: Bottom tab bar — 5 items. Persistent on all top-level views. Hidden when inside a drill-down (Category Detail, Add Form) or replaced by a back-topbar.
- **Secondary navigation**: Period tabs (Today / Weekly / Monthly) appear within Home, Transactions, Analytics. Type tabs (All / Income / Expenses) appear within Transactions.
- **Utility navigation**: Theme toggle button in top-right of Home screen topbar. No separate settings screen.
- **Mobile navigation**: Bottom tab bar, thumb zone. Center tab (Add) is visually elevated — larger icon, accent background pill. No hamburger, no side drawer.
- **Back navigation**: Drill-down views (Category Detail, Add Form when editing) show a topbar back button. Tapping back returns to the originating tab's state.

## Content Hierarchy

### Home
1. **Net balance hero** — the single most important number: income − expenses for current period. Large, centered, prominent.
2. **Period tabs** (Today / Weekly / Monthly) — scope the balance and all content below it.
3. **Income / Expense summary row** — two cards side by side: total income (green), total expenses (orange). Tappable, navigates to filtered Transactions.
4. **Recent transactions** — last 5 entries, regardless of period. Labeled "Recent." Tapping opens Transaction Detail sheet.
5. **Empty state** — shown when no transactions exist for the period.

### Transactions
1. **Type tabs** (All / Income / Expenses) — primary filter, topmost control.
2. **Period tabs** (Today / Weekly / Monthly) — secondary filter.
3. **Day-grouped transaction list** — day header shows date + net total for that day. Cards show full detail.
4. **Empty state** — per combination of type + period.

### Add (Expense Form)
1. **Amount input** — first, largest field. Number keypad opens automatically.
2. **Expense name** — free text.
3. **Category chips** — most recent shown first, expandable.
4. **Subcategory chips** — optional, contextual to selected category.
5. **Account chips** — required.
6. **Date + time** — defaults to now, editable.
7. **Save button** — sticky at bottom.

### Add (Income Form)
1. **Amount input** — same as expense form.
2. **Income source name** — free text (replaces "expense name").
3. **Income category chips** — e.g. Salary, Freelance, Gift. Separate from expense categories.
4. **Account chips** — required.
5. **Date + time** — defaults to now.
6. **Save button** — sticky at bottom, green accent.

### Analytics
1. **Period tabs** (Today / Weekly / Monthly)
2. **Income vs Expense comparison** — horizontal bar or two-column stat block. Immediate orientation.
3. **Spending trend** — bar chart, shows expense total per day/week over the period.
4. **Category donut** — proportional breakdown of expense categories.
5. **Top categories list** — ranked by spend, tappable → Category Detail.

### Category Detail
1. **Category name + icon** as screen title.
2. **Total spend hero** — for current period.
3. **Sort control** — date desc / asc, amount desc / asc.
4. **Transaction list** — all transactions in this category for the period.

### Search
1. **Search input** — autofocused on view enter.
2. **Filter chips** — category, subcategory, account, type (income/expense).
3. **Results list** — transaction cards, same density as Transactions view.
4. **Empty / no-results state**.

## User Flows

### Log an expense (primary flow)
1. User taps center Add tab
2. Bottom sheet slides up: "Expense" (orange) | "Income" (green)
3. User taps "Expense"
4. Expense form animates in (full screen)
5. Amount field focused, numeric keyboard opens
6. User enters amount → name → selects category chip → selects account chip
7. Taps "Save Expense"
   - If missing required fields → toast error, field highlighted
   - If success → form clears, toast "Saved", returns to previous tab
8. User lands back on previous view (Home or Transactions)

### Log income
1. User taps center Add tab
2. Bottom sheet: taps "Income" (green)
3. Income form animates in
4. Fills amount → source name → income category → account
5. Taps "Save Income" → success toast → returns to previous tab

### Check financial standing (daily use)
1. User opens app → lands on Home
2. Sees net balance for current period (default: Today or last used period)
3. Switches period tab to Monthly for broader view
4. Taps expense summary card → Transactions filtered to expenses, monthly
5. Scans day-grouped list, identifies heavy spend days

### Review spending by category
1. User taps Analytics tab
2. Sees category donut for current period
3. Scrolls to top categories list
4. Taps a category → Category Detail view
5. Reviews individual transactions in that category
6. Taps back → returns to Analytics

### Edit a transaction
1. User finds transaction in Transactions list (or Home recent / Search)
2. Taps transaction → Transaction Detail bottom sheet opens
3. Taps "Edit" button in sheet
4. Add form opens pre-filled with transaction data
5. Edits fields → taps "Update"
6. Returns to originating view, transaction updated in list

### Search a past transaction
1. User taps Search tab
2. Types keyword or selects filter chip (category, account)
3. Results update live
4. Taps result → Transaction Detail sheet

## Naming Conventions

| Concept | Label in UI | Notes |
|---|---|---|
| Money coming in | Income | Not "revenue" or "credit" |
| Money going out | Expense | Not "debit" or "transaction" |
| Net income − expense | Balance | Not "net" or "total" |
| Transaction type | Income / Expense | Shown as label + color, not just color |
| Grouping by spending area | Category | Existing term, keep |
| Sub-grouping within category | Subcategory | Existing term, keep |
| Payment method / account | Account | Existing term, keep |
| Source of income | Income source | Replaces "expense name" on income form |
| Time filter | Period | Day / Weekly / Monthly — keep existing PERIOD_LABELS |
| Transaction card quick-view | Transaction Detail | Bottom sheet, not "modal" or "popup" |

## Component Reuse Map

| Component | Used on | Behavior differences |
|---|---|---|
| Bottom tab bar | All top-level views | Hidden on drill-down views (Category Detail, Add Form in edit mode) |
| Topbar | All views | Drill-down views show back button + screen title only; top-level views show title + utility actions |
| Period tabs | Home, Transactions, Analytics | Each maintains independent state |
| Transaction card | Transactions, Home (recent), Search, Category Detail | Same density everywhere; income cards use green amount |
| Type sheet (bottom sheet) | Add tab trigger | One-time use, dismissed after selection |
| Empty state | Home, Transactions, Analytics, Search, Category Detail | Unique message + icon per view; same structural component |
| Chip selector | Expense form, Income form, Search filters | Same component, different data sources |
| Toast | All views | Global singleton |

## Content Growth Plan

- **Transactions**: grow unboundedly. Managed via period-scoped queries to Notion API — no local pagination needed. Search handles historical lookup.
- **Categories**: user-created, grow slowly. Chip selector already handles "show all" expand pattern. No pagination needed.
- **Subcategories**: user-created, contextual to category. Same expand pattern.
- **Accounts**: user-created, typically 3–10. No growth concern.
- **Analytics**: always period-scoped, no accumulation issue. Trend bar chart spans the selected period only.

## URL Strategy

App is a single-page Cloudflare Worker serving one HTML document. No client-side router.

- **View state**: managed via `state.currentView` in JS — not reflected in URL.
- **Deep linking**: not supported (acceptable for personal PWA saved to home screen).
- **Query parameters**: none currently. Not introduced in this redesign.
- **Worker routes**: `GET /` → HTML app, `GET /api/*` → Notion proxy, `GET /manifest.json` → PWA manifest.
