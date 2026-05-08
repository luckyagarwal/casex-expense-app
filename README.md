# casexExpenseApp

Personal finance web app built on Cloudflare Workers + D1 (SQLite). No external dependencies, no third-party APIs.

| URL | What you get |
|-----|--------------|
| `/` | Mobile PWA — add expenses, income, transfers on the go |
| `/desktop` | Desktop dashboard — transactions, analytics, search, CSV export |

---

## Prerequisites

- [Node.js 18+](https://nodejs.org)
- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the D1 database

```bash
npx wrangler d1 create casex-expense-db
```

Copy the returned `database_id` into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "casex-expense-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 3. Apply the schema

```bash
npx wrangler d1 execute casex-expense-db --file schema.sql
```

### 4. Run locally

```bash
npm run dev
```

- Mobile PWA: `http://localhost:8787/`
- Desktop app: `http://localhost:8787/desktop`

---

## Deploy to Cloudflare

```bash
# Log in (opens browser)
npx wrangler login

# Apply schema to production D1
npx wrangler d1 execute casex-expense-db --file schema.sql --remote

# Deploy
npm run deploy
```

Live at `https://casex-expense.<your-subdomain>.workers.dev`.

---

## Seed data (optional)

Manually insert lookup rows via the D1 console or wrangler:

```bash
npx wrangler d1 execute casex-expense-db --remote --command \
  "INSERT INTO categories (id,name,emoji) VALUES (lower(hex(randomblob(16))),'Food','🍔')"
```

Or bulk-insert via a SQL file:

```bash
npx wrangler d1 execute casex-expense-db --remote --file seed.sql
```

---

## Add to your phone (PWA)

1. Open your deployed URL in **Safari** (iPhone) or Chrome (Android)
2. iOS: tap **Share → Add to Home Screen**
3. Android: tap the **Install** prompt or **⋮ → Add to Home Screen**

---

## Using the app

### Mobile (`/`)
- **Expense tab** — amount, category, subcategory, account → Save
- **Income tab** — amount, source, category, account → Save
- **Transfer tab** — from account, to account, amount → Save
- Tap any transaction to edit or delete
- Works offline — cached responses serve from the service worker

### Desktop (`/desktop`)
- **Overview** — balance, income vs expenses, recent transactions
- **Transactions** — full list by period and type, CSV export
- **Analytics** — income vs expenses, income by source, spending by account, category breakdown
- **Search** — full-text + date range + filters + sort, CSV export

---

## Customize

| What | Where |
|------|-------|
| Currency symbol | Search `₹` in `index-html.js` / `desktop-html.js` |
| App name / worker name | `wrangler.toml` → `name` |
| Custom domain | Uncomment `[[routes]]` in `wrangler.toml` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `D1_ERROR` on save | Make sure `schema.sql` was applied (`--remote` for production) |
| Desktop shows no data | Verify the D1 `database_id` in `wrangler.toml` matches your database |
| Data missing after redeploy | D1 data persists — redeployment only updates Worker code |
