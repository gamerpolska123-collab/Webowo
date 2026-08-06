// @ts-check
// ============================================
// Content Service
// ============================================

const PageModel = require('../models/page.model');
const SectionModel = require('../models/section.model');
const RevisionModel = require('../models/revision.model');

const ContentService = {
  createPage(data) {
    const page = PageModel.create(data);
    return page;
  },

  getPageBySlug(slug) {
    const page = PageModel.findBySlug(slug);
    if (!page) return null;
    const sections = SectionModel.findByPageId(page.id);
    return { ...page, sections };
  },

  getAllPages() {
    return PageModel.findAll();
  },

  updatePage(id, data) {
    return PageModel.update(id, data);
  },

  publishPage(id) {
    return PageModel.publish(id);
  },

  deletePage(id) {
    SectionModel.deleteByPageId(id);
    return PageModel.delete(id);
  },

  createSection(data) {
    return SectionModel.create(data);
  },

  updateSection(id, data) {
    const section = SectionModel.findById(id);
    if (section) {
      RevisionModel.create({
        pageId: section.page_id,
        sectionId: section.id,
        data: section.data,
        createdBy: data.updatedBy,
        note: data.note || 'Auto-saved before update'
      });
    }
    return SectionModel.update(id, data);
  },

  getRevisions(pageId, limit = 50) {
    return RevisionModel.findByPageId(pageId, limit);
  },

  rollback(pageId, revisionId) {
    const revision = RevisionModel.findById(revisionId);
    if (!revision || revision.page_id !== pageId) {
      throw new Error('Revision not found');
    }
    const section = SectionModel.findById(revision.section_id);
    if (section) {
      SectionModel.update(section.id, { data: revision.data });
    }
    return { success: true };
  }
};

module.exports = ContentService;
