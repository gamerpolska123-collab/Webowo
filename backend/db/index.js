// @ts-check
// ============================================
// Database CLI: migrate | seed | reset
// ============================================

const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('./connection');
const { logger } = require('../utils/logger');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const SEEDS_DIR = path.join(__dirname, 'seeds');

function cleanSql(sql) {
  return sql
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('--'))
    .join('\n');
}

function migrate() {
  const db = getDb();
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => /^\d+_.*\.sql$/.test(f))
    .sort();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    const sql = cleanSql(raw);
    try {
      db.exec(sql);
      logger.info(`Migration applied: ${file}`);
    } catch (err) {
      logger.error(`Migration failed: ${file} — ${err.message}`);
      throw err;
    }
  }
  console.log('[MIGRATE] ✅ All migrations applied');
}

function seed() {
  const db = getDb();
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    logger.info('Database already seeded, skipping');
    console.log('[SEED] ⏭️  Already seeded');
    return;
  }

  const files = fs.readdirSync(SEEDS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    let raw = fs.readFileSync(path.join(SEEDS_DIR, file), 'utf8');
    // Dynamic admin password (TODO #10)
    const hash = bcrypt.hashSync(config.admin.password, config.security.bcryptRounds);
    raw = raw.replace(/\$SEED_ADMIN_HASH\$/g, hash);
    const sql = cleanSql(raw);
    try {
      db.exec(sql);
      logger.info(`Seed applied: ${file}`);
    } catch (err) {
      logger.error(`Seed failed: ${file} — ${err.message}`);
      throw err;
    }
  }
  console.log('[SEED] ✅ All seeds applied');
}

function reset() {
  const db = getDb();
  db.prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all()
    .forEach(t => {
      if (t.name !== 'sqlite_sequence') {
        db.exec(`DROP TABLE IF EXISTS ${t.name}`);
      }
    });
  logger.info('Database reset');
  console.log('[RESET] ✅ Database cleared');
  migrate();
  seed();
}

const cmd = process.argv[2];
if (cmd === 'migrate') { migrate(); closeDb(); }
else if (cmd === 'seed') { seed(); closeDb(); }
else if (cmd === 'reset') { reset(); closeDb(); }
else {
  console.log('Usage: node db/index.js [migrate|seed|reset]');
  process.exit(1);
}

module.exports = { migrate, seed, reset };
