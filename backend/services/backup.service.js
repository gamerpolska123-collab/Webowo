// @ts-check
// ============================================
// Backup Service
// ============================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../config/config');
const { logger } = require('../utils/logger');

const BackupService = {
  createDump() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `webowo-backup-${timestamp}.sql`;
    const filePath = path.join(config.cms.backupDir, fileName);

    // SQLite dump
    const dump = execSync(`sqlite3 "${config.db.path}" .dump`, { encoding: 'utf8' });
    fs.writeFileSync(filePath, dump);

    // Cleanup old backups
    this.cleanup();

    logger.info(`Backup created: ${fileName}`);
    return { fileName, filePath };
  },

  list() {
    if (!fs.existsSync(config.cms.backupDir)) return [];
    return fs.readdirSync(config.cms.backupDir)
      .filter(f => f.endsWith('.sql'))
      .map(f => {
        const stat = fs.statSync(path.join(config.cms.backupDir, f));
        return { name: f, size: stat.size, createdAt: stat.mtime };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  restore(fileName) {
    const filePath = path.join(config.cms.backupDir, fileName);
    if (!fs.existsSync(filePath)) throw new Error('Backup file not found');

    execSync(`sqlite3 "${config.db.path}" < "${filePath}"`);
    logger.info(`Backup restored: ${fileName}`);
    return { success: true };
  },

  cleanup() {
    const files = this.list();
    if (files.length > config.cms.maxBackups) {
      const toDelete = files.slice(config.cms.maxBackups);
      for (const file of toDelete) {
        fs.unlinkSync(path.join(config.cms.backupDir, file.name));
        logger.info(`Old backup removed: ${file.name}`);
      }
    }

    // Retention policy
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - config.backup.retentionDays);
    for (const file of files) {
      if (file.createdAt < cutoff) {
        fs.unlinkSync(path.join(config.cms.backupDir, file.name));
        logger.info(`Expired backup removed: ${file.name}`);
      }
    }
  }
};

module.exports = BackupService;
