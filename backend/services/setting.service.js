// ============================================
// Webowo v3.1 – Setting Service
// ============================================

const settingModel = require('../models/setting.model');

class SettingService {
  async getPublic() {
    const settings = settingModel.findPublic();
    const result = {};
    settings.forEach(s => {
      result[s.key] = s.value;
    });
    return result;
  }

  async getAll() {
    return settingModel.findAll();
  }

  async set(key, value, isPublic = false, category = 'general') {
    return settingModel.set(key, value, isPublic, category);
  }

  async getByKey(key) {
    return settingModel.findByKey(key);
  }
}

module.exports = new SettingService();
