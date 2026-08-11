// ============================================
// Webowo v3.0 – Server Entry Point
// ============================================

const app = require('./app');
const { logger } = require('./utils/logger');
const config = require('./config/config');
const fs = require('fs');
const path = require('path');

// Ensure data directories exist
const dirs = [
  path.dirname(config.db.path),
  config.cms.backupDir,
  config.uploads.dir,
  config.gdpr.logDir,
  config.log.dir
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    logger.info(`Created directory: ${d}`);
  }
});

// Clean SQL helper
function cleanSql(sql) {
  return sql
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('--'))
    .join('\n');
}

// Auto-run migrations
const db = require('./db/database');
const MIGRATIONS_DIR = path.join(__dirname, 'db', 'migrations');

if (fs.existsSync(MIGRATIONS_DIR)) {
  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => /^\d+_.*\.sql$/.test(f))
    .sort();

  for (const file of migrationFiles) {
    const rawSql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    const sql = cleanSql(rawSql);

    try {
      db.exec(sql);
      logger.info(`Migration applied: ${file}`);
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        logger.debug(`Migration skipped (already applied): ${file}`);
      } else {
        logger.error(`Migration failed: ${file} – ${err.message}`);
        throw err;
      }
    }
  }
}

// Seed if no users exist or no home page
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const pageCount = db.prepare('SELECT COUNT(*) as count FROM pages').get().count;
  if (userCount === 0 || pageCount === 0) {
    const SEEDS_DIR = path.join(__dirname, 'db', 'seeds');
    const seedFile = path.join(SEEDS_DIR, 'seed.sql');
    if (fs.existsSync(seedFile)) {
      const bcrypt = require('bcryptjs');
      let rawSql = fs.readFileSync(seedFile, 'utf8');
      const hash = bcrypt.hashSync(config.admin.password, config.security.bcryptRounds);
      rawSql = rawSql.replace('$SEED_ADMIN_HASH$', hash);
      const sql = cleanSql(rawSql);

      db.exec(sql);
      logger.info('Seed data applied');
    }
  }
} catch (e) {
  logger.warn('Seed check skipped: ' + e.message);
}

// Cleanup expired refresh tokens
try {
  db.prepare(`DELETE FROM refresh_tokens WHERE expires_at < datetime('now')`).run();
  logger.info('Expired refresh tokens cleaned up');
} catch (e) {
  logger.warn('Refresh tokens cleanup skipped: ' + e.message);
}

// Start backup cron
require('./jobs/backup.cron');

// Graceful shutdown
const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info(`🚀 Webowo Backend v${config.appVersion} listening on port ${config.port} [${config.nodeEnv}]`);
  logger.info(`📁 Database: ${config.db.path}`);
  logger.info(`💾 Backup dir: ${config.cms.backupDir}`);
  logger.info(`📤 Upload dir: ${config.uploads.dir}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
