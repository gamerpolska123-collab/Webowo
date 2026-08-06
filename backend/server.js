// ============================================
// Webowo v2.0 – Server Entry Point
// Etap 5 – Backend Modernizacja (Docker-ready)
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
  config.gdpr.logDir
];
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// Helper: clean SQL by removing comment lines and empty lines
function cleanSql(sql) {
  return sql
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('--'))
    .join('\n');
}

// Auto-run migrations on startup
const db = require('./db/database');
const MIGRATIONS_DIR = path.join(__dirname, 'db', 'migrations');
const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => /^\d+_.*\.sql$/.test(f))
  .sort();

for (const file of migrationFiles) {
  const rawSql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
  const sql = cleanSql(rawSql);

  console.log(`[MIGRATE] Applying ${file}...`);
  try {
    db.exec(sql);
    console.log(`[MIGRATE] ✅ ${file} applied`);
    logger.info(`Migration applied: ${file}`);
  } catch (err) {
    console.error(`[MIGRATE] ❌ ${file} failed: ${err.message}`);
    console.error(`[MIGRATE] SQL preview: ${sql.substring(0, 500)}`);
    throw err;
  }
}

// Seed if no users exist
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  const SEEDS_DIR = path.join(__dirname, 'db', 'seeds');
  const seedFile = path.join(SEEDS_DIR, 'seed.sql');
  if (fs.existsSync(seedFile)) {
    const bcrypt = require('bcryptjs');
    let rawSql = fs.readFileSync(seedFile, 'utf8');
    const hash = bcrypt.hashSync(config.admin.password, config.security.bcryptRounds);
    rawSql = rawSql.replace('$SEED_ADMIN_HASH$', hash);
    const sql = cleanSql(rawSql);

    console.log(`[SEED] Applying seed...`);
    try {
      db.exec(sql);
      console.log(`[SEED] ✅ Seed applied`);
      logger.info('Seed data applied');
    } catch (err) {
      console.error(`[SEED] ❌ Seed failed: ${err.message}`);
      throw err;
    }
  }
}

// Cleanup expired refresh tokens on startup
try {
  db.prepare(`DELETE FROM refresh_tokens WHERE expires_at < datetime('now')`).run();
} catch (e) {
  logger.warn('Refresh tokens cleanup skipped: ' + e.message);
}

// Start backup cron
require('./jobs/backup.cron');

const PORT = config.port;
const NODE_ENV = config.nodeEnv;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Webowo Backend v${config.appVersion} nasłuchuje na porcie ${PORT} [${NODE_ENV}]`);
  logger.info(`📁 Database: ${config.db.path}`);
  logger.info(`💾 Backup dir: ${config.cms.backupDir}`);
  logger.info(`📤 Upload dir: ${config.uploads.dir}`);
});
