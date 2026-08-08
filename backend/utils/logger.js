// ============================================
// Webowo v3.0 – Winston Logger
// ============================================

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const config = require('../config/config');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` | ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

const transports = [];

// Console transport (development)
if (config.nodeEnv !== 'production') {
  transports.push(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'HH:mm:ss' }),
      logFormat
    )
  }));
}

// File transports (all environments)
transports.push(
  new DailyRotateFile({
    filename: path.join(config.log.dir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: config.log.maxSize,
    maxFiles: config.log.maxFiles,
    format: combine(timestamp(), json())
  }),
  new DailyRotateFile({
    filename: path.join(config.log.dir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: config.log.maxSize,
    maxFiles: config.log.maxFiles,
    level: 'error',
    format: combine(timestamp(), json())
  })
);

const logger = winston.createLogger({
  level: config.log.level,
  defaultMeta: { service: 'webowo-backend' },
  transports,
  exitOnError: false
});

module.exports = { logger };
