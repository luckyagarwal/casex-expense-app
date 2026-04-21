#!/usr/bin/env bash
# One-shot: initialize git, create a private GitHub repo, commit, push.
# Run this once from inside the notion-expense-pwa folder.
#
# Usage:
#   chmod +x setup-github.sh
#   ./setup-github.sh [repo-name]
#
# Requires: gh (GitHub CLI). Install on macOS: `brew install gh`
# The script will prompt you to `gh auth login` if you're not logged in.

set -euo pipefail

REPO_NAME="${1:-notion-expense-pwa}"
VISIBILITY="--private"   # change to --public if you want it public

# --- sanity checks ---
if ! command -v gh >/dev/null 2>&1; then
  echo "✖ gh (GitHub CLI) is not installed."
  echo "  Install it first:  brew install gh"
  echo "  Then rerun this script."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "✖ git is not installed. Install Xcode command line tools: xcode-select --install"
  exit 1
fi

# Must be in the project folder
for f in worker.js wrangler.toml index-html.js; do
  if [ ! -f "$f" ]; then
    echo "✖ Expected to find $f in the current folder."
    echo "  cd into notion-expense-pwa/ first, then rerun."
    exit 1
  fi
done

# --- gh auth ---
if ! gh auth status >/dev/null 2>&1; then
  echo "→ Not logged in to gh. Launching gh auth login (browser flow)…"
  gh auth login --web --git-protocol https
fi

GH_USER=$(gh api user -q .login)
echo "→ Logged in as: $GH_USER"

# --- git init if needed ---
if [ ! -d .git ]; then
  echo "→ git init"
  git init -b main
fi

# --- .gitignore already lives in the folder; verify it ---
if [ ! -f .gitignore ]; then
  echo "✖ .gitignore missing. Bail out — you'd commit node_modules/secrets."
  exit 1
fi

# --- commit ---
echo "→ Staging files…"
git add .gitignore .dev.vars.example .github README.md package.json worker.js index-html.js wrangler.toml setup-github.sh
git status --short

if git diff --cached --quiet; then
  echo "→ Nothing to commit (already committed?). Continuing."
else
  echo "→ git commit"
  git commit -m "Initial commit: Notion Expense PWA"
fi

# --- create remote ---
if gh repo view "$GH_USER/$REPO_NAME" >/dev/null 2>&1; then
  echo "→ Repo $GH_USER/$REPO_NAME already exists on GitHub."
  REMOTE_URL="https://github.com/$GH_USER/$REPO_NAME.git"
else
  echo "→ Creating private repo $GH_USER/$REPO_NAME on GitHub…"
  gh repo create "$REPO_NAME" $VISIBILITY --source=. --remote=origin --push
  echo "→ Done. Repo URL: https://github.com/$GH_USER/$REPO_NAME"
  exit 0
fi

# If the repo existed already, wire up the remote + push
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REMOTE_URL"
fi
git branch -M main
git push -u origin main
echo "→ Pushed to $REMOTE_URL"
