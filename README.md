# Notion Expense PWA

A tiny web app on Cloudflare Workers that logs expenses into your Notion Expenses database, with recent-5 chips for Category, Subcategory, and Account, plus autocomplete with inline create.

## Project structure

```
notion-expense-pwa/
├── worker.js                   # Routes: /, /api/bootstrap, /api/expense, /healthz
├── index-html.js               # Mobile-first PWA form (imported into worker.js)
├── wrangler.toml               # Worker config (name, DB IDs, compat date)
├── package.json                # Declares the wrangler dev dep
├── .gitignore                  # Ignores node_modules, .wrangler, .dev.vars, .env, etc.
├── .dev.vars.example           # Template for local secrets (copy to .dev.vars)
├── setup-github.sh             # One-shot: gh auth + git init + private repo + push
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI: auto-deploy to Cloudflare on push to main
└── README.md
```

Runtime split is intentional: `worker.js` is a tiny router + Notion client, `index-html.js` is just the shipped HTML string. This keeps the Worker easy to diff when you're tweaking server logic without touching the UI, and vice versa.

## Before you deploy

Two things you need from Notion:

1. **Integration token.** Go to https://www.notion.so/profile/integrations → **New integration** → name it anything → copy the Internal Integration Secret (starts with `secret_` or `ntn_`).
2. **Share your databases with the integration.** Open each of these four databases in Notion, click `...` → **Connections** → pick your integration:
   - Expenses
   - Categories
   - Subcategories
   - Accounts

   If any one of these isn't shared, `/api/bootstrap` will return a 403 from Notion.

## Deploy in ~5 minutes

```bash
# 1. One-time: install Node (18+) and the Cloudflare CLI
npm install

# 2. Log in to Cloudflare (browser opens)
npx wrangler login

# 3. Set the two secrets (prompts for value, stores encrypted)
npx wrangler secret put NOTION_TOKEN     # paste your integration token
npx wrangler secret put SHARED_SECRET    # any random string, e.g. openssl rand -hex 16

# 4. Deploy
npx wrangler deploy
```

`wrangler deploy` prints a URL like `https://notion-expense.<your-subdomain>.workers.dev`. Keep it open.

## Get it onto your iPhone

1. Open Safari on your iPhone.
2. Go to `https://notion-expense.<your-subdomain>.workers.dev/?k=YOUR_SHARED_SECRET` — note the `?k=`. The app strips the secret from the URL and stores it in local storage after the first load.
3. Tap Share → **Add to Home Screen** → name it "Expense". It now behaves like a native app.
4. Tap the home-screen icon → amount keyboard appears immediately. Fill in, tap a chip for category/account, Save.

## Daily use

- Most common accounts/categories/subcategories appear as suggestion chips above each search box. Tap a chip, done.
- Search box supports fuzzy-ish substring match. Type something new → "+ Create …" appears → tap to save the new relation row alongside the expense in a single submit.
- After Category is picked, the Subcategory chips re-rank to show subcategories that have historically been used with that category.
- On save, the form clears Amount and Expense name but keeps Category/Subcategory/Account selected — handy when you're logging several items in the same sitting. Tap the ✕ on a chip to reset it.

## Security notes

- `SHARED_SECRET` is the only thing preventing anyone with the Worker URL from logging expenses on your behalf. Make it long and random. Rotate by running `wrangler secret put SHARED_SECRET` again.
- The Notion token never leaves the Worker. The browser only sends `X-Auth: <SHARED_SECRET>`.
- If you leak the secret (e.g. screen-share a QR), rotate it and clear the home-screen bookmark's localStorage by deleting and re-adding the site.
- Cloudflare's free tier is 100k requests/day — plenty.

## Changing things

- **Currency symbol** — edit `<span class="currency">₹</span>` in `index-html.js`.
- **Fiat formatting for Amount** — the form submits raw number; Notion stores it as the number format you've set on the database column (rupee in your case).
- **Add "Notes" field** — add a new `<input>` in `index-html.js`, include `notes` in the payload, and in `worker.js` map it to a new property. Your Expenses DB doesn't have a notes column yet; if you want one, add it in Notion first.
- **Custom domain** — uncomment the `[[routes]]` block in `wrangler.toml` after you add a zone to Cloudflare.

