// ============================================
// Sitemap Routes
// ============================================

const express = require('express');
const router = express.Router();
const PageModel = require('../../models/page.model');

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const pages = PageModel.findPublished();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (const page of pages) {
      xml += `<url><loc>/${page.slug}</loc><lastmod>${page.updated_at}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    }
    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) { next(err); }
});

router.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

module.exports = router;
