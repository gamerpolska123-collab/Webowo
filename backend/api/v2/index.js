// ============================================
// API v2 Router
// ============================================

const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/content', require('./content.routes'));
router.use('/media', require('./media.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/settings', require('./setting.routes'));
router.use('/backups', require('./backup.routes'));

// Sitemap & robots (also mounted at root in app.js)
router.use('/', require('./sitemap.routes'));

module.exports = router;
