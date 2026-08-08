// ============================================
// Webowo v3.0 – Legacy API Compatibility
// ============================================

const express = require('express');
const router = express.Router();
const contentService = require('../services/content.service');

// GET /api/content (legacy)
router.get('/content', async (req, res, next) => {
  try {
    const page = await contentService.getPage('home');
    if (!page) {
      return res.status(404).json({ error: 'Nie znaleziono treści' });
    }

    // Transform to legacy format
    const legacyData = {};
    page.sections.forEach(section => {
      legacyData[section.type] = section.data;
    });

    res.json(legacyData);
  } catch (err) {
    next(err);
  }
});

// GET /api/content/:slug (legacy)
router.get('/content/:slug', async (req, res, next) => {
  try {
    const page = await contentService.getPage(req.params.slug);
    if (!page) {
      return res.status(404).json({ error: 'Nie znaleziono treści' });
    }
    res.json(page);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
