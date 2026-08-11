// ============================================
// Webowo v3.0 – Contact Routes
// ============================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const contactService = require('../../services/contact.service');
const { contactLimiter } = require('../../middleware/rate-limit');
const { authenticate, requireRole } = require('../../middleware/auth');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// POST /api/v2/contact
router.post('/', contactLimiter, [
  body('name').trim().notEmpty().withMessage('Imię jest wymagane').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Podaj prawidłowy e-mail'),
  body('subject').trim().notEmpty().withMessage('Temat jest wymagany'),
  body('message').trim().notEmpty().withMessage('Wiadomość jest wymagana').isLength({ max: 5000 }),
  body('budget').optional().trim()
], handleValidation, async (req, res, next) => {
  try {
    const result = await contactService.create(req.body);
    res.status(201).json({ success: true, data: result, message: 'Wiadomość wysłana pomyślnie' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/contact (admin only)
router.get('/', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const result = await contactService.getAll({ page: parseInt(page), limit: parseInt(limit), status });
    res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, pages: result.pages } });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/contact/:id
router.get('/:id', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const item = await contactService.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Nie znaleziono' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v2/contact/:id/status
router.patch('/:id/status', authenticate, requireRole('admin', 'editor'), [
  body('status').isIn(['new', 'read', 'replied', 'archived'])
], handleValidation, async (req, res, next) => {
  try {
    await contactService.updateStatus(req.params.id, req.body.status);
    res.json({ success: true, message: 'Status zaktualizowany' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v2/contact/:id
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await contactService.delete(req.params.id);
    res.json({ success: true, message: 'Wiadomość usunięta' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
