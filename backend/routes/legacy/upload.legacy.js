// ============================================
// Legacy Upload Routes (v1.4 compatibility)
// ============================================

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../../config/config');

const upload = multer({ dest: config.uploads.dir });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const filePath = path.join(config.uploads.dir, req.file.filename);
  fs.renameSync(req.file.path, filePath);
  res.json({ success: true, filename: req.file.filename, url: `${config.uploads.publicUrl}/${req.file.filename}` });
});

router.get('/', (req, res) => {
  if (!fs.existsSync(config.uploads.dir)) return res.json([]);
  const files = fs.readdirSync(config.uploads.dir);
  res.json(files);
});

router.delete('/:filename', (req, res) => {
  const filePath = path.join(config.uploads.dir, req.params.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.json({ success: true });
});

module.exports = router;
