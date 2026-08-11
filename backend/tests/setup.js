// @ts-check
// ============================================
// Test Setup
// ============================================

const { getDb, closeDb } = require('../db/connection');
const { migrate } = require('../db/index');

beforeAll(() => {
  process.env.DB_PATH = ':memory:';
  process.env.JWT_SECRET = 'test-secret-32-characters-long!!!';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-32-characters-long!!';
  process.env.NODE_ENV = 'test';
  migrate();
});

afterAll(() => {
  closeDb();
});

beforeEach(() => {
  const db = getDb();
  db.prepare("DELETE FROM users").run();
  db.prepare("DELETE FROM pages").run();
  db.prepare("DELETE FROM contacts").run();
});
