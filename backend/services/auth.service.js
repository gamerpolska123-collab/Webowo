// ============================================
// Webowo v3.0 – Auth Service
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/user.model');
const db = require('../db/database');
const { logger } = require('../utils/logger');

function generateTokens(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience
  });

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  db.prepare(`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`).run(user.id, refreshToken, expiresAt.toISOString());

  return { accessToken, refreshToken, expiresIn: config.jwt.accessExpiresIn };
}

class AuthService {
  async register({ username, email, password, role = 'editor' }) {
    // Check uniqueness
    const existingUser = userModel.findByUsername(username);
    if (existingUser) {
      throw Object.assign(new Error('Nazwa użytkownika jest już zajęta'), { statusCode: 409 });
    }
    const existingEmail = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
    if (existingEmail) {
      throw Object.assign(new Error('Adres e-mail jest już używany'), { statusCode: 409 });
    }

    const hash = await bcrypt.hash(password, config.security.bcryptRounds);
    const result = db.prepare(`INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)`).run(username, email, hash, role, 1);

    const user = userModel.findById(result.lastInsertRowid);
    logger.info(`New user registered: ${username}`);
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  async login({ username, password }) {
    const user = userModel.findByUsername(username);
    if (!user) {
      throw Object.assign(new Error('Nieprawidłowe dane logowania'), { statusCode: 401 });
    }

    if (!user.is_active) {
      throw Object.assign(new Error('Konto jest nieaktywne'), { statusCode: 403 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      logger.warn(`Failed login attempt for user: ${username}`);
      throw Object.assign(new Error('Nieprawidłowe dane logowania'), { statusCode: 401 });
    }

    // Update last login
    db.prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`).run(user.id);

    logger.info(`User logged in: ${username}`);
    return generateTokens(user);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw Object.assign(new Error('Brak tokenu odświeżania'), { statusCode: 401 });
    }

    // Check if token exists and is not revoked
    const stored = db.prepare(`SELECT * FROM refresh_tokens WHERE token = ? AND revoked = 0 AND expires_at > datetime('now')`).get(refreshToken);
    if (!stored) {
      throw Object.assign(new Error('Nieprawidłowy lub wygasły token'), { statusCode: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      throw Object.assign(new Error('Nieprawidłowy token'), { statusCode: 401 });
    }

    const user = userModel.findById(decoded.id);
    if (!user || !user.is_active) {
      throw Object.assign(new Error('Użytkownik nie istnieje lub jest nieaktywny'), { statusCode: 401 });
    }

    // Revoke old token
    db.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`).run(refreshToken);

    return generateTokens(user);
  }

  async logout(refreshToken) {
    if (refreshToken) {
      db.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`).run(refreshToken);
    }
    return { success: true };
  }

  async getMe(userId) {
    const user = userModel.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Użytkownik nie istnieje'), { statusCode: 404 });
    }
    return user;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(userId);
    if (!user) {
      throw Object.assign(new Error('Użytkownik nie istnieje'), { statusCode: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      throw Object.assign(new Error('Aktualne hasło jest nieprawidłowe'), { statusCode: 400 });
    }

    const hash = await bcrypt.hash(newPassword, config.security.bcryptRounds);
    db.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`).run(hash, userId);

    // Revoke all refresh tokens for this user
    db.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE user_id = ?`).run(userId);

    logger.info(`Password changed for user: ${user.username}`);
    return { success: true };
  }
}

module.exports = new AuthService();
