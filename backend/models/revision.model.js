// @ts-check
// ============================================
// Revision Model
// ============================================

const db = require('../db/database');

const RevisionModel = {
  create({ pageId, sectionId, data, createdBy, note }) {
    const stmt = db.prepare(
      `INSERT INTO revisions (page_id, section_id, data, created_by, note) VALUES (?, ?, ?, ?, ?)`
    );
    const result = stmt.run(pageId, sectionId, data, createdBy, note);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM revisions WHERE id = ?').get(id);
  },

  findByPageId(pageId, limit = 50) {
    return db.prepare('SELECT * FROM revisions WHERE page_id = ? ORDER BY created_at DESC LIMIT ?').all(pageId, limit);
  },

  findBySectionId(sectionId) {
    return db.prepare('SELECT * FROM revisions WHERE section_id = ? ORDER BY created_at DESC').all(sectionId);
  },

  delete(id) {
    db.prepare('DELETE FROM revisions WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = RevisionModel;
