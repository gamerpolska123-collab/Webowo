// ============================================
// Webowo v3.1 – Email Service
// ============================================

const nodemailer = require('nodemailer');
const config = require('../config/config');
const { logger } = require('../utils/logger');

let transporter = null;

function getTransporter() {
  if (!transporter && config.email.enabled) {
    transporter = nodemailer.createTransport(config.email.smtp);
  }
  return transporter;
}

const EmailService = {
  async sendContactNotification({ name, email, subject, message }) {
    if (!config.email.enabled) {
      logger.debug('Email disabled, skipping notification');
      return;
    }
    const tp = getTransporter();
    if (!tp) return;

    await tp.sendMail({
      from: config.email.from,
      to: config.email.to,
      subject: `${config.email.subjectPrefix} ${subject || 'Nowe zapytanie'}`,
      text: `Od: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>Od:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`
    });
    logger.info(`Email notification sent for contact from ${email}`);
  },

  async sendBackupAlert(errorMessage) {
    if (!config.email.enabled) return;
    const tp = getTransporter();
    if (!tp) return;

    await tp.sendMail({
      from: config.email.from,
      to: config.email.to,
      subject: '[Webowo] ALERT: Backup failed',
      text: `Backup failed with error: ${errorMessage}`
    });
    logger.error(`Backup alert email sent: ${errorMessage}`);
  }
};

module.exports = EmailService;
