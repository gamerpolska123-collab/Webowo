// ============================================
// Webowo v3.1 – Page Model
// ============================================

const db = require('../db/database');

class PageModel {
  constructor() {
    this.table = 'pages';
  }

  findAll(options = {}) {
    const { limit = 50, offset = 0, isActive } = options;
    let sql = `SELECT id, slug, title, meta_description, is_active, created_at, updated_at FROM ${this.table}`;
    const params = [];
    if (isActive !== undefined) {
      sql += ' WHERE is_active = ?';
      params.push(isActive ? 1 : 0);
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    return db.prepare(sql).all(...params);
  }

  findBySlug(slug) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE slug = ?`).get(slug);
  }

  findById(id) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
  }

  create(data) {
    const { slug, title, meta_description, is_active = 1 } = data;
    const result = db.prepare(`INSERT INTO ${this.table} (slug, title, meta_description, is_active) VALUES (?, ?, ?, ?)`).run(slug, title, meta_description, is_active);
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    const fields = [];
    const values = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
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

  count() {
    return db.prepare(`SELECT COUNT(*) as count FROM ${this.table}`).get().count;
  }
}

module.exports = new PageModel();
