// ============================================
// Webowo v3.1 – Media Service
// ============================================

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const config = require('../config/config');
const mediaModel = require('../models/media.model');
const { logger } = require('../utils/logger');

class MediaService {
  async processUpload(file) {
    const { filename, originalname, mimetype, size, path: filePath } = file;
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);

    let width, height;
    try {
      const metadata = await sharp(filePath).metadata();
      width = metadata.width;
      height = metadata.height;
    } catch {
      width = null;
      height = null;
    }

    // Generate variants
    const variants = {};
    for (const [variantName, variantConfig] of Object.entries(config.uploads.variants)) {
      try {
        const variantPath = path.join(config.uploads.dir, `${baseName}-${variantName}${ext}`);
        await sharp(filePath)
          .resize(variantConfig.width, variantConfig.height, { fit: variantConfig.fit, withoutEnlargement: true })
          .toFile(variantPath);
        variants[variantName] = `${config.uploads.publicUrl}/${path.basename(variantPath)}`;
      } catch (err) {
        logger.warn(`Failed to create variant ${variantName}: ${err.message}`);
      }
    }

    const url = `${config.uploads.publicUrl}/${filename}`;

    const result = mediaModel.create({
      filename,
      original_name: originalname,
      mime_type: mimetype,
      size,
      width,
      height,
      variants: JSON.stringify(variants),
      alt_text: '',
      url
    });

    logger.info(`Media uploaded: ${filename} (${size} bytes)`);
    return { ...result, variants };
  }

  async getAll(options = {}) {
    const items = mediaModel.findAll(options);
    const total = mediaModel.count();
    return { items, total };
  }

  async delete(id) {
    const media = mediaModel.findById(id);
    if (!media) {
      throw Object.assign(new Error('Plik nie istnieje'), { statusCode: 404 });
    }

    const filePath = path.join(config.uploads.dir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const ext = path.extname(media.filename);
    const baseName = path.basename(media.filename, ext);
    for (const variantName of Object.keys(config.uploads.variants)) {
      const variantPath = path.join(config.uploads.dir, `${baseName}-${variantName}${ext}`);
      if (fs.existsSync(variantPath)) {
        fs.unlinkSync(variantPath);
      }
    }

    mediaModel.delete(id);
    logger.info(`Media deleted: ${media.filename}`);
    return { success: true };
  }
}

module.exports = new MediaService();
