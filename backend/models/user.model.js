// @ts-check
// ============================================
// User Model
// ============================================

const db = require('../db/database');

const UserModel = {
  create({ username, email, passwordHash, role = 'editor' }) {
    const stmt = db.prepare(
      `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(username, email, passwordHash, role);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findAll() {
    return db.prepare('SELECT id, username, email, role, is_active, last_login_at, created_at FROM users').all();
  },

  update(id, fields) {
    const keys = Object.keys(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const stmt = db.prepare(`UPDATE users SET ${setClause}, updated_at = datetime('now') WHERE id = ?`);
    stmt.run(...keys.map(k => fields[k]), id);
    return this.findById(id);
  },

  updateLastLogin(id) {
    db.prepare(`UPDATE users SET last_login_at = datetime('now') WHERE id = ?`).run(id);
  },

  delete(id) {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return { success: true };
  }
};

module.exports = UserModel;
