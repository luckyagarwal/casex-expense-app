# Expense App

Personal finance web app built on Cloudflare Workers + D1 (SQLite). No external dependencies, no third-party APIs. Works as a PWA on mobile.

| URL | What you get |
|-----|--------------|
| `/` | Mobile PWA — add expenses, income, transfers |
| `/desktop` | Desktop dashboard — transactions, analytics, search, CSV export |

---

## What you need before starting

- **Node.js 18 or higher** — download from [nodejs.org](https://nodejs.org). After installing, verify it works by running `node -v` in your terminal. You should see a version number like `v20.11.0`.
- **A free Cloudflare account** — sign up at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up). No credit card needed.
- **A terminal** — Terminal on Mac, Command Prompt or PowerShell on Windows.
- **The project files** — clone or download this repository to a folder on your computer.

Open your terminal, navigate to the project folder, and run the steps below in order.

---

## Step 1 — Install dependencies

```bash
npm install
```

**What this does:** Downloads the tools this project needs (primarily `wrangler`, which is Cloudflare's command-line tool). You only need to run this once when setting up the project.

**What you should see:** A list of packages being installed. It ends without any error messages.

---

## Step 2 — Log in to Cloudflare

```bash
npx wrangler login
```

**What this does:** Opens a browser window asking you to log in to your Cloudflare account and grant permission for `wrangler` to manage your Cloudflare resources from the terminal.

**What you should see:** A browser tab opens. Click **Allow**. Return to the terminal — you should see `Successfully logged in`.

**Note:** You only need to do this once. Your login is saved on your computer.

---

## Step 3 — Create the database

```bash
npx wrangler d1 create sanjana-expense-db
```

**Breaking down this command:**
- `npx wrangler` — runs the Cloudflare CLI tool
- `d1 create` — tells wrangler to create a new D1 database (D1 is Cloudflare's serverless SQLite database)
- `sanjana-expense-db` — the name you are giving this database. You can use any name you like, but use only letters, numbers, and hyphens. Remember this name — you will use it in later commands.

**What you should see:**

```
✅ Successfully created DB 'sanjana-expense-db'

[[d1_databases]]
binding = "DB"
database_name = "sanjana-expense-db"
database_id = "97877bc3-5932-47cf-b511-5d43d3989ed9"
```

The `database_id` is a unique identifier Cloudflare assigned to your database. **Copy this value** — you need it in the next sub-step.

### Update wrangler.toml

Open the file `wrangler.toml` in this project folder. It looks like this:

```toml
name = "casex-expense-app"
main = "worker.js"
compatibility_date = "2024-12-30"
account_id = "YOUR_ACCOUNT_ID"

[[d1_databases]]
binding = "DB"
database_name = "casex-expense-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

Make two changes:

1. **`name`** — change `casex-expense-app` to whatever you want your app to be called. This becomes part of your app's URL. Example: `sanjana-expense-app` → your URL will be `sanjana-expense-app.YOUR-SUBDOMAIN.workers.dev`. Use only lowercase letters, numbers, and hyphens.

2. **`database_name`** — change `casex-expense-db` to the database name you used in the command above (e.g. `sanjana-expense-db`).

3. **`database_id`** — replace `PASTE_YOUR_DATABASE_ID_HERE` with the `database_id` value you copied from the terminal output above.

4. **`account_id`** — replace `YOUR_ACCOUNT_ID` with your Cloudflare account ID. To find it: go to [dash.cloudflare.com](https://dash.cloudflare.com) → click any domain or go to the main page → look for **Account ID** on the right side panel. It is a long string of letters and numbers.

**Example of a correctly filled wrangler.toml:**

```toml
name = "sanjana-expense-app"
main = "worker.js"
compatibility_date = "2024-12-30"
account_id = "a214e1a172a482b1400e954b9b8205c5"

[[d1_databases]]
binding = "DB"
database_name = "sanjana-expense-db"
database_id = "97877bc3-5932-47cf-b511-5d43d3989ed9"
```

Save the file.

---

## Step 4 — Create the database tables

```bash
npx wrangler d1 execute sanjana-expense-db --file schema.sql --remote
```

**Breaking down this command:**
- `d1 execute` — runs SQL commands against a D1 database
- `sanjana-expense-db` — the name of your database (same name you used in Step 3 — replace this with whatever name you chose)
- `--file schema.sql` — tells wrangler to read SQL from the file `schema.sql` (already included in this project). This file contains the instructions to create all the tables: categories, subcategories, accounts, expenses, income, and transfers.
- `--remote` — runs the commands on the real Cloudflare database (not a local copy). Always include this flag when setting up for production.

**What you should see:** Output ending with `"changed_db": true` and no errors.

---

## Step 5 — Load default categories, subcategories and accounts

```bash
npx wrangler d1 execute sanjana-expense-db --file seed.sql --remote
```

**Breaking down this command:**
- `d1 execute` — runs SQL commands against a D1 database
- `sanjana-expense-db` — same database name from Step 3
- `--file seed.sql` — reads from `seed.sql` (already included in this project). This file inserts 19 categories (Food, Transport, Health etc.), 35 subcategories (Swiggy, Blinkit, Cab, Grocery etc.) and 12 accounts (ICICI, SBI, Cash etc.) — all with their icons and emojis pre-configured.
- `--remote` — runs on the real Cloudflare database

**What you should see:** Output showing `"rows_written": 167` and no errors.

**Note:** This is safe to re-run at any time. It uses `INSERT OR IGNORE` which means it skips any rows that already exist — it will never duplicate or overwrite your data.

You can add, rename, or delete any of these from the **Settings** tab inside the app after deploying.

---

## Step 6 — Deploy the app

```bash
npm run deploy
```

**What this does:** Builds and uploads your app to Cloudflare's network. It uses the settings in `wrangler.toml` to know which account, worker name, and database to use.

**What you should see:**

```
Uploaded sanjana-expense-app (12.37 sec)
Deployed sanjana-expense-app triggers (5.78 sec)
  https://sanjana-expense-app.casexexpense.workers.dev
```

The URL at the bottom is your live app. Open it in a browser to confirm it works.

---

## Step 7 — Add to your phone (PWA)

1. Open your deployed URL in **Safari** (iPhone) or **Chrome** (Android)
2. **iPhone**: tap the Share icon → **Add to Home Screen** → **Add**
3. **Android**: tap the install prompt at the bottom, or tap ⋮ → **Add to Home Screen**

The app icon will appear on your home screen and opens full-screen like a native app.

---

## Step 8 — Protect with Google login (Cloudflare Access)

By default your app URL is public — anyone who has the link can open it. This step locks it so only your Google account can log in. Anyone else is blocked.

This uses **Cloudflare Access** (free for up to 50 users) — it intercepts every visit to your URL and forces a Google login before the app loads.

### 8a — Find your Cloudflare Zero Trust team name

You need this before going to Google.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar click **Zero Trust**
3. If this is your first time opening Zero Trust, it will ask you to choose a **team name**. Pick anything (e.g. `sanjana`). This cannot be changed later.
4. Go to **Settings → General**
5. Look for **Team domain** — it shows something like `https://sanjana.cloudflareaccess.com`
6. Your team name is the part before `.cloudflareaccess.com` — in this example it is `sanjana`

Write this down. You will use it in the next section.

---

### 8b — Create Google OAuth credentials

This allows Cloudflare to use Google as the login provider.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in with your Google account
2. Click the project dropdown at the very top of the page → **New Project**
   - Project name: anything (e.g. `Sanjana Expense App`)
   - Click **Create**
   - Wait a few seconds, then click the notification bell or the dropdown to select your new project
3. In the left sidebar go to **APIs & Services → Credentials**
4. Click **Configure Consent Screen** → **Get started**
   - **App name**: anything (e.g. `Expense App`)
   - **User support email**: your Gmail address
   - **Audience**: select **External**
   - **Contact email**: your Gmail address
   - Check the policy checkbox → click **Create**
5. You are now on the OAuth consent screen overview. Click **Publish app** → **Confirm**
   - This removes Google's "testing mode" restriction. Without this, only pre-approved test users can log in.
6. In the left sidebar go to **APIs & Services → Credentials**
7. Click **Create Credentials → OAuth client ID**
   - **Application type**: select **Web application**
   - **Name**: anything (e.g. `Cloudflare Access`)
   - Under **Authorized JavaScript origins** click **Add URI** and enter:
     ```
     https://sanjana.cloudflareaccess.com
     ```
     Replace `sanjana` with your actual team name from Step 8a.
   - Under **Authorized redirect URIs** click **Add URI** and enter:
     ```
     https://sanjana.cloudflareaccess.com/cdn-cgi/access/callback
     ```
     Replace `sanjana` with your actual team name. The `/cdn-cgi/access/callback` part must be exactly as shown — do not change it.
   - After typing each URI, press **Enter** to confirm it (it should appear as a tag/chip). If it doesn't appear as a chip, the URI is not saved.
   - Click **Create**
8. A popup shows your **Client ID** and **Client Secret**. Copy both — you need them in the next section. If you close the popup, you can find them again by clicking the OAuth client name on the Credentials page.

---

### 8c — Add Google as login provider in Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Zero Trust**
2. In the left sidebar go to **Integrations → Identity providers**
3. Click **Add new identity provider**
4. Select **Google**
5. Paste the **Client ID** and **Client Secret** you copied in Step 8b
6. Click **Save**
7. Click **Test** next to Google — a Google login window opens
8. Sign in with your Google account. You should see **"Successfully connected"**. If you see an error, re-check the redirect URI in Google Cloud (Step 8b point 7) — it must end exactly with `/cdn-cgi/access/callback`.

---

### 8d — Create an Access Application to protect your URL

Do this once for your app. If you want to protect a second app (e.g. your wife's), repeat this section for that URL.

1. In Zero Trust left sidebar go to **Access controls → Applications**
2. Click **Create new application**
3. Select **Self-hosted and private**
4. Click **Add public hostname**
5. Under the domain input field, click **Switch to custom input**
6. Type your full workers.dev URL — exactly as it appears, without `https://`:
   ```
   sanjana-expense-app.casexexpense.workers.dev
   ```
   Replace this with your actual URL from Step 6.
7. Scroll down to **Access policies** → click **Add a policy**
   - **Policy name**: anything (e.g. `Allow owner`)
   - **Action**: **Allow**
   - Under **Include** click **Add include**
   - **Selector**: choose **Emails** from the dropdown
   - **Value**: type your Google email address (the one you want to be allowed in)
   - Click **Save policy**
8. Scroll down to **Authentication**
   - Click on **Google** to select it as the identity provider
   - Toggle on **Apply instant authentication** — this skips the intermediate Cloudflare login page and takes the user straight to Google sign-in
9. Click **Create**

Your app now requires a Google login. Visit your URL — you will be redirected to Google. After signing in with the correct email, you land on the app. Any other email gets an **Access Denied** page.

---

## Run locally (for development)

```bash
npm run dev
```

**What this does:** Starts a local development server on your machine. No changes are deployed to Cloudflare.

- Mobile view: [http://localhost:8787/](http://localhost:8787/)
- Desktop view: [http://localhost:8787/desktop](http://localhost:8787/desktop)

The local server connects to your real Cloudflare D1 database by default. Cloudflare Access login is not enforced locally — the app opens directly without asking for Google login.

---

## Customise

| What to change | Where to change it |
|---|---|
| Currency symbol (₹) | Search for `₹` in `index-html.js` and `desktop-html.js` and replace with your currency symbol |
| App/worker name | `wrangler.toml` → `name` field |
| Database name | `wrangler.toml` → `database_name` field (must match what you created in Step 3) |

---

## Troubleshooting

| Problem | What it means | Fix |
|---|---|---|
| `D1_ERROR` when saving a transaction | The database tables don't exist yet | Run Step 4 again: `npx wrangler d1 execute YOUR-DB-NAME --file schema.sql --remote` |
| App opens but no categories or accounts appear | The seed data was not loaded | Run Step 5 again: `npx wrangler d1 execute YOUR-DB-NAME --file seed.sql --remote` |
| Google login error: "doesn't comply with OAuth 2.0 policy" | The redirect URI in Google Cloud is wrong or not saved | Go to Google Cloud → Credentials → your OAuth client → check that `https://YOUR-TEAM.cloudflareaccess.com/cdn-cgi/access/callback` is listed under Authorized redirect URIs **and** appears as a confirmed chip (you must press Enter after pasting) |
| Google login error: "This app is blocked" or "Testing" | The consent screen is still in testing mode | Go to Google Cloud → APIs & Services → OAuth consent screen → click **Publish app** → Confirm |
| "Access Denied" after signing in to Google | Your email is not in the Cloudflare Access policy | Go to Zero Trust → Access controls → Applications → click your app → Edit → Policies → edit the policy → add your email under Include → Emails |
| Data disappears after redeploying | This should not happen | D1 database data is stored separately from the Worker code. Redeploying only updates the code, never the data. |
| `wrangler: command not found` | Wrangler is not installed | Run `npm install` first (Step 1) then use `npx wrangler` instead of `wrangler` |
