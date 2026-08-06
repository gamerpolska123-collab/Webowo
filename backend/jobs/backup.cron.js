// ============================================
// Backup Cron Job
// Usage: node jobs/backup.cron.js [manual]
// ============================================

const cron = require('node-cron');
const BackupService = require('../services/backup.service');
const EmailService = require('../services/email.service');
const { logger } = require('../utils/logger');
const config = require('../config/config');

function runBackup() {
  try {
    const result = BackupService.createDump();
    logger.info(`Scheduled backup created: ${result.fileName}`);
  } catch (err) {
    logger.error(`Scheduled backup failed: ${err.message}`);
    // Send alert email (optional, TODO #13)
    EmailService.sendBackupAlert(err.message).catch(() => {});
  }
}

if (require.main === module && process.argv[2] === 'manual') {
  runBackup();
  process.exit(0);
}

if (config.backup.enabled) {
  cron.schedule(config.backup.cron, runBackup);
  logger.info(`Backup cron scheduled: ${config.backup.cron}`);
}

module.exports = { runBackup };
