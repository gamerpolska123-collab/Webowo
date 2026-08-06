const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../../middleware/auth');
const BackupService = require('../../services/backup.service');

router.post('/', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    const result = BackupService.createDump();
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    const backups = BackupService.list();
    res.json({ success: true, data: backups });
  } catch (err) { next(err); }
});

router.post('/restore', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    BackupService.restore(req.body.fileName);
    res.json({ success: true, message: 'Baza przywrócona' });
  } catch (err) { next(err); }
});

module.exports = router;
