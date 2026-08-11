// ============================================
// Legacy Backup Routes (v1.4 compatibility)
// ============================================

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Use /api/v2/backups' });
});

module.exports = router;
