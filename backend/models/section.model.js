// ============================================
// Webowo v3.1 – Section Model
// ============================================

const db = require('../db/database');

class SectionModel {
  constructor() {
    this.table = 'sections';
  }

  findByPageId(pageId, options = {}) {
    const { isActive } = options;
    let sql = `SELECT * FROM ${this.table} WHERE page_id = ?`;
    const params = [pageId];
    if (isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(isActive ? 1 : 0);
    }
    sql += ' ORDER BY order_index ASC';
    return db.prepare(sql).all(...params);
  }

  findById(id) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
  }

  create(data) {
    const { page_id, type, data: sectionData, order_index = 0, is_active = 1 } = data;
    // Guard: don't double-stringify if already a string
    const dataStr = typeof sectionData === 'string' ? sectionData : JSON.stringify(sectionData);
    const result = db.prepare(`INSERT INTO ${this.table} (page_id, type, data, order_index, is_active) VALUES (?, ?, ?, ?, ?)`).run(page_id, type, dataStr, order_index, is_active);
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const fields = [];
    const values = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'data') {
          values.push(typeof value === 'string' ? value : JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    db.prepare(`UPDATE ${this.table} SET ${fields.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  delete(id) {
    return db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).run(id);
  }

  deleteByPageId(pageId) {
    return db.prepare(`DELETE FROM ${this.table} WHERE page_id = ?`).run(pageId);
  }
}

module.exports = new SectionModel();
