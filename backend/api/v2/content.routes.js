// ============================================
// Webowo v3.0 – Content Routes
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

// GET /api/v2/content/pages/:slug
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

// GET /api/v2/content/pages
router.get('/pages', async (req, res, next) => {
  try {
    const pages = await contentService.getAllPages();
    res.json({ success: true, data: pages });
  } catch (err) {
    next(err);
  }
});

// POST /api/v2/content/pages (admin only)
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

// PUT /api/v2/content/pages/:slug
router.put('/pages/:slug', authenticate, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const page = await contentService.updatePage(req.params.slug, req.body);
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v2/content/pages/:slug
router.delete('/pages/:slug', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await contentService.deletePage(req.params.slug);
    res.json({ success: true, message: 'Strona usunięta' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/content/sections/:pageId
router.get('/sections/:pageId', async (req, res, next) => {
  try {
    const sections = await contentService.getSections(req.params.pageId);
    res.json({ success: true, data: sections });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
