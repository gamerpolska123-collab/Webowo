// ============================================
// Webowo v3.0 – Backend Config
// ============================================

require('dotenv').config();
const path = require('path');
const pkg = require('../package.json');

const DATA_DIR = process.env.UPLOAD_DIR
  ? path.dirname(process.env.UPLOAD_DIR)
  : path.resolve(__dirname, '..', 'data');

function parseCorsOrigins(raw) {
  if (!raw) return ['http://localhost:7777'];
  return raw.split(',').map(o => o.trim()).filter(Boolean);
}

function parseIntEnv(key, fallback) {
  const val = parseInt(process.env[key], 10);
  return Number.isNaN(val) ? fallback : val;
}

module.exports = {
  appVersion: pkg.version,
  port: parseIntEnv('PORT', 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  trustProxy: process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production',

  // Database
  db: {
    path: process.env.DB_PATH || path.join(DATA_DIR, 'db', 'webowo.sqlite'),
    busyTimeout: parseIntEnv('DB_BUSY_TIMEOUT', 5000),
    pragma: [
      'PRAGMA journal_mode = WAL',
      'PRAGMA foreign_keys = ON',
      'PRAGMA synchronous = NORMAL',
      'PRAGMA temp_store = MEMORY',
      'PRAGMA mmap_size = 30000000000',
      'PRAGMA cache_size = -64000',
      'PRAGMA optimize'
    ]
  },

  // Rate limiting
  rateLimitWindowMs: parseIntEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  rateLimitMax: parseIntEnv('RATE_LIMIT_MAX', 100),

  // CORS
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production-please-webowo-v3',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-change-me-in-production-webowo-v3',
    issuer: process.env.JWT_ISSUER || 'webowo-backend',
    audience: process.env.JWT_AUDIENCE || 'webowo-frontend'
  },

  // Admin
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
      port: parseIntEnv('SMTP_PORT', 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      },
      pool: process.env.SMTP_POOL === 'true'
    },
    from: process.env.EMAIL_FROM || 'kontakt@webowo.pl',
    to: process.env.EMAIL_TO || 'biuro@webowo.pl',
    subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX || '[Webowo]'
  },

  // Uploads
  uploads: {
    dir: process.env.UPLOAD_DIR || path.join(DATA_DIR, 'uploads'),
    maxSize: parseIntEnv('UPLOAD_MAX_SIZE', 5 * 1024 * 1024),
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'image/gif'
    ],
    publicUrl: process.env.UPLOAD_PUBLIC_URL || '/uploads',
    variants: {
      thumbnail: { width: 300, height: 300, fit: 'cover' },
      medium: { width: 800, height: 600, fit: 'inside' },
      large: { width: 1600, height: 1200, fit: 'inside' }
    }
  },

  // CMS / Backup
  cms: {
    backupDir: process.env.BACKUP_DIR || path.join(DATA_DIR, 'backups'),
    backupRetentionDays: parseIntEnv('BACKUP_RETENTION_DAYS', 30),
    backupCron: process.env.BACKUP_CRON || '0 2 * * *',
    maxRevisions: parseIntEnv('MAX_REVISIONS', 50)
  },

  // GDPR
  gdpr: {
    logDir: process.env.GDPR_LOG_DIR || path.join(DATA_DIR, 'gdpr'),
    dataRetentionDays: parseIntEnv('GDPR_RETENTION_DAYS', 365)
  },

  // Logging
  log: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    dir: process.env.LOG_DIR || path.join(DATA_DIR, 'logs'),
    maxFiles: parseIntEnv('LOG_MAX_FILES', 30),
    maxSize: process.env.LOG_MAX_SIZE || '20m'
  },

  // Security
  security: {
    bcryptRounds: parseIntEnv('BCRYPT_ROUNDS', 12),
    sessionSecret: process.env.SESSION_SECRET || 'session-secret-change-me',
    csrfEnabled: process.env.CSRF_ENABLED !== 'false'
  }
};
