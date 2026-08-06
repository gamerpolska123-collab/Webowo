// @ts-check
// ============================================
// Database Wrapper (legacy compat)
// ============================================

const { getDb } = require('./connection');

// Lazy singleton
const db = getDb();

module.exports = db;
