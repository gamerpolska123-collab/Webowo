// ============================================
// Webowo v3.1 – Legacy API Compatibility
// ============================================

const express = require('express');
const router = express.Router();
const contentService = require('../services/content.service');

router.get('/content', async (req, res, next) => {
  try {
    const page = await contentService.getPage('home');
    if (!page) {
      return res.status(404).json({ error: 'Nie znaleziono treści' });
    }
    const legacyData = {};
    page.sections.forEach(section => {
      legacyData[section.type] = section.data;
    });
    res.json(legacyData);
  } catch (err) {
    next(err);
  }
});

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
