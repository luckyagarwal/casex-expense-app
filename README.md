# Expense App

Personal finance web app built on Cloudflare Workers + D1 (SQLite). No external dependencies, no third-party APIs. Works as a PWA on mobile.

| URL | What you get |
|-----|--------------|
| `/` | Mobile PWA — add expenses, income, transfers |
| `/desktop` | Desktop dashboard — transactions, analytics, search, CSV export |

---

## Prerequisites

- [Node.js 18+](https://nodejs.org)
- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)

---

## Step 1 — Install dependencies

```bash
npm install
```

---

## Step 2 — Log in to Cloudflare

```bash
npx wrangler login
```

This opens a browser window. Approve access. You only need to do this once.

---

## Step 3 — Create the D1 database

```bash
npx wrangler d1 create YOUR-APP-NAME-db
```

Example output:

```
✅ Successfully created DB 'YOUR-APP-NAME-db'

[[d1_databases]]
binding = "DB"
database_name = "YOUR-APP-NAME-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` value and paste it into `wrangler.toml`:

```toml
name = "YOUR-APP-NAME"
main = "worker.js"
compatibility_date = "2024-12-30"

[[d1_databases]]
binding = "DB"
database_name = "YOUR-APP-NAME-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

Also update `name` to whatever you want your worker to be called.

---

## Step 4 — Apply the database schema

```bash
npx wrangler d1 execute YOUR-APP-NAME-db --file schema.sql --remote
```

This creates all tables (categories, subcategories, accounts, expenses, income, transfers).

---

## Step 5 — Deploy

```bash
npm run deploy
```

Your app is now live at:

```
https://YOUR-APP-NAME.YOUR-SUBDOMAIN.workers.dev
```

---

## Step 6 — Seed categories, subcategories and accounts

The repo includes `seed.sql` with a full set of categories, subcategories, and accounts — complete with icons and emojis. Run it once after the schema:

```bash
npx wrangler d1 execute YOUR-APP-NAME-db --file seed.sql --remote
```

This is safe to re-run — all inserts use `INSERT OR IGNORE` so existing data is never overwritten.

After seeding, the app has 19 categories (Apparel, Beauty, Food, Transport etc.), 35 subcategories (Swiggy, Blinkit, Cab, Grocery etc.) and 12 accounts (ICICI, SBI, Cash etc.) ready to use. Delete or rename any of them from the Settings tab inside the app.

---

## Step 7 — Add to your phone (PWA)

1. Open your deployed URL in **Safari** (iPhone) or **Chrome** (Android)
2. **iPhone**: tap Share → **Add to Home Screen**
3. **Android**: tap the install prompt or ⋮ → **Add to Home Screen**

---

## Step 8 — Protect with Google login (Cloudflare Access)

This locks your app so only your Google account can open it. Anyone else gets blocked.

### 8a — Create Google OAuth credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **New Project** → name it anything → **Create**
3. In the left sidebar go to **APIs & Services → Credentials**
4. Click **Configure Consent Screen** → **Get started**
   - App name: anything (e.g. `Expense App`)
   - User support email: your Gmail
   - Audience: **External**
   - Contact email: your Gmail
   - Accept policy → **Create**
5. Back on Credentials page click **Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: anything
   - Under **Authorized JavaScript origins** click **Add URI**:
     ```
     https://YOUR-TEAM-NAME.cloudflareaccess.com
     ```
   - Under **Authorized redirect URIs** click **Add URI**:
     ```
     https://YOUR-TEAM-NAME.cloudflareaccess.com/cdn-cgi/access/callback
     ```
   - Click **Create**
6. Copy the **Client ID** and **Client Secret** shown in the popup

> **How to find YOUR-TEAM-NAME**: Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Zero Trust** → **Settings** → **General** → look for **Team domain**. It will look like `https://XXXX.cloudflareaccess.com`. Use `XXXX` as your team name.

7. Back on the OAuth consent screen page click **Publish app** → **Confirm**
   - This removes the "testing mode" restriction so any email you allow can log in without being added as a test user

### 8b — Add Google as identity provider in Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Zero Trust**
2. In the left sidebar go to **Integrations → Identity providers**
3. Click **Add new identity provider**
4. Select **Google**
5. Paste your **Client ID** and **Client Secret**
6. Click **Save**
7. Click **Test** next to Google — a Google login window opens
8. Log in with your Google account — you should see **"Successfully connected"**

### 8c — Create an Access Application

1. In Zero Trust left sidebar go to **Access controls → Applications**
2. Click **Create new application**
3. Select **Self-hosted and private**
4. Click **Add public hostname**
5. Click **Switch to custom input** under the domain field
6. Paste your full workers.dev URL:
   ```
   YOUR-APP-NAME.YOUR-SUBDOMAIN.workers.dev
   ```
7. Scroll down to **Access policies** → click **Add a policy**
   - Policy name: anything (e.g. `Allow owner`)
   - Action: **Allow**
   - Under **Include** → click **Add include**
   - Selector: **Emails**
   - Value: your Google email address
   - Click **Save policy**
8. Scroll to **Authentication** section
   - Select **Google** from the identity providers list
   - Turn on **Apply instant authentication** (skips the Cloudflare login page, goes straight to Google)
9. Click **Create**

Your app now requires Google login. Anyone who isn't your email gets an Access Denied page.

---

## Run locally

```bash
npm run dev
```

- Mobile: `http://localhost:8787/`
- Desktop: `http://localhost:8787/desktop`

Local dev does not enforce Cloudflare Access — it runs unauthenticated.

---

## Customise

| What | Where |
|------|-------|
| Currency symbol | Search `₹` in `index-html.js` and `desktop-html.js` |
| Worker name | `wrangler.toml` → `name` |
| Database name | `wrangler.toml` → `database_name` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `D1_ERROR` on save | Schema not applied — run `npx wrangler d1 execute ... --file schema.sql --remote` |
| App loads but no categories/accounts | Seed the database via Settings tab or SQL file |
| Google login blocked — "doesn't comply with OAuth policy" | Redirect URI not saved correctly in Google Cloud — must end with `/cdn-cgi/access/callback` and be confirmed as a chip (press Enter after pasting) |
| Google login blocked — "Testing" mode | Publish the consent screen in Google Cloud: **OAuth consent screen → Publish app** |
| Access denied after Google login | Your email is not in the Access policy — add it in **Zero Trust → Access controls → Applications → Edit → Policy** |
| Data missing after redeploy | D1 data persists independently of Worker code — redeployment never touches data |
