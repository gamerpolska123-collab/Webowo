const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { validate } = require('../../middleware/validate');
const { authLimiter } = require('../../middleware/rate-limit');
const AuthService = require('../../services/auth.service');
const { authenticateToken } = require('../../middleware/auth');
const config = require('../../config/config');

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'editor']).optional()
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await AuthService.login({
      username: req.body.username,
      password: req.body.password,
      ip: req.ip
    });
    // Refresh token as httpOnly cookie (TODO #6)
    res.cookie(config.security.refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: config.security.cookieSecure,
      sameSite: config.security.cookieSameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    res.json({ success: true, data: { user, accessToken, expiresIn: config.jwt.accessExpiresIn } });
  } catch (err) { next(err); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    // Read refresh from cookie first, fallback to body (TODO #6)
    const refreshToken = req.cookies?.[config.security.refreshCookieName] || req.body.refreshToken;
    const result = await AuthService.refresh(refreshToken);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[config.security.refreshCookieName];
    await AuthService.logout(refreshToken);
    // Clear cookie (TODO #6)
    res.clearCookie(config.security.refreshCookieName, {
      path: '/',
      httpOnly: true,
      secure: config.security.cookieSecure,
      sameSite: config.security.cookieSameSite
    });
    res.json({ success: true, message: 'Wylogowano pomyślnie.' });
  } catch (err) { next(err); }
});

router.get('/me', authenticateToken, (req, res) => {
  res.json({ success: true, data: { id: req.user.sub, username: req.user.username, role: req.user.role } });
});

module.exports = router;
