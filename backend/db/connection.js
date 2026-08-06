// @ts-check
// ============================================
// Database Connection
// ============================================

const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config/config');
const { logger } = require('../utils/logger');

let db = null;

function getDb() {
  if (!db) {
    db = new Database(config.db.path);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('temp_store = MEMORY');
    db.pragma('mmap_size = 30000000000');
    logger.info(`Database connected: ${config.db.path}`);
  }
  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

module.exports = { getDb, closeDb };
