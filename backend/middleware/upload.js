// ============================================
// Upload Middleware (Multer)
// ============================================

const multer = require('multer');
const path = require('path');
const config = require('../config/config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploads.dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (config.uploads.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Niedozwolony typ pliku. Dozwolone: JPEG, PNG, WebP, AVIF, SVG.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.uploads.maxSize }
});

module.exports = upload;
