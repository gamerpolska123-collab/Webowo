// ============================================
// Legacy Contact Routes (v1.4 compatibility)
// ============================================

const express = require('express');
const router = express.Router();
const ContactService = require('../../services/contact.service');

router.post('/', async (req, res, next) => {
  try {
    const contact = ContactService.create({ ...req.body, ip: req.ip, user_agent: req.headers['user-agent'] });
    res.json({ success: true, message: 'Wiadomość wysłana' });
  } catch (err) { next(err); }
});

module.exports = router;
