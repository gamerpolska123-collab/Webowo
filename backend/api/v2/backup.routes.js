// ============================================
// Webowo v3.0 – Backup Routes
// ============================================

const express = require('express');
const router = express.Router();
const backupService = require('../../services/backup.service');
const { authenticate, requireRole } = require('../../middleware/auth');

// POST /api/v2/backup/manual
router.post('/manual', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await backupService.createManual();
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/backup/list
router.get('/list', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const backups = await backupService.list();
    res.json({ success: true, data: backups });
  } catch (err) {
    next(err);
  }
});

// POST /api/v2/backup/restore/:filename
router.post('/restore/:filename', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await backupService.restore(req.params.filename);
    res.json({ success: true, message: 'Backup przywrócony' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v2/backup/:filename
router.delete('/:filename', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await backupService.delete(req.params.filename);
    res.json({ success: true, message: 'Backup usunięty' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
