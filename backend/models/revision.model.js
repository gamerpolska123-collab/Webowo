// ============================================
// Webowo v3.0 – Revision Model
// ============================================

const db = require('../db/database');
const config = require('../config/config');

class RevisionModel {
  constructor() {
    this.table = 'revisions';
  }

  findByEntity(entityType, entityId, options = {}) {
    const { limit = 20 } = options;
    return db.prepare(`SELECT id, entity_type, entity_id, data, created_by, created_at FROM ${this.table} WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT ?`).all(entityType, entityId, limit);
  }

  create(data) {
    const { entity_type, entity_id, data: revisionData, created_by } = data;
    const result = db.prepare(`INSERT INTO ${this.table} (entity_type, entity_id, data, created_by) VALUES (?, ?, ?, ?)`).run(entity_type, entity_id, JSON.stringify(revisionData), created_by);
    this._cleanupOld(entity_type, entity_id);
    return this.findById(result.lastInsertRowid);
  }

  findById(id) {
    return db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).get(id);
  }

  _cleanupOld(entityType, entityId) {
    const maxRevisions = config.cms.maxRevisions || 50;
    db.prepare(`DELETE FROM ${this.table} WHERE id NOT IN (SELECT id FROM ${this.table} WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT ?)`).run(entityType, entityId, maxRevisions);
  }

  restore(id) {
    const revision = this.findById(id);
    if (!revision) return null;
    return JSON.parse(revision.data);
  }
}

module.exports = new RevisionModel();
