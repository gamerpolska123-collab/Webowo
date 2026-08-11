// ============================================
// Webowo v3.1 – Global Error Handler
// ============================================

const { logger } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV === 'development';

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    requestId: req.id,
    statusCode: err.statusCode || err.status || 500
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Błąd walidacji',
      details: err.errors || err.message,
      requestId: req.id
    });
  }

  if (err.name === 'UnauthorizedError' || err.message?.includes('jwt')) {
    return res.status(401).json({
      success: false,
      error: 'Brak autoryzacji',
      requestId: req.id
    });
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Nieprawidłowy format JSON',
      requestId: req.id
    });
  }

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      success: false,
      error: 'Rekord już istnieje',
      requestId: req.id
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: isDev ? err.message : 'Wystąpił błąd serwera',
    ...(isDev && { stack: err.stack }),
    requestId: req.id
  });
}

module.exports = errorHandler;
