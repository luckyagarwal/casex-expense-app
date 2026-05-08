# Design Brief: Settings & Icon Picker

## Problem

The user has accumulated 19 categories, 35 subcategories, and 11 accounts in their personal expense tracker. Many of these have empty icons or wrong-feeling defaults (e.g. their bank accounts show no logo, their "Money Transfer" category has no symbol). They cannot rename a mistyped category without losing every transaction tagged to it. Today there is no way to manage any of this from inside the app — they would have to edit the database manually. The result is a personal-finance app that feels half-furnished: data is theirs, but the look isn't.

## Solution

A Settings destination, reachable from one consistent menu pattern across mobile and desktop, that lets the user fix the small things: the name of a category, the icon on an account, the missing symbol on a subcategory. The settings surface is calm and short — three lists of editable rows, one icon picker that handles the four ways someone wants to choose a symbol (curated icons, emoji, photo upload, bank logo). Every change updates instantly and propagates: an existing expense tagged "Foood" instantly reads "Food" everywhere once the typo is fixed.

The Settings destination lives in a side menu that also reserves space for future operations (Export, Theme, About) without re-architecting the nav.

## Experience Principles

1. **Trust over confirmation** — Edits commit on blur or modal-close, no "Are you sure?" walls. The app is the user's own data; reversibility is just another edit. This means: no double-confirm dialogs for renames, no "Save changes" buttons except where multiple fields are batched.

2. **One picker, four sources** — The icon-choosing experience is a single sheet with tabs: curated icons / emoji / upload / banks (accounts only). Don't fragment into separate picker UIs by source. The user always reaches symbols via the same gesture.

3. **Furnish without redecorating** — Settings should feel like a continuation of the existing app, not a new section with its own visual language. Reuse existing tokens, chip styles, sheet patterns, type ramp. New components only where the picker's grid layout genuinely needs them.

## Aesthetic Direction

- **Philosophy**: Warm minimalism, continuous with the existing `index-html.js` cream-on-charcoal aesthetic. Soft surfaces, rounded corners, subtle shadows. No new typography or color introductions.
- **Tone**: Calm, controlled, slightly tactile. Same emotional register as iOS Settings or Things 3.
- **Reference points**:
  - iOS Settings — list of editable rows, modest icons left of label
  - Notion's icon picker — tabbed sheet (Emoji / Icons / Upload), live preview
  - Things 3 — quiet typography, generous padding, rare use of color
- **Anti-references**:
  - Material Design "settings" patterns with FABs, large headers, ripple feedback
  - Linear/Vercel-style cold geometry — too clinical for a personal money app
  - Anything with "Save" buttons under every individual field

## Existing Patterns

