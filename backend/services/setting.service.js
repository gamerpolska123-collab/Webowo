// ============================================
// Webowo v3.0 – Setting Service
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

  async set(key, value, isPublic = false) {
    return settingModel.set(key, value, isPublic);
  }
}

module.exports = new SettingService();
