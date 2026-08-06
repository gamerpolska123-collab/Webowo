// @ts-check
// ============================================
// Setting Service
// ============================================

const SettingModel = require('../models/setting.model');

const SettingService = {
  getAll() {
    return SettingModel.findAll();
  },

  getPublic() {
    return SettingModel.findPublic();
  },

  getByKey(key) {
    return SettingModel.findByKey(key);
  },

  update(key, value) {
    return SettingModel.update(key, value);
  },

  create(data) {
    return SettingModel.create(data);
  },

  delete(id) {
    return SettingModel.delete(id);
  }
};

module.exports = SettingService;
