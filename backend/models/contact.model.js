// ============================================
// Webowo v3.0 – Contact Model
// ============================================

const db = require('../db/database');

class ContactModel {
  constructor() {
    this.table = 'contacts';
  }

  findAll(options = {}) {
    const { limit = 20, offset = 0, status } = options;
    let sql = `SELECT id, name, email, subject, budget, message, status, created_at FROM ${this.table}`;
    const params = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    return db.prepare(sql).all(...params);
  }

  count(options = {}) {
    const { status } = options;
    let sql = `SELECT COUNT(*) as count FROM ${this.table}`;
    const params = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    return db.prepare(sql).get(...params).count;
  }

  findById(id) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
  }

  create(data) {
    const { name, email, subject, budget, message } = data;
    const result = db.prepare(`INSERT INTO ${this.table} (name, email, subject, budget, message) VALUES (?, ?, ?, ?, ?)`).run(name, email, subject, budget || null, message);
    return this.findById(result.lastInsertRowid);
  }

  updateStatus(id, status) {
    db.prepare(`UPDATE ${this.table} SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id);
    return this.findById(id);
  }

  delete(id) {
    return db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).run(id);
  }
}

module.exports = new ContactModel();
