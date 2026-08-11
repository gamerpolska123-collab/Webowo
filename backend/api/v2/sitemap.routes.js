// ============================================
// Webowo v3.1 – Sitemap Routes
// ============================================

const express = require('express');
const router = express.Router();
const contentService = require('../../services/content.service');

router.get('/', async (req, res, next) => {
  try {
    const pages = await contentService.getAllPages({ isActive: true });
    const baseUrl = process.env.SITE_URL || 'https://www.matys.net.pl';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    pages.forEach(page => {
      if (page.slug !== 'home') {
        xml += `  <url>\n    <loc>${baseUrl}/${page.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }
    });

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