- **Typography**: Inter (system fallback), `--text-base: 15px`, `--text-lg: 17px`. Headings use weight 600. Existing screens use `.screen-title` (line 2167 in `index-html.js`) for h1 and `.section-title` for section labels.
- **Colors**: Defined as CSS custom properties in both `index-html.js` (mobile) and `desktop-html.js` (desktop). Mobile primary surface `--color-bg`, sheet surface `--color-sheet-bg`, accent `--color-accent` (warm orange ~#ff7a59). Dark mode auto-toggled via `data-theme="dark"` on `<html>`.
- **Spacing**: Token scale `--s1` (4px) through `--s10` (64px). Settings rows should use `--s4` (16px) padding to match existing list rows.
- **Components**:
  - `.icon-btn` — circular icon button (already on refresh, theme toggle)
  - `.add-sheet` / `.add-sheet-overlay` — bottom sheet pattern used by the Add Transaction flow. New icon picker reuses this.
  - `.chip-item` (desktop) / `.chip` (mobile) — selectable rounded pill, used in form fields. Picker's grid items extend this.
  - `.sidebar-nav-item` (desktop) — left nav row with icon + label. New "Settings" entry slots in here.
  - `.bottom-nav` (mobile) — 5 tabs, no settings slot today. Settings reaches via new hamburger drawer instead.

## Component Inventory

| Component                     | Status   | Notes                                                                                       |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| Hamburger button (mobile)     | New      | Top-left of every screen header. SVG icon, opens drawer.                                    |
| Side drawer (mobile)          | New      | Slides from left, ~280px wide. Items: Settings, Theme, Export, About (placeholder).         |
| Side drawer overlay backdrop  | New      | Reuse pattern from `.add-sheet-overlay`.                                                    |
| Settings nav item (desktop)   | Modify   | Add 5th `.sidebar-nav-item` to existing sidebar.                                            |
| Settings view (`#settingsView`) | New      | Full-screen view in mobile, full-pane in desktop. Tabs + scroll list.                       |
| Settings tabs                 | New      | Segmented control: Categories / Subcategories / Accounts. Reuse `.type-tabs` styling.       |
| Settings row                  | New      | `[icon] [editable name] [edit-icon button]`. ~56px tall mobile, 48px desktop.               |
| Icon picker sheet             | New      | Bottom sheet (mobile) / centered modal (desktop). 4 tabs.                                   |
| Icon grid                     | New      | 6 columns mobile, 8 desktop. Items are 56×56 buttons with the symbol centered.              |
| Curated icons set             | New      | 50 inline SVGs (Lucide style), bundled in worker as JS constants.                           |
| Emoji input                   | New      | Native text input + 30-emoji quick-pick grid above.                                         |
| Upload control                | New      | `<input type="file" accept="image/*" capture="environment">`. Preview + canvas resize.      |
| Bank logo set                 | New      | 11 inline SVG logos: ICICI, HDFC, SBI, BOB, YES, Axis, Kotak, IndusInd, Cred, Cash, Generic Card. |
| Toast (existing)              | Exists   | Confirmation feedback ("Renamed to Food", "Icon updated").                                  |

## Key Interactions

**Opening Settings (mobile):**
1. User taps hamburger icon (top-left, every screen)
2. Drawer slides in from left over a 50% black overlay (200ms ease-out)
3. User taps "Settings" → drawer slides out + Settings view fades in (overlap, 150ms)

**Opening Settings (desktop):**
1. User clicks "Settings" in left sidebar (5th nav item)
2. Main content area swaps to Settings view (instant; sidebar already persistent)

**Editing a row name:**
1. User taps the name text → text becomes editable input, cursor at end
2. User edits → on blur (or Enter), update fires `PUT /api/d1/categories/:id { name }`
3. Toast appears: "Renamed". Row reflects new name immediately.
4. All transactions tagged to that category now read the new name (joins read live; no client-side cache invalidation needed for views that re-fetch on tab switch — but caches must invalidate).

**Editing a row icon:**
1. User taps the icon (or "Edit" button) → icon picker sheet opens
2. Sheet defaults to "Icons" tab for categories/subcategories, "Banks" tab for accounts
3. User taps a symbol → instant selection (no Save button); sheet auto-closes after 100ms
4. Backend updates via `PUT /api/d1/categories/:id { emoji }` or `{ iconUrl }`
5. Row's icon updates in place. Toast: "Icon updated".

**Uploading an image:**
1. User taps Upload tab → file picker opens (mobile gives Camera | Photo Library | Files)
2. User selects → preview appears (square crop center, scaled to 128×128 via `<canvas>`)
3. User confirms → POST to `/api/d1/upload` → R2 stores → returns key
4. Backend stores `iconUrl: /uploads/:key` for the entity. Sheet closes.

**Removing the search-button-near-refresh:** Already-existing `.search-capsule` buttons in `index-html.js:2171, 2342, 2475` get deleted. Refresh button stays. Mobile bottom-nav's Search tab is unaffected.

## Responsive Behavior

- **Mobile (≤640px)**: hamburger drawer for navigation; Settings view is a top-level screen owned by the drawer, not the bottom nav. Picker is a bottom sheet (87vh max). Grid is 6 columns.
- **Tablet/Desktop (≥1024px)**: persistent left sidebar; Settings is the 5th sidebar entry. Picker is a centered modal, ~520px wide. Grid is 8 columns. Hamburger is hidden — sidebar is always visible.
- **In between (640–1024px)**: collapsed sidebar (icon-only) + tap to expand. Same picker as desktop.

## Accessibility Requirements

- All new icon buttons have `aria-label` describing action ("Open menu", "Edit Food category icon", "Choose Lucide home icon").
- Drawer is a `role="dialog"` with focus-trap; pressing `Esc` closes it.
- Icon picker tab list is `role="tablist"` with `aria-selected` on the active tab.
- Settings rows: editable name input has `aria-label="Rename {category name}"`.
- Curated icon grid items are `<button>`s with `aria-label="{icon name}"` (e.g., "Coffee cup icon").
- Color contrast: icons rendered as currentColor stay above 4.5:1 against backgrounds in both themes (existing tokens already meet this).
- Keyboard: Tab through rows → Enter to start editing name → Esc to cancel; Tab to icon button → Enter opens picker → arrow keys navigate grid → Enter selects.
- Screen-reader: row name and icon are a single labelled control, not announced as separate items.

## Out of Scope

- Adding new categories, subcategories, or accounts (this brief is rename + re-icon only)
- Deleting existing entries (would require expense-record cascade decisions)
- Bulk operations (multi-select to re-icon several at once)
- Drag-to-reorder
- Custom icon-set imports beyond per-image upload (e.g., uploading a whole iconpack ZIP)
- Color customization for icons (color always = currentColor / accent)
- Search within Settings ("find all categories without an icon")
- Per-icon analytics ("which icons get used most")
- Sub-account hierarchy (sub-accounts under accounts)
- Custom emoji sets / emoji mart libraries — native emoji input + a quick-pick of 30 common ones is enough
- Image cropping UI (we auto-center-crop on upload; no manual crop tool)
