// ============================================
// Webowo v3.1 – Media Model
// ============================================

const db = require('../db/database');

class MediaModel {
  constructor() {
    this.table = 'media';
  }

  findAll(options = {}) {
    const { limit = 20, offset = 0 } = options;
    return db.prepare(`SELECT id, filename, original_name, mime_type, size, width, height, variants, alt_text, url, created_at FROM ${this.table} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
  }

  count() {
    return db.prepare(`SELECT COUNT(*) as count FROM ${this.table}`).get().count;
  }

  findById(id) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
  }

  create(data) {
    const { filename, original_name, mime_type, size, width, height, variants, alt_text, url } = data;
    const result = db.prepare(`INSERT INTO ${this.table} (filename, original_name, mime_type, size, width, height, variants, alt_text, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(filename, original_name, mime_type, size, width, height, variants || null, alt_text || null, url);
    return this.findById(result.lastInsertRowid);
  }

  delete(id) {
    return db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).run(id);
  }
}

module.exports = new MediaModel();
