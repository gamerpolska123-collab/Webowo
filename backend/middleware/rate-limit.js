// ============================================
// Webowo v3.1 – Rate Limiting
// ============================================

const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

const createLimiter = (windowMs, max, message, keyGenerator) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyGenerator || ((req) => req.ip),
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded: ${req.ip} – ${req.path}`);
    res.status(429).json({
      success: false,
      error: message || 'Zbyt wiele żądań. Spróbuj ponownie później.',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  },
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1'
});

const globalLimiter = createLimiter(15 * 60 * 1000, 100, 'Zbyt wiele żądań z tego adresu IP.');
const apiLimiter = createLimiter(15 * 60 * 1000, 200, 'Zbyt wiele żądań API z tego adresu IP.');
const authLimiter = createLimiter(15 * 60 * 1000, 10, 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.');
const contactLimiter = createLimiter(60 * 60 * 1000, 5, 'Zbyt wiele wiadomości. Spróbuj ponownie za godzinę.');

module.exports = { globalLimiter, apiLimiter, authLimiter, contactLimiter, createLimiter };
