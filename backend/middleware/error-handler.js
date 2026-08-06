// ============================================
// Global Error Handler
// ============================================

const { logger } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${err.name}: ${err.message} — ${req.method} ${req.path}`);

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(403).json({ success: false, error: 'Token wygasł lub jest nieprawidłowy.' });
  }

  const status = err.status || 500;
  const message = err.message || 'Wewnętrzny błąd serwera';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
