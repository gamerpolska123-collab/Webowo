// ============================================
// Webowo v3.0 – Auth Routes
// ============================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authService = require('../../services/auth.service');
const { authenticate, optionalAuth } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rate-limit');

// Validation helper
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// POST /api/v2/auth/login
router.post('/login', authLimiter, [
  body('username').trim().notEmpty().withMessage('Nazwa użytkownika jest wymagana'),
  body('password').notEmpty().withMessage('Hasło jest wymagane')
], handleValidation, async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/v2/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/v2/auth/logout
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.json({ success: true, message: 'Wylogowano pomyślnie' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v2/auth/password
router.put('/password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).withMessage('Hasło musi mieć min. 8 znaków')
], handleValidation, async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    res.json({ success: true, message: 'Hasło zmienione pomyślnie' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
