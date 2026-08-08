// ============================================
// Webowo v3.0 – Setting Routes
// ============================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const settingService = require('../../services/setting.service');
const { authenticate, requireRole } = require('../../middleware/auth');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// GET /api/v2/settings/public
router.get('/public', async (req, res, next) => {
  try {
    const settings = await settingService.getPublic();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/settings
router.get('/', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const settings = await settingService.getAll();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v2/settings/:key
router.put('/:key', authenticate, requireRole('admin'), [
  body('value').exists().withMessage('Wartość jest wymagana')
], handleValidation, async (req, res, next) => {
  try {
    await settingService.set(req.params.key, req.body.value, req.body.isPublic);
    res.json({ success: true, message: 'Ustawienie zapisane' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
