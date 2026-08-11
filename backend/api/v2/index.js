// ============================================
// Webowo v3.1 – API v2 Routes
// ============================================

const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '3.1.0', api: 'v2' });
});

router.use('/auth', require('./auth.routes'));
router.use('/content', require('./content.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/settings', require('./setting.routes'));
router.use('/media', require('./media.routes'));
router.use('/backup', require('./backup.routes'));
router.use('/sitemap', require('./sitemap.routes'));

module.exports = router;
