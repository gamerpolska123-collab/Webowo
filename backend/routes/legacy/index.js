// ============================================
// Legacy Routes Aggregator
// ============================================

const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.legacy'));
router.use('/content', require('./content.legacy'));
router.use('/upload', require('./upload.legacy'));
router.use('/contact', require('./contact.legacy'));
router.use('/backup', require('./backup.legacy'));

module.exports = router;
