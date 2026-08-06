// @ts-check
// ============================================
// Contact Model
// ============================================

const db = require('../db/database');

const ContactModel = {
  create({ name, email, phone, subject, message, ip, userAgent }) {
    const stmt = db.prepare(
      `INSERT INTO contacts (name, email, phone, subject, message, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(name, email, phone, subject, message, ip, userAgent);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
  },

  findAll() {
    return db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  },

  updateStatus(id, status) {
    db.prepare("UPDATE contacts SET status = ? WHERE id = ?").run(status, id);
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = ContactModel;
