// ============================================
// Legacy Content Routes (v1.4 compatibility)
// ============================================

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');

const CONTENT_FILE = path.join(__dirname, '../../data/content.json');
const BACKUP_DIR = path.join(__dirname, '../../data/backups');

function ensureContentFile() {
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify({ draft: {}, published: {} }));
  }
}

router.get('/', (req, res) => {
  ensureContentFile();
  const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  res.json(content.published || content);
});

router.post('/', (req, res) => {
  ensureContentFile();
  const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  content.draft = req.body;
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  res.json({ success: true });
});

router.post('/publish', (req, res) => {
  ensureContentFile();
  const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  content.published = content.draft || req.body;
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  res.json({ success: true });
});

module.exports = router;
