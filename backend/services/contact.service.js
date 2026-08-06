// @ts-check
// ============================================
// Contact Service
// ============================================

const ContactModel = require('../models/contact.model');
const EmailService = require('./email.service');

const ContactService = {
  create({ name, email, phone, subject, message, ip, userAgent }) {
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
