// ============================================
// JWT Authentication Middleware v2
// ============================================

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const AuthService = require('../services/auth.service');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Brak tokena autoryzacyjnego. Zaloguj się ponownie.' });
  }

  try {
    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Token wygasł lub jest nieprawidłowy.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Brak uprawnień.' });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
