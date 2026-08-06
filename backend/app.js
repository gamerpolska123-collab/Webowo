// ============================================
// Webowo v2.0 – Express App
// Etap 5 – Backend Modernizacja
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config/config');
const { validateEnv } = require('./config/env');
const { logger } = require('./utils/logger');
const { globalLimiter } = require('./middleware/rate-limit');
const errorHandler = require('./middleware/error-handler');

// Validate environment on startup
validateEnv();

const app = express();

// Security
app.use(helmet());

// CORS (TODO #14) – supports multiple origins via comma-separated env
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);

    // In development, allow all
    if (config.nodeEnv === 'development') {
      return callback(null, true);
    }

    // In production, check against allowed list
    if (config.corsOrigins.includes('*')) {
      return callback(new Error('CORS_ORIGIN cannot contain "*" in production'));
    }
    if (config.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.set('trust proxy', 1);

// Rate limiting
app.use(globalLimiter);

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path} – ${req.ip}`);
  next();
});

// Static uploads
app.use(config.uploads.publicUrl, express.static(config.uploads.dir));

// ─── API v2 (new) ───
app.use('/api/v2', require('./api/v2'));

// ─── Sitemap & Robots (root level) ───
app.use('/', require('./api/v2/sitemap.routes'));

// ─── Legacy compatibility routes ───
app.use('/api', require('./routes/legacy'));

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'webowo-backend', version: config.appVersion, etap: 'Etap 5 – Backend Modernizacja' });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'webowo-backend', version: config.appVersion });
});

// CSRF token endpoint
app.get('/api/csrf', (req, res) => {
  const csrfToken = require('crypto').randomBytes(32).toString('hex');
  res.status(200).json({ success: true, csrfToken });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Nie znaleziono endpointu' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
