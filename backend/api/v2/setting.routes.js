// ============================================
// Webowo v3.1 – Setting Routes
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

router.get('/public', async (req, res, next) => {
  try {
    const settings = await settingService.getPublic();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const settings = await settingService.getAll();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.put('/:key', authenticate, requireRole('admin'), [
  body('value').exists().withMessage('Wartość jest wymagana'),
  body('isPublic').optional().isBoolean(),
  body('category').optional().isIn(['general', 'theme', 'seo', 'email', 'social'])
], handleValidation, async (req, res, next) => {
  try {
    const setting = await settingService.set(req.params.key, req.body.value, req.body.isPublic, req.body.category);
    res.json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
});

router.get('/:key', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const setting = await settingService.getByKey(req.params.key);
    if (!setting) return res.status(404).json({ success: false, error: 'Nie znaleziono' });
    res.json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
