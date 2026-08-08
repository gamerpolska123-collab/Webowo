// ============================================
// Webowo v3.0 – Backup Service
// ============================================

const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { logger } = require('../utils/logger');

class BackupService {
  async createManual() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}.sqlite`;
    const backupPath = path.join(config.cms.backupDir, backupName);

    fs.copyFileSync(config.db.path, backupPath);

    // Clean old backups
    this._cleanupOldBackups();

    logger.info(`Manual backup created: ${backupName}`);
    return { filename: backupName, path: backupPath, size: fs.statSync(backupPath).size };
  }

  async list() {
    const files = fs.readdirSync(config.cms.backupDir)
      .filter(f => f.endsWith('.sqlite'))
      .map(f => {
        const stat = fs.statSync(path.join(config.cms.backupDir, f));
        return {
          filename: f,
          size: stat.size,
          created_at: stat.birthtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return files;
  }

  async restore(filename) {
    const backupPath = path.join(config.cms.backupDir, filename);
    if (!fs.existsSync(backupPath)) {
      throw Object.assign(new Error('Backup nie istnieje'), { statusCode: 404 });
    }

    // Create safety backup of current db
    const safetyBackup = path.join(config.cms.backupDir, `pre-restore-${Date.now()}.sqlite`);
    fs.copyFileSync(config.db.path, safetyBackup);

    fs.copyFileSync(backupPath, config.db.path);
    logger.info(`Database restored from: ${filename}`);
    return { success: true };
  }

  async delete(filename) {
    const backupPath = path.join(config.cms.backupDir, filename);
    if (!fs.existsSync(backupPath)) {
      throw Object.assign(new Error('Backup nie istnieje'), { statusCode: 404 });
    }
    fs.unlinkSync(backupPath);
    logger.info(`Backup deleted: ${filename}`);
    return { success: true };
  }

  _cleanupOldBackups() {
    const retentionDays = config.cms.backupRetentionDays || 30;
    const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);

    fs.readdirSync(config.cms.backupDir)
      .filter(f => f.endsWith('.sqlite') && !f.startsWith('pre-restore'))
      .forEach(f => {
        const filePath = path.join(config.cms.backupDir, f);
        const stat = fs.statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
          logger.info(`Old backup removed: ${f}`);
        }
      });
  }
}

module.exports = new BackupService();
