# Build Tasks: Expense App Redesign (Full)

Generated from: .design/expense-app-redesign/DESIGN_BRIEF.md
IA: .design/expense-app-redesign/INFORMATION_ARCHITECTURE.md
Tokens: .design/expense-app-redesign/DESIGN_TOKENS.css
Date: 2026-05-01

Philosophy: **Warm Ledger** — warm neutrals on deep dark surfaces, personal not clinical.

---

## Foundation

- [x] **Token integration**: Replace the existing `:root` / `[data-theme]` blocks in `index-html.js` with the full token system from `DESIGN_TOKENS.css`. Add spacing, typography, layout, component, and motion tokens. Keep legacy aliases so existing CSS doesn't break. Done when: DevTools shows `--color-income`, `--nav-height`, `--space-6` etc. resolving correctly in both dark and light mode.

- [x] **Bottom tab bar**: Build the new `<nav class="bottom-nav">` replacing `.side-nav`. 5 tabs: Home, Transactions, Add (center, elevated), Analytics, Search. Add tab uses `--color-nav-add-bg` accent pill, larger icon. Active tab uses `--color-nav-item-active`. Hidden during drill-down views (Category Detail, Edit form). Done when: all 5 tabs render, active state switches on tap, Add button visually elevated, safe-area-inset-bottom applied. _Modifies: existing `.side-nav` HTML + CSS, `showView()` JS logic._

---

## Core Views

- [x] **Home screen**: New `#homeView` as the default landing view (replaces expenses as default). Contains: period tabs (Today/Weekly/Monthly), net balance hero (large, `--font-size-4xl`, `--letter-spacing-tight`), income/expense two-column summary row (tappable, navigates to filtered Transactions), recent 5 transactions list (reuses transaction card component), empty state for zero-data periods. Done when: balance = income total − expense total for selected period, summary row navigates correctly, recent list shows latest 5 regardless of period. _New view. Reuses: period-tabs, transaction card, toast._

- [x] **Transaction list redesign**: Modify `#expensesView` → rename to `#transactionsView`. Add type tabs (All / Income / Expenses) above period tabs. Change flat list to day-grouped sections: each group has a day header showing date + net total for that day (`--day-header-height`). Income transaction amounts display in `--color-income`, expense in `--color-accent-expense`. Done when: tabs filter correctly, groups render with correct day totals, both income and expense entries appear in the unified list. _Modifies: existing `#expensesView`, `renderExpenses()`, list rendering logic._

- [x] **Add type sheet**: On tapping the center Add nav tab, a bottom sheet slides up (`--sheet-radius-top`, `--shadow-sheet`) with two large choice buttons: "Expense" (orange, `--color-accent-expense`) and "Income" (green, `--color-income`). Tapping either dismisses the sheet and navigates to the respective form. Tapping the backdrop dismisses with no action. Done when: sheet animates up/down, both choices navigate to correct form, backdrop dismiss works, reduced-motion respects `--duration-normal: 0ms`. _New component. Uses: `--color-overlay`, `--sheet-radius-top`, motion tokens._

- [ ] **Income add form**: New `#incomeView` view. Mirrors expense form structure. Fields: Amount (green accent, `--color-income`), Income Source name (replaces "Expense Name"), Income Category chips (separate data set from expense categories), Account chips (shared), Date + Time. Save button green. On save: creates income record in Notion via worker API with `type: "income"` flag, shows success toast, returns to previous view. Done when: form saves correctly to Notion, income record appears in Transactions list with green amount. _New view. Reuses: input-card, chip selector, amount-shell, date/time inputs, save-btn pattern._

- [x] **Expense form update**: Modify existing `#addView`. Add income/expense label at top (shows "Expense" in orange since this is the expense-specific form). Wire "Cancel / back" to return to type sheet or previous view. Save button uses `--color-accent-expense`. No other field changes. Done when: form correctly labeled, navigation back to type sheet works, all existing functionality preserved. _Modifies: existing `#addView` topbar + save button styling._

