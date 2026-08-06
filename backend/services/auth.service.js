// ============================================
// Auth Service – JWT + Refresh Tokens
// ============================================

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/config');
const UserModel = require('../models/user.model');
const db = require('../db/database');

const RefreshService = {
  create(userId) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`).run(userId, token, expiresAt);
    return token;
  },

  findByToken(token) {
    return db.prepare('SELECT * FROM refresh_tokens WHERE token = ?').get(token);
  },

  deleteByToken(token) {
    return db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
  },

  deleteAllForUser(userId) {
    return db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
  },

  cleanupExpired() {
    return db.prepare(`DELETE FROM refresh_tokens WHERE expires_at < datetime('now')`).run();
  }
};

const AuthService = {
  async register({ username, email, password, role = 'editor' }) {
    const existingUser = UserModel.findByUsername(username) || UserModel.findByEmail(email);
    if (existingUser) throw new Error('Użytkownik o podanej nazwie lub emailu już istnieje');
    const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);
    const user = UserModel.create({ username, email, passwordHash, role });
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  },

  async login({ username, password, ip }) {
    const user = UserModel.findByUsername(username);
    if (!user || !user.is_active) throw new Error('Nieprawidłowa nazwa użytkownika lub hasło');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Nieprawidłowa nazwa użytkownika lub hasło');
    UserModel.updateLastLogin(user.id);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = RefreshService.create(user.id);
    return { user: { id: user.id, username: user.username, email: user.email, role: user.role }, accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error('Brak refresh tokena');
    const stored = RefreshService.findByToken(refreshToken);
    if (!stored || new Date(stored.expires_at) < new Date()) throw new Error('Refresh token wygasł');
    const user = UserModel.findById(stored.user_id);
    if (!user || !user.is_active) throw new Error('Użytkownik nieaktywny');
    const accessToken = this.generateAccessToken(user);
    return { accessToken, user: { id: user.id, username: user.username, role: user.role } };
  },

  async logout(refreshToken) {
    if (refreshToken) RefreshService.deleteByToken(refreshToken);
    return true;
  },

  async logoutAll(userId) {
    RefreshService.deleteAllForUser(userId);
    return true;
  },

  generateAccessToken(user) {
    return jwt.sign(
      { sub: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiresIn }
    );
  },

  verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.secret);
  }
};

module.exports = AuthService;
