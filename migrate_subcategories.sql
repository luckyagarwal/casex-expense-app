-- Migration: remove category_id from subcategories (make subcategories independent)
-- SQLite doesn't support DROP COLUMN on older versions, so recreate the table.

PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS subcategories_new (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  icon_url TEXT
);

INSERT INTO subcategories_new (id, name, icon_url)
  SELECT id, name, icon_url FROM subcategories;

DROP TABLE subcategories;

ALTER TABLE subcategories_new RENAME TO subcategories;

PRAGMA foreign_keys = ON;
