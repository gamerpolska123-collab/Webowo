// ============================================
// Webowo v3.1 – Backup Cron Job
// ============================================

const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { logger } = require('../utils/logger');

function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `auto-backup-${timestamp}.sqlite`;
    const backupPath = path.join(config.cms.backupDir, backupName);

    fs.copyFileSync(config.db.path, backupPath);

    const retentionDays = config.cms.backupRetentionDays || 30;
    const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);

    fs.readdirSync(config.cms.backupDir)
      .filter(f => f.startsWith('auto-backup') && f.endsWith('.sqlite'))
      .forEach(f => {
        const filePath = path.join(config.cms.backupDir, f);
        if (fs.statSync(filePath).mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
          logger.info(`Old auto-backup removed: ${f}`);
        }
      });

    logger.info(`Auto backup created: ${backupName}`);
    return { success: true, filename: backupName };
  } catch (err) {
    logger.error('Auto backup failed:', err.message);
    return { success: false, error: err.message };
  }
}

if (config.cms.backupCron && config.cms.backupCron !== 'none') {
  cron.schedule(config.cms.backupCron, () => {
    logger.info('Running scheduled backup...');
    createBackup();
  });
  logger.info(`Backup cron scheduled: ${config.cms.backupCron}`);
}

module.exports = { createBackup };
