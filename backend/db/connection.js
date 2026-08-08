// ============================================
// Webowo v3.0 – Database Connection
// ============================================

const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config/config');

const db = new Database(config.db.path);

// Apply PRAGMAs
config.db.pragma.forEach(sql => {
  try {
    db.exec(sql);
  } catch (e) {
    console.warn(`[DB] PRAGMA failed: ${sql} – ${e.message}`);
  }
});

// Enable WAL mode explicitly
try {
  db.exec('PRAGMA journal_mode = WAL');
} catch (e) {
  console.warn('[DB] WAL mode failed:', e.message);
}

module.exports = db;
