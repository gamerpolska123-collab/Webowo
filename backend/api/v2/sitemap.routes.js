// ============================================
// Webowo v3.0 – Sitemap & Robots Routes
// ============================================

const express = require('express');
const router = express.Router();
const contentService = require('../../services/content.service');

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const pages = await contentService.getAllPages();
    const baseUrl = process.env.SITE_URL || 'https://matys.net.pl';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static routes
    const staticRoutes = ['/', '/about', '/services', '/portfolio', '/process', '/pricing', '/faq', '/contact'];
    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Dynamic pages
    pages.forEach(page => {
      if (page.slug !== 'home') {
        xml += `  <url>\n    <loc>${baseUrl}/${page.slug}</loc>\n    <lastmod>${page.updated_at || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
    });

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const siteUrl = process.env.SITE_URL || 'https://matys.net.pl';
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${siteUrl}/sitemap.xml\n`);
});

module.exports = router;
