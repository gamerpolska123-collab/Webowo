// ============================================
// Webowo v3.1 – Media Routes
// ============================================

const express = require('express');
const router = express.Router();
const mediaService = require('../../services/media.service');
const upload = require('../../middleware/upload');
const { authenticate, requireRole } = require('../../middleware/auth');

router.post('/', authenticate, requireRole('admin', 'editor'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Nie przesłano pliku' });
    }
    const result = await mediaService.processUpload(req.file);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await mediaService.getAll({ page: parseInt(page), limit: parseInt(limit) });
    res.json({ success: true, data: result.items, meta: { total: result.total } });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await mediaService.delete(req.params.id);
    res.json({ success: true, message: 'Plik usunięty' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
