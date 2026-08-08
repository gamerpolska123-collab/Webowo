// ============================================
// Webowo v3.0 – Setting Model
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

  set(key, value, isPublic = false) {
    const existing = this.findByKey(key);
    if (existing) {
      db.prepare(`UPDATE ${this.table} SET value = ?, is_public = ?, updated_at = datetime('now') WHERE key = ?`).run(value, isPublic ? 1 : 0, key);
    } else {
      db.prepare(`INSERT INTO ${this.table} (key, value, is_public) VALUES (?, ?, ?)`).run(key, value, isPublic ? 1 : 0);
    }
    return this.findByKey(key);
  }

  delete(key) {
    return db.prepare(`DELETE FROM ${this.table} WHERE key = ?`).run(key);
  }
}

module.exports = new SettingModel();
