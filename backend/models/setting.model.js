// ============================================
// Webowo v3.1 – Setting Model
// ============================================

const db = require('../db/database');

class SettingModel {
  constructor() {
    this.table = 'settings';
  }

  findAll() {
    return db.prepare(`SELECT * FROM ${this.table} ORDER BY key ASC`).all();
  }

  findPublic() {
    return db.prepare(`SELECT key, value FROM ${this.table} WHERE is_public = 1 ORDER BY key ASC`).all();
  }

  findByKey(key) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE key = ?`).get(key);
  }

  set(key, value, isPublic = false, category = 'general') {
    const existing = this.findByKey(key);
    if (existing) {
      db.prepare(`UPDATE ${this.table} SET value = ?, is_public = ?, category = ?, updated_at = datetime('now') WHERE key = ?`).run(value, isPublic ? 1 : 0, category, key);
    } else {
      db.prepare(`INSERT INTO ${this.table} (key, value, is_public, category) VALUES (?, ?, ?, ?)`).run(key, value, isPublic ? 1 : 0, category);
    }
    return this.findByKey(key);
  }

  delete(key) {
    return db.prepare(`DELETE FROM ${this.table} WHERE key = ?`).run(key);
  }
}

module.exports = new SettingModel();
