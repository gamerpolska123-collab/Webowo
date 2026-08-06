const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const MediaService = require('../../services/media.service');

router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) throw new Error('Brak pliku');
    const media = await MediaService.processImage(req.file);
    res.status(201).json({ success: true, data: media });
  } catch (err) { next(err); }
});

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const media = MediaService.getAll();
    res.json({ success: true, data: media });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    MediaService.delete(parseInt(req.params.id));
    res.json({ success: true, message: 'Plik usunięty' });
  } catch (err) { next(err); }
});

module.exports = router;
