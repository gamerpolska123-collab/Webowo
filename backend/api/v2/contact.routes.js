const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { validate } = require('../../middleware/validate');
const { contactLimiter } = require('../../middleware/rate-limit');
const { authenticateToken } = require('../../middleware/auth');
const ContactService = require('../../services/contact.service');

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1)
});

router.post('/', contactLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const contact = ContactService.create({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    res.status(201).json({ success: true, data: contact, message: 'Wiadomość wysłana!' });
  } catch (err) { next(err); }
});

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const contacts = ContactService.getAll();
    res.json({ success: true, data: contacts });
  } catch (err) { next(err); }
});

router.patch('/:id/status', authenticateToken, async (req, res, next) => {
  try {
    const contact = ContactService.updateStatus(parseInt(req.params.id), req.body.status);
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    ContactService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Wiadomość usunięta' });
  } catch (err) { next(err); }
});

module.exports = router;
