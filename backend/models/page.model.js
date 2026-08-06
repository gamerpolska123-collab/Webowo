// @ts-check
// ============================================
// Page Model
// ============================================

const db = require('../db/database');

const PageModel = {
  create({ slug, title, meta = '{}', status = 'draft' }) {
    const stmt = db.prepare(
      `INSERT INTO pages (slug, title, meta, status) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(slug, title, meta, status);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
  },

  findBySlug(slug) {
    return db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug);
  },

  findAll() {
    return db.prepare('SELECT id, slug, title, status, created_at, updated_at, published_at FROM pages').all();
  },

  findPublished() {
    return db.prepare("SELECT * FROM pages WHERE status = 'published'").all();
  },

  update(id, fields) {
    const keys = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const stmt = db.prepare(`UPDATE pages SET ${setClause}, updated_at = datetime('now') WHERE id = ?`);
    stmt.run(...keys.map(k => fields[k]), id);
    return this.findById(id);
  },

  publish(id) {
    db.prepare("UPDATE pages SET status = 'published', published_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(id);
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM pages WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = PageModel;
