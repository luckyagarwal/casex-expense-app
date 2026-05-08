-- Expense Tracker — D1 Schema
-- Local:      npx wrangler d1 execute casex-expense-db --file schema.sql
-- Production: npx wrangler d1 execute casex-expense-db --file schema.sql --remote

CREATE TABLE IF NOT EXISTS categories (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  emoji    TEXT DEFAULT '',
  icon_url TEXT,
  type     TEXT NOT NULL DEFAULT 'expense'  -- 'expense' | 'income' | 'both'
);

CREATE TABLE IF NOT EXISTS subcategories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  icon_url    TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  emoji    TEXT DEFAULT '',
  icon_url TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
  id             TEXT PRIMARY KEY,
  date           TEXT NOT NULL,          -- ISO 8601 date string YYYY-MM-DD
  amount         REAL NOT NULL,
  note           TEXT DEFAULT '',
  category_id    TEXT REFERENCES categories(id),
  subcategory_id TEXT REFERENCES subcategories(id),
  account_id     TEXT REFERENCES accounts(id),
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS income (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  amount      REAL NOT NULL,
  note        TEXT DEFAULT '',
  source      TEXT DEFAULT '',
  category_id TEXT REFERENCES categories(id),
  account_id  TEXT REFERENCES accounts(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Idempotent migrations for existing databases
-- Safe to re-run; errors on already-existing columns are silently ignored by the app
-- ALTER TABLE income ADD COLUMN category_id TEXT REFERENCES categories(id);

CREATE TABLE IF NOT EXISTS transfers (
  id              TEXT PRIMARY KEY,
  date            TEXT NOT NULL,
  amount          REAL NOT NULL,
  note            TEXT DEFAULT '',
  from_account_id TEXT REFERENCES accounts(id),
  to_account_id   TEXT REFERENCES accounts(id),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_expenses_date        ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category    ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_account     ON expenses(account_id);
CREATE INDEX IF NOT EXISTS idx_income_date          ON income(date DESC);
CREATE INDEX IF NOT EXISTS idx_income_account       ON income(account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date       ON transfers(date DESC);
CREATE INDEX IF NOT EXISTS idx_subcategories_cat    ON subcategories(category_id);