## Troubleshooting

- **401 on load** — your `X-Auth` header doesn't match `SHARED_SECRET`. Re-enter via `?k=...` query param.
- **500 on bootstrap** — usually means the integration isn't shared with one of the four databases. Check the error JSON in DevTools → Network for which database ID it's complaining about.
- **Amount saved as string** — shouldn't happen with this worker (it calls `Number(amount)`), but if it ever does, check that `amount` arrives as a JS number in the request body.
- **Created category but it didn't appear** — the worker re-fetches bootstrap after every save, so give it a moment, or pull to refresh by closing/reopening the PWA.
- **Clear everything** — long-press the home-screen icon → Remove Bookmark → re-add from Safari. This clears the cached secret + bootstrap.

## Rollback / redeploy

`wrangler deployments list` shows history, and `wrangler rollback [deployment-id]` reverts. Changes to `worker.js` or `index-html.js` are live after `npm run deploy` (usually < 10 seconds).

## Develop locally

You can run the Worker on your laptop against the real Notion API before pushing:

```bash
# One-time: copy the template and fill in real values
cp .dev.vars.example .dev.vars
# Then edit .dev.vars:
#   NOTION_TOKEN="ntn_..."       ← your integration token
#   SHARED_SECRET="letmein123"   ← any string; you'll pass it as ?k= in dev too

npm install
npx wrangler dev
```

Wrangler prints a `http://localhost:8787` URL. Open `http://localhost:8787/?k=letmein123` to unlock the PWA, then iterate on `worker.js` / `index-html.js` — changes hot-reload.

`.dev.vars` is gitignored, so your token never gets committed. Production values stay in `wrangler secret put …` land (encrypted, never in git).

## Push to GitHub

First time, from inside this folder:

```bash
./setup-github.sh
```

The script will:

1. Check `gh` (GitHub CLI) and `git` are installed. Install `gh` with `brew install gh` if you don't have it.
2. Prompt `gh auth login` in your browser if you're not logged in.
3. `git init -b main` if needed.
4. Stage only the project files (not `.wrangler/`, not `.dev.vars`) and commit as "Initial commit: Notion Expense PWA".
5. Create a **private** repo named `notion-expense-pwa` on your GitHub account and push.

Override the repo name: `./setup-github.sh my-expense-app`. To make it public, change `VISIBILITY="--private"` at the top of the script.

After that, regular git flow: `git add …`, `git commit`, `git push`.

## CI deploy (push to main → live in ~30s)

`.github/workflows/deploy.yml` already wires `git push origin main` to a Cloudflare deploy via [`cloudflare/wrangler-action@v3`](https://github.com/cloudflare/wrangler-action). You just need to give Actions two secrets:

1. **`CLOUDFLARE_API_TOKEN`** — Create at https://dash.cloudflare.com/profile/api-tokens → **Create Token** → use the **"Edit Cloudflare Workers"** template → **Continue** → **Create Token** → copy the value (you'll only see it once).
2. **`CLOUDFLARE_ACCOUNT_ID`** — Visible on the right sidebar of any page at https://dash.cloudflare.com, or under Workers & Pages → Overview.

Then, in your GitHub repo:

- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
- Add both: name them exactly `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

Now every push to `main` runs `npm ci` and `wrangler deploy` on GitHub's runners. You can also trigger manually from the **Actions** tab → **Deploy to Cloudflare Workers** → **Run workflow**.

Note: the two Worker secrets (`NOTION_TOKEN`, `SHARED_SECRET`) live on Cloudflare's side and **don't** need to be set as GitHub secrets — `wrangler deploy` doesn't touch them, it only uploads the code. Changing them is still `wrangler secret put …` from your Mac.

## Adding new features safely

The typical loop:

1. Branch: `git checkout -b add-notes-field`
2. Edit `worker.js` / `index-html.js`
3. `npx wrangler dev` — poke at `localhost:8787/?k=…` on desktop Safari (Responsive Design Mode → iPhone) to sanity-check
4. `git commit -am "Add notes field"` → `git push -u origin add-notes-field`
5. Open a PR on GitHub. When merged to `main`, CI deploys automatically.

If CI breaks, the Worker keeps running the previous version — nothing on your phone changes until a green deploy replaces it.
