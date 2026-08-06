// ============================================
// Webowo Backend Config v2.0.0
// Etap 5 – Backend Modernizacja (Docker-ready)
// ============================================

require('dotenv').config();
const path = require('path');
const pkg = require('../package.json');

// Use /app/data in Docker, fallback to local ./data
const DATA_DIR = process.env.UPLOAD_DIR ? path.dirname(process.env.UPLOAD_DIR) : path.resolve(__dirname, '..', 'data');

// Parse CORS origins (comma-separated for multiple)
function parseCorsOrigins(raw) {
  if (!raw) return ['http://localhost:7777'];
  return raw.split(',').map(o => o.trim()).filter(Boolean);
}

module.exports = {
  appVersion: pkg.version,
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  db: {
    path: process.env.DB_PATH || path.join(DATA_DIR, 'db', 'webowo.sqlite'),
    busyTimeout: 5000,
    pragma: [
      'PRAGMA journal_mode = WAL',
      'PRAGMA foreign_keys = ON',
      'PRAGMA synchronous = NORMAL',
      'PRAGMA temp_store = MEMORY',
      'PRAGMA mmap_size = 30000000000'
    ]
  },

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // CORS – comma-separated list of allowed origins
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production-please-webowo-v2',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-change-me-in-production-webowo-v2'
  },

  // Admin default credentials
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    email: process.env.ADMIN_EMAIL || 'admin@webowo.pl'
  },

  // Email (SMTP)
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    from: process.env.EMAIL_FROM || 'kontakt@webowo.pl',
    to: process.env.EMAIL_TO || 'biuro@webowo.pl',
    subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX || '[Webowo] Nowe zapytanie'
  },

  // Uploads
  uploads: {
    dir: process.env.UPLOAD_DIR || path.join(DATA_DIR, 'uploads'),
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
    publicUrl: process.env.UPLOAD_PUBLIC_URL || '/uploads',
    variants: {
      thumbnail: { width: 300, height: 300, fit: 'cover' },
      medium: { width: 800, height: 600, fit: 'inside' },
      large: { width: 1600, height: 1200, fit: 'inside' }
    }
  },

  // CMS / Content
  cms: {
    backupDir: process.env.CMS_BACKUP_DIR || path.join(DATA_DIR, 'backups'),
    maxBackups: parseInt(process.env.CMS_MAX_BACKUPS, 10) || 20,
    revisionsPerPage: 50
  },

  // Backup cron
  backup: {
    enabled: process.env.BACKUP_ENABLED !== 'false',
    cron: process.env.BACKUP_CRON || '0 3 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS, 10) || 30
  },

  // GDPR / Logging
  gdpr: {
    logRetentionDays: parseInt(process.env.GDPR_LOG_RETENTION_DAYS, 10) || 365,
    logDir: process.env.GDPR_LOG_DIR || path.join(DATA_DIR, 'logs')
  },

  // Security
  security: {
    bcryptRounds: 12,
    csrfCookieName: 'webowo_csrf',
    refreshCookieName: 'webowo_refresh',
    cookieSecure: process.env.NODE_ENV === 'production',
    cookieSameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
};
