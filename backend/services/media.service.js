// @ts-check
// ============================================
// Media Service
// ============================================

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const MediaModel = require('../models/media.model');

const MediaService = {
  async processImage(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = uuidv4();
    const filename = `${basename}${ext}`;
    const filepath = path.join(config.uploads.dir, filename);

    // Save original
    fs.renameSync(file.path, filepath);

    // Generate variants
    const variants = {};
    const metadata = await sharp(filepath).metadata();

    for (const [name, opts] of Object.entries(config.uploads.variants)) {
      const variantFilename = `${basename}-${name}.webp`;
      const variantPath = path.join(config.uploads.dir, variantFilename);
      await sharp(filepath)
        .resize(opts.width, opts.height, { fit: opts.fit })
        .webp({ quality: 85 })
        .toFile(variantPath);
      variants[name] = `${config.uploads.publicUrl}/${variantFilename}`;
    }

    const media = MediaModel.create({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      variants: JSON.stringify(variants),
      altText: '',
      url: `${config.uploads.publicUrl}/${filename}`
    });

    return { ...media, variants };
  },

  getAll() {
    const items = MediaModel.findAll();
    return items.map(m => ({ ...m, variants: m.variants ? JSON.parse(m.variants) : {} }));
  },

  delete(id) {
    const media = MediaModel.findById(id);
    if (!media) throw new Error('Media not found');

    // Delete files
    const filepath = path.join(config.uploads.dir, media.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    if (media.variants) {
      const variants = JSON.parse(media.variants);
      for (const url of Object.values(variants)) {
        const variantPath = path.join(config.uploads.dir, path.basename(url));
        if (fs.existsSync(variantPath)) fs.unlinkSync(variantPath);
      }
    }

    return MediaModel.delete(id);
  }
};

module.exports = MediaService;
