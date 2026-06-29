import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

let db = null

export function initDB() {
  const dbDir = path.join(app.getPath('userData'), 'db')
  fs.mkdirSync(dbDir, { recursive: true })

  const dbPath = path.join(dbDir, 'members.db')
  db = new Database(dbPath)

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name  TEXT    NOT NULL CHECK(length(trim(company_name)) > 0),
      ceo_name      TEXT    NOT NULL CHECK(length(trim(ceo_name)) > 0),
      contact_name  TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      joined_at     DATE    NOT NULL,
      status        TEXT    NOT NULL DEFAULT 'active'
                            CHECK(status IN ('active', 'dormant', 'withdrawn')),
      memo          TEXT,
      created_at    DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at    DATETIME NOT NULL DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS dues (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id  INTEGER NOT NULL REFERENCES members(id),
      year       INTEGER NOT NULL CHECK(year >= 2000 AND year <= 2100),
      amount     INTEGER NOT NULL CHECK(amount > 0),
      paid_at    DATE    NOT NULL,
      created_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
      UNIQUE(member_id, year)
    );

    CREATE TABLE IF NOT EXISTS dues_settings (
      year        INTEGER PRIMARY KEY CHECK(year >= 2000 AND year <= 2100),
      base_amount INTEGER NOT NULL CHECK(base_amount > 0),
      created_at  DATETIME NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at  DATETIME NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `)

  return db
}

export function getDB() {
  return db
}
