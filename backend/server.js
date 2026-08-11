// ============================================
// Webowo v3.1 – Server Entry Point
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
    .split('
')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('--'))
    .join('
');
}

// Auto-run migrations
const db = require('./db/database');

function ensureSchema() {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);

  if (tables.includes('users')) {
    const cols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
    if (!cols.includes('last_login')) {
      try { db.prepare("ALTER TABLE users ADD COLUMN last_login TEXT").run(); logger.info('Schema fix: added last_login to users'); } catch(e) {}
    }
  }

  if (tables.includes('contacts')) {
    const cols = db.prepare("PRAGMA table_info(contacts)").all().map(c => c.name);
    if (!cols.includes('phone')) {
      try { db.prepare("ALTER TABLE contacts ADD COLUMN phone TEXT").run(); logger.info('Schema fix: added phone to contacts'); } catch(e) {}
    }
    if (!cols.includes('ip')) {
      try { db.prepare("ALTER TABLE contacts ADD COLUMN ip TEXT").run(); logger.info('Schema fix: added ip to contacts'); } catch(e) {}
    }
    if (!cols.includes('user_agent')) {
      try { db.prepare("ALTER TABLE contacts ADD COLUMN user_agent TEXT").run(); logger.info('Schema fix: added user_agent to contacts'); } catch(e) {}
    }
  }

  if (tables.includes('media')) {
    const cols = db.prepare("PRAGMA table_info(media)").all().map(c => c.name);
    if (!cols.includes('variants')) {
      try { db.prepare("ALTER TABLE media ADD COLUMN variants TEXT").run(); logger.info('Schema fix: added variants to media'); } catch(e) {}
    }
    if (!cols.includes('alt_text')) {
      try { db.prepare("ALTER TABLE media ADD COLUMN alt_text TEXT").run(); logger.info('Schema fix: added alt_text to media'); } catch(e) {}
    }
  }

  if (tables.includes('settings')) {
    const cols = db.prepare("PRAGMA table_info(settings)").all().map(c => c.name);
    if (!cols.includes('category')) {
      try { db.prepare("ALTER TABLE settings ADD COLUMN category TEXT NOT NULL DEFAULT 'general'").run(); logger.info('Schema fix: added category to settings'); } catch(e) {}
    }
    if (!cols.includes('is_public')) {
      try { db.prepare("ALTER TABLE settings ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0").run(); logger.info('Schema fix: added is_public to settings'); } catch(e) {}
    }
  }

  if (tables.includes('refresh_tokens')) {
    const cols = db.prepare("PRAGMA table_info(refresh_tokens)").all().map(c => c.name);
    if (!cols.includes('revoked')) {
      try { db.prepare("ALTER TABLE refresh_tokens ADD COLUMN revoked INTEGER NOT NULL DEFAULT 0").run(); logger.info('Schema fix: added revoked to refresh_tokens'); } catch(e) {}
    }
  }

  if (tables.includes('revisions')) {
    const cols = db.prepare("PRAGMA table_info(revisions)").all().map(c => c.name);
    if (!cols.includes('entity_type')) {
      try { db.prepare("ALTER TABLE revisions ADD COLUMN entity_type TEXT NOT NULL DEFAULT 'page'").run(); logger.info('Schema fix: added entity_type to revisions'); } catch(e) {}
    }
    if (!cols.includes('entity_id')) {
      try { db.prepare("ALTER TABLE revisions ADD COLUMN entity_id INTEGER NOT NULL DEFAULT 0").run(); logger.info('Schema fix: added entity_id to revisions'); } catch(e) {}
    }
    if (!cols.includes('data')) {
      try { db.prepare("ALTER TABLE revisions ADD COLUMN data TEXT NOT NULL DEFAULT '{}'").run(); logger.info('Schema fix: added data to revisions'); } catch(e) {}
    }
    if (!cols.includes('created_by')) {
      try { db.prepare("ALTER TABLE revisions ADD COLUMN created_by INTEGER").run(); logger.info('Schema fix: added created_by to revisions'); } catch(e) {}
    }
  }
}

try {
  ensureSchema();
  logger.info('Schema compatibility check completed');
} catch (err) {
  logger.error('Schema fix failed: ' + err.message);
}

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
