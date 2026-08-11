// ============================================
// Webowo v3.0 – Rate Limiting
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

// Global: 100 requests per 15 minutes
const globalLimiter = createLimiter(15 * 60 * 1000, 100, 'Zbyt wiele żądań z tego adresu IP.');

// API: 200 requests per 15 minutes
const apiLimiter = createLimiter(15 * 60 * 1000, 200, 'Zbyt wiele żądań API z tego adresu IP.');

// Auth: 10 requests per 15 minutes (strict)
const authLimiter = createLimiter(15 * 60 * 1000, 10, 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.');

// Contact form: 5 submissions per hour
const contactLimiter = createLimiter(60 * 60 * 1000, 5, 'Zbyt wiele wiadomości. Spróbuj ponownie za godzinę.');

module.exports = { globalLimiter, apiLimiter, authLimiter, contactLimiter, createLimiter };
