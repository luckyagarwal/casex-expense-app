# Information Architecture: Settings & Icon Picker

This IA extends the existing app structure (single Cloudflare Worker serving two HTML shells, no client-side router). Adds: side menu pattern, Settings as a top-level destination, icon-picker sheet model.

## Site Map

The app is a single-page worker with two shells (mobile + desktop). Views are state, not routes. Below shows the *view tree* per shell.

**Mobile (`/`):**
- Home (default)
- Transactions
- Add Transaction (sheet)
  - Expense form
  - Income form
  - Transfer form
- Analytics
  - Category Detail (sub-view)
- Search
- **Settings** ← new
  - Categories (tab, default)
  - Subcategories (tab)
  - Accounts (tab)

**Desktop (`/desktop`):**
- Overview (default)
- Transactions
- Analytics
- Search
- **Settings** ← new (5th sidebar entry)
  - Same 3-tab body

**Modals/Sheets (cross-shell):**
- Add transaction sheet (existing)
- Transaction detail sheet (existing)
- **Side drawer (mobile only)** ← new
- **Icon picker sheet/modal** ← new
- Toast notifications (existing)

## Navigation Model

### Primary navigation

- **Mobile**: bottom nav, 5 tabs unchanged: Home / Txns / + (add) / Stats / Search
- **Desktop**: left sidebar, **5 entries** (was 4): Overview / Transactions / Analytics / Search / **Settings**

Settings is intentionally NOT in the mobile bottom nav. The bottom nav is reserved for high-frequency primary tasks (logging an expense, reviewing recent activity). Settings is rarely-used utility.

### Secondary navigation

- **Settings page**: segmented control with 3 tabs (Categories / Subcategories / Accounts). Tab state is in-memory, not URL-persisted.
- **Analytics page** (existing): period tabs (Today / Week / Month). Unchanged.

### Utility navigation (mobile drawer)

A new **side drawer** opens from a hamburger icon top-left of every screen. Contents:

1. **Settings** (always present, top of list)
2. **Theme toggle** (always present)
3. **Export Data** (placeholder, disabled until phase ≥ next)
4. **About / Version** (placeholder)

The drawer is the mobile equivalent of "everything that doesn't fit in 5 tabs." Future utility entries (Help, Sign out, Backup) slot here without touching the bottom nav.

### Utility navigation (desktop sidebar footer)

The existing desktop sidebar already has a footer for Theme. Future utility items extend the footer area (no separate drawer on desktop).

### Mobile navigation pattern

- **Hamburger** top-left → opens **side drawer** (slide-from-left, 280px wide)
- **Bottom nav** remains primary
- Two patterns coexist intentionally: thumb-zone tasks (bottom) vs. settings-style chores (drawer)

## Content Hierarchy

### Settings — Categories tab

1. **Tab segmented control** (top, sticky) — lets the user jump between Categories / Subcategories / Accounts without leaving the page.
2. **List of category rows** — alphabetically sorted, virtual scroll if >50 (not needed at current scale).
3. **Per-row content priority**, left to right:
   - Icon (44×44 visual anchor — most-scanned element)
   - Editable name (primary content)
   - Edit-icon affordance (subtle pencil/right-arrow)
