import { getDb } from '../db.js'

// ── Schema ─────────────────────────────────────────────────────────────────────

export function initCastSchema(): void {
  getDb().exec(`
    CREATE TABLE IF NOT EXISTS cast_items (
      token      TEXT    NOT NULL,
      imdb_id    TEXT    NOT NULL,
      hash       TEXT    NOT NULL,
      file_url   TEXT    NOT NULL DEFAULT '',
      size_mb    INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
      PRIMARY KEY (token, imdb_id)
    );
    CREATE INDEX IF NOT EXISTS cast_items_token ON cast_items(token);
  `)
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CastItem {
  token:     string
  imdbId:    string
  hash:      string
  fileUrl:   string
  sizeMb:    number
  updatedAt: string
}

// ── CRUD ───────────────────────────────────────────────────────────────────────

export function saveCastItem(item: Omit<CastItem, 'updatedAt'>): void {
  getDb().prepare(`
    INSERT INTO cast_items (token, imdb_id, hash, file_url, size_mb)
    VALUES (@token, @imdbId, @hash, @fileUrl, @sizeMb)
    ON CONFLICT(token, imdb_id) DO UPDATE SET
      hash       = excluded.hash,
      file_url   = excluded.file_url,
      size_mb    = excluded.size_mb,
      updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
  `).run(item)
}

export function getCastItem(token: string, imdbId: string): CastItem | null {
  const r = getDb().prepare(
    `SELECT * FROM cast_items WHERE token = ? AND imdb_id = ?`
  ).get(token, imdbId) as Record<string, unknown> | undefined
  return r ? rowToCast(r) : null
}

export function listCastItems(token: string): CastItem[] {
  return (getDb().prepare(
    `SELECT * FROM cast_items WHERE token = ? ORDER BY updated_at DESC`
  ).all(token) as Record<string, unknown>[]).map(rowToCast)
}

export function deleteCastItem(token: string, imdbId: string): void {
  getDb().prepare(`DELETE FROM cast_items WHERE token = ? AND imdb_id = ?`).run(token, imdbId)
}

function rowToCast(r: Record<string, unknown>): CastItem {
  return {
    token:     r.token     as string,
    imdbId:    r.imdb_id   as string,
    hash:      r.hash      as string,
    fileUrl:   r.file_url  as string,
    sizeMb:    r.size_mb   as number,
    updatedAt: r.updated_at as string,
  }
}
