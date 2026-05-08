# Build Tasks: Settings & Icon Picker

Generated from: .design/settings-icons/DESIGN_BRIEF.md
Date: 2026-05-08

Builds in three deployment slices. Each slice ends in a working, deployable state.

---

## Slice 1 — Backend foundations + Settings shell + Emoji picker

Goal: ship a Settings page that lets the user rename and re-emoji the existing 19 + 35 + 11 entities. No image upload, no curated SVGs yet.

### Foundation
- [ ] **Schema migration: add `icon_url` column** to `categories`, `subcategories`, `accounts`. Idempotent `ALTER TABLE ... ADD COLUMN icon_url TEXT` migrations applied via `wrangler d1 execute`. _New SQL._
- [ ] **Backend PUT endpoints for entity edit**: `PUT /api/d1/categories/:id`, `PUT /api/d1/subcategories/:id`, `PUT /api/d1/accounts/:id`. Body accepts `{ name?, emoji?, iconUrl? }`. Returns updated row. _Modifies `worker.js` router._
- [ ] **Bootstrap response includes `iconUrl`**: extend `handleD1Bootstrap` to select+return `icon_url` per category/subcategory/account. _Modifies `worker.js`._
- [ ] **Remove search CTAs near refresh** at `index-html.js:2171, 2342, 2475`. Just delete the `.search-capsule` buttons. _Modifies mobile only._

### Core UI — mobile
- [ ] **Hamburger button + side drawer (mobile)**: `<button class="menu-btn">` top-left of every screen header. Drawer is fixed-position panel slide-in-from-left, 280px wide, with overlay. Drawer items: Settings (active), Theme, Export (disabled), About (disabled). _New components: `.menu-btn`, `.side-drawer`, `.drawer-overlay`._ Uses `--color-overlay`, `--shadow-sheet`, `--sheet-radius` tokens.
- [ ] **Settings view (mobile, `#settingsView`)**: full-screen view, segmented tabs (Categories / Subcategories / Accounts), scrollable list of rows. Each row = icon + editable name + edit-icon button. Tap-to-edit name on blur saves via PUT. _New view + new row component._
- [ ] **Settings nav wiring (mobile)**: hamburger → drawer → "Settings" tap navigates to `#settingsView`, closes drawer. Hamburger hides when add-sheet or txn-sheet is open. _Modifies `wireNav` + new drawer state._

### Core UI — desktop
- [ ] **Sidebar: add Settings entry (5th item)**: extend `.sidebar-nav` with Settings nav-item. SVG gear icon. Wires to render Settings page in main-content area. _Modifies `desktop-html.js` sidebar._
- [ ] **Settings page (desktop)**: same 3-tab structure as mobile but in main content area. Wider grid, more comfortable spacing. _New page._

### Picker — Emoji-only (this slice)
- [ ] **Icon picker sheet (mobile bottom-sheet, desktop modal)**: shared component, opens with `openIconPicker(entityType, id)`. For this slice: only one tab labelled "Emoji". Tab content = quick-pick grid of 30 popular emojis + a native text input for any emoji. Selecting commits `PUT { emoji }`, closes sheet, fires toast. _New component._
- [ ] **Emoji quick-pick set**: 30 emojis curated for finance app: 🍽️ 🍕 ☕ 🛒 🚗 ✈️ 🏠 💡 💊 💰 💸 💳 📈 📉 🎁 🎬 🎵 📱 👕 💄 🧴 ⛽ 🚇 🚲 🏥 📚 🎓 🐶 🪴 ⚙️. _Inline JS array constant._

