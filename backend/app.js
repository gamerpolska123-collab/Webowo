// ============================================
// Webowo v3.1 – Express App
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

validateEnv();

const app = express();

// Trust proxy in production
if (config.trustProxy) {
  app.set('trust proxy', 1);
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate limiting
app.use(globalLimiter);
app.use('/api', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static(config.uploads.dir));

// Request ID
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: config.appVersion, timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v2', require('./api/v2'));
app.use('/api', require('./routes/legacy'));
app.use('/api', require('./routes/legacy/index'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint nie istnieje', path: req.path });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
