// ============================================
// Webowo v3.1 – Contact Service
// ============================================

const contactModel = require('../models/contact.model');
const { logger } = require('../utils/logger');

class ContactService {
  async create(data) {
    const result = contactModel.create(data);
    logger.info(`New contact message from: ${data.email}`);
    return result;
  }

  async getAll(options = {}) {
    const { page = 1, limit = 20, status } = options;
    const offset = (page - 1) * limit;
    const items = contactModel.findAll({ limit, offset, status });
    const total = contactModel.count({ status });
    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async getById(id) {
    return contactModel.findById(id);
  }

  async updateStatus(id, status) {
    return contactModel.updateStatus(id, status);
  }

  async delete(id) {
    return contactModel.delete(id);
  }
}

module.exports = new ContactService();
