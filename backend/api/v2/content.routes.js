// ============================================
// Webowo v3.1 – Content Routes
// ============================================

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const contentService = require('../../services/content.service');
const { authenticate, requireRole } = require('../../middleware/auth');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.get('/pages/:slug', async (req, res, next) => {
  try {
    const page = await contentService.getPage(req.params.slug);
    if (!page) {
      return res.status(404).json({ success: false, error: 'Strona nie istnieje' });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

router.get('/pages', async (req, res, next) => {
  try {
    const pages = await contentService.getAllPages();
    res.json({ success: true, data: pages });
  } catch (err) {
    next(err);
  }
});

router.post('/pages', authenticate, requireRole('admin', 'editor'), [
  body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/).withMessage('Slug może zawierać tylko małe litery, cyfry i myślniki'),
  body('title').trim().notEmpty(),
  body('sections').optional().isArray()
], handleValidation, async (req, res, next) => {
  try {
    const page = await contentService.createPage(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

router.put('/pages/:slug', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const page = await contentService.updatePage(req.params.slug, { ...req.body, updated_by: req.user?.id });
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

router.delete('/pages/:slug', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await contentService.deletePage(req.params.slug);
    res.json({ success: true, message: 'Strona usunięta' });
  } catch (err) {
    next(err);
  }
});

router.get('/sections/:pageId', async (req, res, next) => {
  try {
    const sections = await contentService.getSections(req.params.pageId);
    res.json({ success: true, data: sections });
  } catch (err) {
    next(err);
  }
});

router.put('/sections/:id', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const section = await contentService.updateSection(req.params.id, { ...req.body, updated_by: req.user?.id });
    res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
});

router.patch('/sections/:id/toggle', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const section = await contentService.toggleSection(req.params.id);
    res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
});

router.post('/pages/:pageId/reorder', authenticate, requireRole('admin', 'editor'), [
  body('sectionIds').isArray().withMessage('sectionIds must be an array')
], handleValidation, async (req, res, next) => {
  try {
    await contentService.reorderSections(req.params.pageId, req.body.sectionIds);
    res.json({ success: true, message: 'Kolejność zaktualizowana' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
