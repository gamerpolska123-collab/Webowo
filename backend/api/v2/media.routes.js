// ============================================
// Webowo v3.0 – Media Routes
// ============================================

const express = require('express');
const router = express.Router();
const mediaService = require('../../services/media.service');
const { authenticate, requireRole } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// POST /api/v2/media/upload
router.post('/upload', authenticate, requireRole('admin', 'editor'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Brak pliku' });
    }
    const result = await mediaService.processUpload(req.file);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/media
router.get('/', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await mediaService.getAll({ page: parseInt(page), limit: parseInt(limit) });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v2/media/:id
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await mediaService.delete(req.params.id);
    res.json({ success: true, message: 'Plik usunięty' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
