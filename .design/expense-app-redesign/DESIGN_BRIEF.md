# Design Brief: Expense App Redesign (Full)

## Problem

User logs daily expenses but never knows where they actually stand. No income tracking means no net balance — the app answers "what did I spend?" but not "how am I doing financially?" The side-drawer navigation is unfamiliar on mobile, making the app feel like a web page rather than a native tool. There's no home screen to orient the user at a glance.

## Solution

A redesigned mobile-first PWA that functions as a true personal money manager. The home screen shows net balance front and center — income minus expenses — with a quick summary of this period's flow. A persistent bottom tab bar makes every section one thumb-tap away. Separate, focused forms for income and expense entry replace the single overloaded form. Analytics expand to show spending trends over time, not just category snapshots.

## Experience Principles

1. **Clarity over completeness** — Show the most important number (net balance) first. Drill down only when the user asks. Never bury the headline in a list.
2. **One thumb, one tap** — Every primary action reachable without stretching or scrolling. Bottom nav, large touch targets, bottom-sheet interactions. No side drawers.
3. **Warm confidence** — The app handles money, which creates anxiety. Warm tones, smooth transitions, and deliberate typography reduce friction and make the experience feel personal, not clinical.

## Aesthetic Direction

- **Philosophy**: Warm Ledger — warm neutrals on deep dark surfaces, like a well-kept physical ledger. Premium without being cold. Personal without being playful.
- **Tone**: Calm, grounded, trustworthy. Slight warmth. Not urgent, not sterile.
- **Reference points**: Revolut's clarity, Day One's warmth, Monzo's card-based layout. Native iOS finance apps.
- **Anti-references**: Spreadsheet UIs, aggressive neon fintech, generic Material Design forms, banking app grey.

## Existing Patterns

- **Typography**: `"SF Pro Text"`, `"SF Pro Display"`, `"Inter"` fallback, `system-ui`. No external font loading. Display headings use SF Pro Display stack.
- **Colors**: CSS custom properties on `:root`. Dark: `--bg: #111111`, `--accent: #eb7c55` (orange), `--accent-2: #53bdb0` (teal), `--positive: #66c68c`, `--danger: #f46a6a`. Light mode mirrors with warm paper tones (`--bg: #f6f1e9`).
- **Spacing**: No formal scale — uses ad-hoc px values. Redesign should introduce consistent 4px base grid.
- **Components**: input-card, chips (category/account selectors), period-tabs, chart-card, list-stack, pill badges, topbar, toast. All extend in redesign.
- **Currency**: ₹ (INR) hardcoded. Single currency.

## Component Inventory

| Component | Status | Notes |
|---|---|---|
| Bottom tab bar | New | Replace side nav. 5 tabs: Home, Transactions, Add (center), Analytics, Search |
| Home dashboard screen | New | Balance hero + income/expense summary row + recent 5 transactions |
| Add type sheet | New | Bottom sheet with Income / Expense choice before opening form |
| Income add form | New | Mirrors expense form, green accent, "income source" instead of category |
| Expense add form | Modify | Add income/expense label at top; otherwise keep field structure |
| Transaction list | Modify | Day-grouped sections with day net total; All/Income/Expenses tabs |
| Transaction card | Modify | Keep current density (icon + name + account + category + amount + date); add income color coding |
| Analytics screen | Modify | Add trend bar chart + income vs expense bars + top categories list alongside existing donut |
| Category detail view | Keep | Minor visual polish only |
| Search view | Keep | Minor visual polish only |
| Period tabs | Keep | Per-screen, independent. Today / Weekly / Monthly |
| Empty states | Modify | Replace minimal text with designed states — icon + message + CTA |
| Toast | Keep | Existing works fine |
| Page loader | Keep | Existing works fine |

## Key Interactions

**Adding a transaction**
User taps center Add tab → bottom sheet slides up with two large options: "Expense" (orange) and "Income" (green) → taps one → full form view animates in → fills fields → saves → returns to previous view with success toast.

**Viewing balance**
Home screen shows period-scoped net balance as hero number. Income summary (green) and expense summary (orange) shown as a two-column row below. Tapping either row navigates to Transactions filtered by type.

**Browsing transactions**
Transactions view shows All/Income/Expenses tabs at top, then period tabs (Today/Week/Month), then list grouped by day. Each day group has a header showing the date and net total for that day. Cards show full detail (current density).

**Analytics drill-down**
Analytics view shows period tabs, then: (1) income vs expense bar comparison, (2) spending trend bars over time, (3) category donut, (4) top categories list. Tapping a category goes to CategoryDetail view.

**Editing a transaction**
Long-press or swipe-reveal edit on transaction card. Opens same add form pre-filled. Save updates in place.

## Responsive Behavior

- **Primary target**: 375px mobile (iPhone SE / standard). All layouts designed here first.
- **Tablet (768px+)**: Bottom nav shifts to side rail. Content max-width 480px centered. No layout restructuring needed beyond nav.
- **Desktop**: Not a target. App remains usable but is not optimized.
- Bottom sheets, modals, and forms always anchor to bottom on mobile, max-height 90vh.

## Accessibility Requirements

- Color contrast: minimum 4.5:1 for body text, 3:1 for large text and UI components against backgrounds.
- Touch targets: minimum 44×44px for all interactive elements.
- Income/expense distinction must not rely on color alone — use labels and icons alongside green/red.
- Focus management: when bottom sheet opens, focus moves to first interactive element inside it.
- `prefers-reduced-motion`: skip slide/fade transitions, use instant show/hide.

## Out of Scope

- Budget limits or spending cap features
- Multi-currency support
- Recurring transaction scheduling
- Push notifications or reminders
- Data export (CSV, PDF)
- Cloud sync settings UI
- Onboarding flow for new users
- Desktop-optimized layout
