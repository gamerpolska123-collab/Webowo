const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { validate } = require('../../middleware/validate');
const { authenticateToken, requireRole } = require('../../middleware/auth');
const ContentService = require('../../services/content.service');

const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  meta: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional()
});

router.get('/pages', async (req, res, next) => {
  try {
    const pages = ContentService.getAllPages();
    res.json({ success: true, data: pages });
  } catch (err) { next(err); }
});

router.get('/pages/:slug', async (req, res, next) => {
  try {
    const page = ContentService.getPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ success: false, error: 'Strona nie znaleziona' });
    res.json({ success: true, data: page });
  } catch (err) { next(err); }
});

router.post('/pages', authenticateToken, requireRole('admin', 'editor'), validate(pageSchema), async (req, res, next) => {
  try {
    const page = ContentService.createPage(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (err) { next(err); }
});

router.patch('/pages/:id', authenticateToken, requireRole('admin', 'editor'), async (req, res, next) => {
  try {
    const page = ContentService.updatePage(parseInt(req.params.id), req.body);
    res.json({ success: true, data: page });
  } catch (err) { next(err); }
});

router.post('/pages/:id/publish', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    const page = ContentService.publishPage(parseInt(req.params.id));
    res.json({ success: true, data: page });
  } catch (err) { next(err); }
});

router.delete('/pages/:id', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    ContentService.deletePage(parseInt(req.params.id));
    res.json({ success: true, message: 'Strona usunięta' });
  } catch (err) { next(err); }
});

router.get('/pages/:id/revisions', authenticateToken, async (req, res, next) => {
  try {
    const revisions = ContentService.getRevisions(parseInt(req.params.id));
    res.json({ success: true, data: revisions });
  } catch (err) { next(err); }
});

router.post('/pages/:id/rollback', authenticateToken, requireRole('admin'), async (req, res, next) => {
  try {
    ContentService.rollback(parseInt(req.params.id), req.body.revisionId);
    res.json({ success: true, message: 'Przywrócono wersję' });
  } catch (err) { next(err); }
});

module.exports = router;
