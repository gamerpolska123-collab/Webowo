// ============================================
// Rate Limiting Middleware
// ============================================

const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const globalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Zbyt wiele żądań. Spróbuj ponownie później.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Zbyt wiele prób logowania. Spróbuj ponownie za 15 minut.' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Zbyt wiele wiadomości. Spróbuj ponownie za godzinę.' }
});

module.exports = { globalLimiter, authLimiter, contactLimiter };
