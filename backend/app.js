// ============================================
// Webowo v3.0 – Express App
// Production-ready with advanced security
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const path = require('path');
const config = require('./config/config');
const { validateEnv } = require('./config/env');
const { logger } = require('./utils/logger');
const { globalLimiter, apiLimiter } = require('./middleware/rate-limit');
const errorHandler = require('./middleware/error-handler');

// Validate environment on startup
validateEnv();

const app = express();

// Trust proxy (for reverse proxy setups like nginx)
app.set('trust proxy', config.trustProxy);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Compression
app.use(compression());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow same-origin / server-to-server requests
    if (!origin) return callback(null, true);
    // Allow all in development
    if (config.nodeEnv === 'development') return callback(null, true);
    // Allow whitelisted origins
    if (config.corsOrigins.includes(origin)) return callback(null, true);
    // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    if (/^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|127\.|localhost)/.test(origin)) {
      return callback(null, true);
    }
    // Allow any subdomain of matys.net.pl
    if (/https?:\/\/([a-z0-9-]+\.)?matys\.net\.pl/.test(origin)) {
      return callback(null, true);
    }
    logger.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
app.use(globalLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'debug';
    logger[level](`${req.method} ${req.path} ${res.statusCode} – ${duration}ms – ${req.ip}`);
  });
  next();
});

// Request ID
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Static uploads
app.use(config.uploads.publicUrl, express.static(config.uploads.dir, {
  maxAge: '1y',
  immutable: true
}));

// Health check (before auth)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'webowo-backend',
    version: config.appVersion,
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'webowo-backend', version: config.appVersion });
});

// CSRF token endpoint
app.get('/api/csrf', (req, res) => {
  const csrfToken = require('crypto').randomBytes(32).toString('hex');
  res.cookie('csrfToken', csrfToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 3600000
  });
  res.status(200).json({ success: true, csrfToken });
});

// ─── API v2 (new) ───
app.use('/api/v2', apiLimiter, require('./api/v2'));

// ─── Sitemap & Robots (root level) ───
app.use('/', require('./api/v2/sitemap.routes'));

// ─── Legacy compatibility routes ───
app.use('/api', require('./routes/legacy'));

// ─── Analytics endpoint (privacy-first) ───
app.post('/api/v2/analytics/event', (req, res) => {
  // Log analytics event (no personal data stored)
  const { event, url, path, referrer, lang, timestamp } = req.body;
  logger.info(`[Analytics] ${event} | ${path} | ${lang} | ${req.ip}`);
  res.status(204).send();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Nie znaleziono endpointu',
    path: req.path,
    method: req.method,
    requestId: req.id
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
