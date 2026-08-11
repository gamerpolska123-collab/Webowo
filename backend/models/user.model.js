// ============================================
// Webowo v3.1 – User Model
// ============================================

const db = require('../db/database');

class UserModel {
  constructor() {
    this.table = 'users';
  }

  findAll(options = {}) {
    const { limit = 50, offset = 0 } = options;
    return db.prepare(`SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM ${this.table} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
  }

  findById(id) {
    return db.prepare(`SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM ${this.table} WHERE id = ?`).get(id);
  }

  findByUsername(username) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE username = ?`).get(username);
  }

  findByEmail(email) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE email = ?`).get(email);
  }

  create(data) {
    const { username, email, password_hash, role = 'editor' } = data;
    const result = db.prepare(`INSERT INTO ${this.table} (username, email, password_hash, role) VALUES (?, ?, ?, ?)`).run(username, email, password_hash, role);
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

module.exports = new UserModel();
