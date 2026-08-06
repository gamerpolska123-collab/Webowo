// @ts-check
// ============================================
// Media Model
// ============================================

const db = require('../db/database');

const MediaModel = {
  create({ filename, originalName, mimeType, size, width, height, variants, altText, url }) {
    const stmt = db.prepare(
      `INSERT INTO media (filename, original_name, mime_type, size, width, height, variants, alt_text, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(filename, originalName, mimeType, size, width, height, variants, altText, url);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM media WHERE id = ?').get(id);
  },

  findByFilename(filename) {
    return db.prepare('SELECT * FROM media WHERE filename = ?').get(filename);
  },

  findAll() {
    return db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
  },

  delete(id) {
    db.prepare('DELETE FROM media WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = MediaModel;
