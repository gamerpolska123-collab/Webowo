// ============================================
// Webowo v3.1 – Backup Routes
// ============================================

const express = require('express');
const router = express.Router();
const backupService = require('../../services/backup.service');
const { authenticate, requireRole } = require('../../middleware/auth');

router.post('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await backupService.createManual();
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const backups = await backupService.list();
    res.json({ success: true, data: backups });
  } catch (err) {
    next(err);
  }
});

router.post('/restore', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ success: false, error: 'Nazwa pliku jest wymagana' });
    await backupService.restore(filename);
    res.json({ success: true, message: 'Baza danych przywrócona. Zrestartuj serwer.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:filename', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await backupService.delete(req.params.filename);
    res.json({ success: true, message: 'Backup usunięty' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
