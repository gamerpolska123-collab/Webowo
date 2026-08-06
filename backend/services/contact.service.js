// @ts-check
// ============================================
// Contact Service
// ============================================

const fs = require('fs');
const path = require('path');
const ContactModel = require('../models/contact.model');
const EmailService = require('./email.service');
const config = require('../config/config');
const { logger } = require('../utils/logger');

// Upewnij się, że katalog logów GDPR istnieje
const GDPR_LOG_DIR = config.gdpr.logDir;
if (!fs.existsSync(GDPR_LOG_DIR)) {
  fs.mkdirSync(GDPR_LOG_DIR, { recursive: true });
}

const GDPR_LOG_FILE = path.join(GDPR_LOG_DIR, 'gdpr-consents.log');

/**
 * Loguje zgodę GDPR do osobnego pliku.
 * Format: JSON Lines (jeden obiekt per linia).
 * @param {{ip: string, userAgent: string, email: string, timestamp: string}} meta
 */
function logGdprConsent({ ip, userAgent, email, timestamp }) {
  try {
    const entry = {
      timestamp,
      ip: ip || null,
      userAgent: userAgent || null,
      email: email || null,
      action: 'contact_form_submit',
      retentionDays: config.gdpr.logRetentionDays
    };
    fs.appendFileSync(GDPR_LOG_FILE, JSON.stringify(entry) + '\n');
  } catch (err) {
    logger.error({ err }, 'GDPR log write failed');
  }
}

/**
 * Czyści logi GDPR starsze niż skonfigurowany okres retencji.
 * Wywoływane automatycznie przy każdym zapisie (co 100 zapisów pełny cleanup).
 */
function cleanupGdprLogs() {
  try {
    if (!fs.existsSync(GDPR_LOG_FILE)) return;

    const retentionMs = config.gdpr.logRetentionDays * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - retentionMs;
    const lines = fs.readFileSync(GDPR_LOG_FILE, 'utf-8').split('\n').filter(Boolean);
    const valid = lines.filter(line => {
      try {
        const entry = JSON.parse(line);
        const entryTime = new Date(entry.timestamp).getTime();
        return entryTime >= cutoff;
      } catch {
        return false;
      }
    });

    if (valid.length < lines.length) {
      fs.writeFileSync(GDPR_LOG_FILE, valid.join('\n') + (valid.length ? '\n' : ''));
      logger.info({ removed: lines.length - valid.length }, 'GDPR logs cleaned up');
    }
  } catch (err) {
    logger.error({ err }, 'GDPR log cleanup failed');
  }
}

// Licznik zapisów do okresowego cleanupu
let writeCounter = 0;

const ContactService = {
  create({ name, email, phone, subject, message, ip, userAgent }) {
    const timestamp = new Date().toISOString();

    // Loguj zgodę GDPR
    logGdprConsent({ ip, userAgent, email, timestamp });
    writeCounter++;
    if (writeCounter % 100 === 0) {
      cleanupGdprLogs();
    }

    const contact = ContactModel.create({ name, email, phone, subject, message, ip, userAgent });
    // Send email notification (async, don't block)
    EmailService.sendContactNotification({ name, email, subject, message }).catch(() => {});
    return contact;
  },

  getAll() {
    return ContactModel.findAll();
  },

  updateStatus(id, status) {
    return ContactModel.updateStatus(id, status);
  },

  delete(id) {
    return ContactModel.delete(id);
  }
};

module.exports = ContactService;
