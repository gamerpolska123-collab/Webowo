// ============================================
// Webowo v3.0 – Content Service
// ============================================

const pageModel = require('../models/page.model');
const sectionModel = require('../models/section.model');
const revisionModel = require('../models/revision.model');
const { logger } = require('../utils/logger');

class ContentService {
  async getPage(slug) {
    const page = pageModel.findBySlug(slug);
    if (!page) return null;

    const sections = sectionModel.findByPageId(page.id, { isActive: true });
    return {
      ...page,
      sections: sections.map(s => ({
        ...s,
        data: JSON.parse(s.data || '{}')
      }))
    };
  }

  async getAllPages(options = {}) {
    return pageModel.findAll(options);
  }

  async createPage(data) {
    const page = pageModel.create(data);
    if (data.sections && Array.isArray(data.sections)) {
      data.sections.forEach((section, index) => {
        sectionModel.create({
          page_id: page.id,
          type: section.type,
          data: section.data,
          order_index: section.order_index || index,
          is_active: section.is_active !== undefined ? section.is_active : 1
        });
      });
    }
    logger.info(`Page created: ${page.slug}`);
    return this.getPage(page.slug);
  }

  async updatePage(slug, data) {
    const existing = pageModel.findBySlug(slug);
    if (!existing) {
      throw Object.assign(new Error('Strona nie istnieje'), { statusCode: 404 });
    }

    // Create revision before update
    revisionModel.create({
      entity_type: 'page',
      entity_id: existing.id,
      data: existing,
      created_by: data.updated_by
    });

    const page = pageModel.update(existing.id, {
      title: data.title,
      meta_description: data.meta_description,
      is_active: data.is_active
    });

    // Update sections if provided
    if (data.sections && Array.isArray(data.sections)) {
      sectionModel.deleteByPageId(page.id);
      data.sections.forEach((section, index) => {
        sectionModel.create({
          page_id: page.id,
          type: section.type,
          data: section.data,
          order_index: section.order_index || index,
          is_active: section.is_active !== undefined ? section.is_active : 1
        });
      });
    }

    logger.info(`Page updated: ${slug}`);
    return this.getPage(slug);
  }

  async deletePage(slug) {
    const page = pageModel.findBySlug(slug);
    if (!page) {
      throw Object.assign(new Error('Strona nie istnieje'), { statusCode: 404 });
    }
    sectionModel.deleteByPageId(page.id);
    pageModel.delete(page.id);
    logger.info(`Page deleted: ${slug}`);
    return { success: true };
  }

  async getSections(pageId) {
    return sectionModel.findByPageId(pageId);
  }
}

module.exports = new ContentService();
