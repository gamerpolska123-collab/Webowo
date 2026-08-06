// @ts-check
// ============================================
// Setting Model
// ============================================

const db = require('../db/database');

const SettingModel = {
  create({ key, value, category = 'general', isPublic = 0 }) {
    const stmt = db.prepare(
      `INSERT INTO settings (key, value, category, is_public) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(key, value, category, isPublic);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM settings WHERE id = ?').get(id);
  },

  findByKey(key) {
    return db.prepare('SELECT * FROM settings WHERE key = ?').get(key);
  },

  findAll() {
    return db.prepare('SELECT * FROM settings ORDER BY category, key').all();
  },

  findPublic() {
    return db.prepare("SELECT key, value, category FROM settings WHERE is_public = 1 ORDER BY key").all();
  },

  update(key, value) {
    db.prepare("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?").run(value, key);
    return this.findByKey(key);
  },

  delete(id) {
    db.prepare('DELETE FROM settings WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = SettingModel;