---

## Analytics

- [x] **Analytics screen — full suite**: Modify `#analyticsView` to show 4 sections in order: (1) Income vs Expense stat comparison block (two large numbers, green/orange), (2) Spending trend bar chart (bars per day/week, SVG, expense-colored), (3) Category donut chart (existing, refactored to use `--color-chart-*` tokens), (4) Top categories ranked list (tappable → Category Detail). Done when: all 4 sections render for each period, donut and trend chart respond to period tab changes, top categories list navigates correctly. _Modifies: existing `#analyticsView`, `renderAnalytics()`, `renderChart()`. New: trend bar chart SVG, income/expense stat block, top-categories list._

---

## Interactions & States

- [ ] **Transaction detail sheet**: Tapping any transaction card (in Home, Transactions, Search, Category Detail) opens a bottom sheet showing full transaction details: amount (color-coded), name, category + subcategory, account, date/time, and two actions — "Edit" (opens add form pre-filled) and "Delete" (confirm then remove). Done when: sheet opens/closes with animation, Edit pre-fills form correctly, Delete shows inline confirmation before calling API, sheet closes after either action. _New component. Reuses: existing edit flow (`editExpense()`), existing delete logic._

- [x] **Empty states**: Replace all minimal text empty states across Home, Transactions (per type+period combo), Analytics, Search, Category Detail with designed states: icon (Unicode symbol or SVG inline) + message + contextual CTA (e.g. "Add your first expense" button on Home). Done when: each view shows a distinct, non-generic empty state; CTAs navigate to the correct action. _Modifies: existing empty-state HTML strings in render functions._

- [x] **Loading & skeleton states**: During Notion API fetch, show skeleton shimmer on Home balance hero and transaction list instead of the current full-screen loader. Page loader (`#pageLoader`) retained for initial cold load only. Done when: switching periods shows skeleton, not blank content. _Modifies: `#pageLoader` behavior, render functions._

---

## Polish

- [x] **Micro-interactions & motion**: Apply motion tokens throughout. Tab switches use `--duration-fast` fade. View transitions use `--duration-normal` slide. Bottom sheets use `--duration-slow` with `--easing-out`. Active press states on cards/buttons use `transform: scale(0.97)` with `--duration-instant`. Done when: all transitions use token values, no hardcoded `0.3s` or similar remain. _Modifies: existing transition CSS throughout._

- [x] **Typography & spacing pass**: Replace hardcoded px font sizes and spacing with token references (`--font-size-*`, `--space-*`, `--line-height-*`). Apply `--letter-spacing-tight` to hero numbers. Apply `--letter-spacing-wide` to period tab labels and section labels. Done when: no hardcoded `font-size`, `padding`, `margin`, `gap` values remain — all reference tokens. _Modifies: existing CSS throughout._

- [ ] **Tablet layout (768px+)**: At `768px` breakpoint, bottom nav shifts to a left side rail (64px wide, icons only). Content area centered at `--max-width-content` (480px). Done when: layout looks intentional on iPad-sized viewport, no layout breakage. _Modifies: existing `@media` blocks, nav CSS._

---

## Accessibility

- [ ] **Accessibility pass**: (1) Verify all interactive elements have `aria-label` or visible label. (2) Add `role="tablist"` / `role="tab"` to period tabs and type tabs. (3) Income/expense distinction uses label text + color, not color alone. (4) Focus management: bottom sheet traps focus on open, returns focus on close. (5) Check contrast ratios for `--color-text-tertiary` on `--color-bg-surface` in both modes (target 4.5:1 for small text). Done when: no color-only information, sheets trap/restore focus, tab roles correct. _Modifies: HTML throughout._

---

## Review

- [ ] **Design review**: Run `/design-review` against the brief. Check: Warm Ledger aesthetic fidelity, bottom nav usability, balance hero prominence, income/expense color distinction, empty states quality, responsive behavior at 375px and 768px.