### Interactions & States
- [ ] **Inline rename UX**: tap name → input, Enter or blur → save, Esc → revert. Loading state during PUT (subtle). Error → toast + revert. Empty name = revert (don't save).
- [ ] **Cache invalidation on edit**: after any PUT, clear `LS_CACHE` (bootstrap cache) + clear period expense caches (so renamed names show up everywhere on next render).
- [ ] **Drawer animations**: 200ms ease-out slide-in, 150ms ease-in slide-out. Overlay fades. Respect `prefers-reduced-motion`.
- [ ] **Toast strings**: "Renamed", "Icon updated", "Couldn't save". Reuse existing `toast()` function.

### Responsive & Polish
- [ ] **Hamburger placement**: 16px from left edge, vertically centered with screen-title. Hidden on add/income/transaction-detail sheets (no need for menu access during data entry).
- [ ] **Sidebar Settings entry visual parity**: matches existing nav-item layout, gear icon stroke matches the other 4 (1.6 stroke width, currentColor).
- [ ] **A11y pass**: `aria-label` on hamburger and edit buttons. Drawer is `role="dialog"` with focus trap. Esc closes drawer. Picker is `role="dialog"` with `aria-labelledby` pointing to the tab list.

### Slice 1 deploy
- [ ] **Deploy + smoke test**: `wrangler deploy`. Curl PUT endpoints. Browser test: rename a category, verify it shows everywhere.

---

## Slice 2 — Curated icons (50 SVGs) + Bank logos

Goal: extend the picker with non-emoji visual options.

### Foundation
- [ ] **Curated icon set**: bundle 50 Lucide-style inline SVGs in `worker.js` (or a new `icons.js` imported into the HTML). Categorized for picker scrolling: Food (8), Transport (6), Money (8), Home (6), Health (5), Shopping (5), Entertainment (5), Work (4), Misc (3). Each entry: `{ key: 'lucide:home', name: 'Home', svg: '<svg>...</svg>' }`. _New constant block._
- [ ] **Bank logo set**: bundle 11 Indian bank SVGs: ICICI, HDFC, SBI, BOB, YES, Axis, Kotak, IndusInd, Cred, Cash, Generic Card. Each: `{ key: 'bank:icici', name: 'ICICI', svg: '...' }`. Source from official brand logo assets (simplified single-color where possible). _New constant block._
- [ ] **Render helper for `iconUrl`**: extend the chip/icon render code on both shells to handle `lucide:*`, `bank:*`, `/uploads/*` prefixes — output `<svg>` for the first two, `<img>` for the third. Falls back to `emoji` then default. _Modifies render functions in `index-html.js` + `desktop-html.js`._

### Picker tabs
- [ ] **Add "Icons" tab to picker**: 6×N grid (mobile), 8×N (desktop). Search filter at top (filters by `name` contains query). Selecting fires `PUT { iconUrl: "lucide:..." }`. _Modifies picker._
- [ ] **Add "Banks" tab to picker (accounts only)**: 4×3 grid of bank logos. Auto-suggest by name match: highlight + scroll-to logo whose `name` is contained in the account's name. Selecting fires `PUT { iconUrl: "bank:..." }`. _Conditional tab._
- [ ] **Default tab logic**: opening picker for an account → default tab = "Banks". For categories/subcategories → default = "Icons". Within a session, remember last tab used.

### Interactions
- [ ] **Picker tab switching animation**: fade-cross 100ms between tab panels. Active tab indicator slides under the selected tab.
- [ ] **Selecting an icon**: 100ms scale-up bounce on the selected item + auto-close sheet 100ms later. Snappy enough that the user feels confirmed without waiting.

### Slice 2 deploy
- [ ] **Deploy + smoke test**: deploy, verify Icons tab opens, verify a Lucide pick renders correctly in expense form chip and transaction list.

---

## Slice 3 — Image upload (R2)

Goal: let the user upload a custom photo as an icon for any entity.

### Infrastructure
- [ ] **Create R2 bucket**: `npx wrangler r2 bucket create casex-expense-uploads`. _Out-of-code step._
- [ ] **Add R2 binding to `wrangler.toml`**: `[[r2_buckets]]` with `binding = "UPLOADS"`, `bucket_name = "casex-expense-uploads"`. _Modifies `wrangler.toml`._
- [ ] **`POST /api/d1/upload` endpoint**: accepts multipart or raw blob, validates content-type and max size (200KB after client resize, hard cap), generates UUID key, writes to R2, returns `{ key }`. _Modifies `worker.js`._
- [ ] **`GET /uploads/:key` endpoint**: reads R2 object, returns with `Cache-Control: public, max-age=31536000, immutable`, correct `Content-Type`. 404 on miss. _Modifies `worker.js`._

### Picker
- [ ] **Add "Upload" tab to picker**: file input with `accept="image/*" capture="environment"` (gives camera+gallery+files on iOS, file dialog on desktop). Preview area: 160×160 square. After file select, run client-side `<canvas>` resize → square center-crop to 128×128 → compress to ~50KB JPEG (PNG fallback for transparency). Show "Use this image" button under preview. _New tab._
- [ ] **Upload submit flow**: tap "Use this image" → POST blob to `/api/d1/upload` → on success, fire `PUT { iconUrl: "/uploads/:key" }` → close sheet → toast.
- [ ] **Loading + error states**: during POST, show spinner overlay on preview. On failure, toast "Couldn't upload" + keep preview so user can retry.

### Interactions
- [ ] **Replace previous upload**: if user re-uploads for an entity, the old R2 object becomes orphaned. Add cleanup: when PUT changes `iconUrl` from one `/uploads/:oldKey` to another, the worker deletes the old R2 object. _Modifies PUT handler._

### Slice 3 deploy
- [ ] **Deploy + smoke test**: upload a photo for one account, verify it renders everywhere, verify R2 stores object, verify `Cache-Control` returns long-lived.

---

## Cross-slice — Service-worker

- [ ] **SW cache bump**: bump `CACHE_NAME` from `ne-pwa-v3` to `ne-pwa-v4` so existing browsers re-activate and clear poisoned caches. Add `/uploads/*` to the API cache pattern (network-first, JSON guard not relevant — guard on `image/*` content-type).

## Review
- [ ] **Design review**: Run `/design-review` against the brief once Slice 1 lands. Re-run after each slice.