4. **Empty state** if no categories exist (won't happen at current data scale, but specified): "No categories yet" + "Add your first category" CTA disabled (out-of-scope for this brief).

### Settings — Subcategories tab

1. Tab control (same)
2. **Optional filter chip "Filtered by: [Category name]"** — when arriving from a category row's "View subcategories" link (deferred to later; not in this brief)
3. List of subcategory rows, alphabetical
4. Per-row: same as Categories, plus a subtle "→ in {parent category name}" caption underneath the editable name

### Settings — Accounts tab

1. Tab control (same)
2. List of account rows, alphabetical
3. Per-row: icon (renders bank logo if `iconUrl` matches bundled bank set) + name + edit affordance. Accounts default to the **Banks** tab in the picker.

### Side drawer (mobile)

1. **Settings** — primary destination, top of list
2. **Theme toggle** — visual emphasis (large tap target)
3. **Export Data** — utility, dimmed if disabled
4. **About** — bottom, smallest tap target
5. **App version + build hash** — footer, ultra-quiet text

## User Flows

### Flow 1: Rename a category

1. User opens app. Cold start → bootstrap loads.
2. (Mobile) User taps hamburger → drawer slides in.
   (Desktop) User clicks Settings in sidebar.
3. Settings view appears. Categories tab is active by default.
4. User scrolls list, taps the row with the typo.
5. Name text becomes an `<input type="text">`, cursor at end, soft keyboard opens (mobile).
6. User edits text → blurs (taps elsewhere) or hits Enter.
7. App fires `PUT /api/d1/categories/:id { name }`.
   - Success → toast "Renamed". Row's text updates.
   - Failure → toast "Couldn't rename" + revert to old text.
8. User can verify: navigate to Transactions, scroll to a transaction tagged with that category — name now reflects the new label.

### Flow 2: Pick a curated icon for a category

1. User on Settings → Categories tab.
2. User taps the icon of the row (or the explicit edit-icon button).
3. Icon picker sheet slides up (mobile) / modal centers (desktop).
4. Default tab: **Icons** (50 curated SVGs).
5. User scrolls grid, taps a symbol.
6. Sheet animates closed. App fires `PUT /api/d1/categories/:id { iconUrl: "lucide:home" }`.
7. Row's icon updates in place. Toast: "Icon updated".
8. The category now displays this icon everywhere it's referenced (form chips, transaction list, analytics).

### Flow 3: Upload a custom image for an account

1. User on Settings → Accounts tab.
2. User taps "Cred wallet" account icon.
3. Picker opens. Default tab for accounts: **Banks**. User taps **Upload** tab.
4. User taps "Choose file" → native picker:
   - iOS: Camera | Photo Library | Files
   - Desktop: file dialog
5. User selects an image. App reads file → `<canvas>` resize to 128×128 (square center-crop) → preview shows in picker.
6. User taps "Use this image" button.
7. App `POST /api/d1/upload` with the resized blob. Worker writes to R2, returns `{ key: "abc123" }`.
8. App fires `PUT /api/d1/accounts/:id { iconUrl: "/uploads/abc123" }`.
9. Picker closes. Row's icon now renders as `<img src="/uploads/abc123">`.

### Flow 4: Pick a bank logo for an account

1. User on Settings → Accounts tab.
2. User taps the icon of "ICICI Bank" row.
3. Picker opens. **Banks** tab is default (account context).
4. App auto-suggests: highlights "ICICI" logo at the top because the account name contains "ICICI".
5. User taps the highlighted logo → sheet closes → toast → row updates.

### Flow 5: Open & dismiss the side drawer (mobile)

1. User on any screen → taps hamburger top-left.
2. Drawer slides in from left (200ms ease-out). Overlay 50% black appears.
3. User can:
   - Tap a drawer item → drawer slides closed + view changes
   - Tap overlay backdrop → drawer slides closed (no view change)
   - Press Android back / swipe-from-right edge → drawer closes (treated as "dismiss")
   - On iOS Safari: swipe-from-left edge then back is a noop (cannot intercept system gesture)

## Naming Conventions

| Concept                               | Label in UI            | Notes                                                                       |
| ------------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| The settings destination              | "Settings"             | Standard. Not "Preferences" or "Account".                                   |
| The mobile slide-in menu              | "Menu" (button label hidden, icon only) | Internally called "side drawer" in code; never user-visible.       |
| The 3-tab segmented control on Settings | "Categories", "Subcategories", "Accounts" | Plural, matches data table names.                                  |
| The icon picker tab labels            | "Icons", "Emoji", "Upload", "Banks" | Short. "Icons" is the curated SVG set. "Banks" is accounts-only.       |
| A single curated SVG                  | "icon"                 | Lowercase. "Pick an icon," "Upload an icon."                                |
| A single emoji                        | "emoji"                | Lowercase, singular.                                                         |
| The thing being decorated             | "icon"                 | The user thinks of all four sources as "the icon." Source is implementation. |
| Renaming feedback                     | "Renamed"              | Past tense, no name interpolation needed.                                    |
| Icon-change feedback                  | "Icon updated"         | Same.                                                                        |
| Upload-in-progress                    | "Uploading..."         | Indeterminate state during R2 PUT.                                           |
| Upload failure                        | "Couldn't upload"      | Casual, blame-free.                                                          |

## Component Reuse Map

| Component                       | Used on                                                       | Behavior differences                                                              |
| ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `.icon-btn`                     | Topbar refresh, hamburger, picker close, edit-icon affordance | Shared circular icon button. Hamburger is 36×36 to feel slightly more prominent.  |
| `.add-sheet` / overlay          | Add transaction (existing), icon picker (new)                 | Picker is shorter (max 87vh), tabs replace the title row, internal grid scrolls. |
| `.type-tabs` (mobile)           | Transactions list, Settings (new)                             | Settings uses 3 tabs vs. transactions' 2-3.                                       |
| `.sidebar-nav-item` (desktop)   | Existing 4 items + Settings (new)                             | No difference; new entry follows the same data binding pattern.                   |
| `.chip-item`                    | Form chip selector, picker grid items                         | Picker chips are square (icon-only), not pills.                                   |
| Toast (existing global)         | All flows                                                     | Same.                                                                             |

## Content Growth Plan

- **Categories / Subcategories / Accounts**: grow via existing add-transaction flow. Max realistic ceiling per user: ~50 categories, ~200 subcategories, ~30 accounts. List rendering scales linearly; no pagination needed.
- **Curated icon set**: starts at 50. Adding more in future = appending to the bundled SVG constant. No DB or upload needed.
- **Bundled bank logos**: starts at 11. Same — extend via worker constant. The list grows with every Indian bank our user actually uses; non-Indian banks deferred until the user requests them.
- **Side drawer items**: start at 4 (Settings, Theme, Export, About). Future-add slots: Help, Backup, Sign Out, etc. Drawer height grows; if it ever exceeds viewport it scrolls internally.
- **Uploaded images** (R2): one image per uploaded entity. Re-uploading replaces. Storage growth is bounded by total entities (≈250 max). Negligible at R2 scale.
- **Search within settings**: deferred. Will add a search field at the top of each tab if list count exceeds 30 in any one category — not needed at current scale.

## URL Strategy

Same as existing app: **no client-side router**. View state is JS state (`state.currentView`). Reasons:

1. App is a single Worker serving one HTML doc per shell. Routing client-side adds bundle weight + history complexity for a personal-use app.
2. Deep linking is not a use-case (PWA installed to home screen, no link-sharing).
3. URLs the user can hit:
   - `/` — mobile shell
   - `/desktop` — desktop shell
   - `/api/d1/*` — JSON endpoints (unchanged)
   - `/uploads/:key` — R2-served images (new)
   - `/manifest.json`, `/sw.js`, `/healthz` — infra (unchanged)
4. Settings is not URL-addressable. Refresh on the Settings page lands the user on Home (mobile) or Overview (desktop). This is acceptable per the brief's principles ("trust over confirmation" — refresh isn't catastrophic).

### URL parameters added by this feature

- None on the user-facing shells.
- New backend-only paths: `/uploads/:key` (GET, serves R2 object).

### Future expansion if URL routing becomes needed

If we later want shareable Settings links or browser-back navigation between Settings tabs, the migration is small:
- Add `location.hash` writes when the segmented control changes (`#settings/categories`)
- Add `popstate` handler to read hash → set `state.currentView` and `state.settingsTab`
- No router library, ~30 LOC. Out of scope for this brief.
