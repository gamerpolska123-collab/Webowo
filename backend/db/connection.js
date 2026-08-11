// ============================================
// Webowo v3.1 – Database Connection
// ============================================

const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config/config');

let db = null;

function getDb() {
  if (!db) {
    db = new Database(config.db.path);
    config.db.pragma.forEach(sql => {
      try {
        db.exec(sql);
      } catch (e) {
        console.warn(`[DB] PRAGMA failed: ${sql} – ${e.message}`);
      }
    });
    try {
      db.exec('PRAGMA journal_mode = WAL');
    } catch (e) {
      console.warn('[DB] WAL mode failed:', e.message);
    }
  }
  return db;
}

function closeDb() {
  if (db) {
    try {
      db.close();
    } catch (e) {
      console.warn('[DB] Close failed:', e.message);
    }
    db = null;
  }
}

const dbInstance = getDb();

module.exports = dbInstance;
module.exports.getDb = getDb;
module.exports.closeDb = closeDb;
