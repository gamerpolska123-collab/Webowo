// @ts-check
// ============================================
// Section Model
// ============================================

const db = require('../db/database');

const SectionModel = {
  create({ pageId, type, orderIndex = 0, data = '{}', isActive = 1 }) {
    const stmt = db.prepare(
      `INSERT INTO sections (page_id, type, order_index, data, is_active) VALUES (?, ?, ?, ?, ?)`
    );
    const result = stmt.run(pageId, type, orderIndex, data, isActive);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM sections WHERE id = ?').get(id);
  },

  findByPageId(pageId) {
    return db.prepare('SELECT * FROM sections WHERE page_id = ? ORDER BY order_index ASC').all(pageId);
  },

  update(id, fields) {
    const keys = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const stmt = db.prepare(`UPDATE sections SET ${setClause}, updated_at = datetime('now') WHERE id = ?`);
    stmt.run(...keys.map(k => fields[k]), id);
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM sections WHERE id = ?').run(id);
    return { success: true };
  },

  deleteByPageId(pageId) {
    db.prepare('DELETE FROM sections WHERE page_id = ?').run(pageId);
  }
};

module.exports = SectionModel;
