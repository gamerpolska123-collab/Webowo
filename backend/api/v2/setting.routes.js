const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../../middleware/auth');
const SettingService = require('../../services/setting.service');

router.get('/public', async (req, res, next) => {
  try {
    const settings = SettingService.getPublic();
    // Convert to key-value object
    const result = {};
    for (const s of settings) result[s.key] = s.value;
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    const settings = SettingService.getAll();
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
});

router.put('/:key', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    const setting = SettingService.update(req.params.key, req.body.value);
    res.json({ success: true, data: setting });
  } catch (err) { next(err); }
});

module.exports = router;
