// ============================================
// Environment Validation
// ============================================

const config = require('./config');

const requiredInProd = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

function validateEnv() {
  if (config.nodeEnv === 'production') {
    const missing = requiredInProd.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required env vars in production: ${missing.join(', ')}`);
    }
    if (config.jwt.secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
    if (config.jwt.refreshSecret.length < 32) {
      throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
    }
    if (config.corsOrigin === '*') {
      throw new Error('CORS_ORIGIN cannot be "*" in production');
    }
  }
}

module.exports = { validateEnv };
