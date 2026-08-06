// @ts-check
// ============================================
// Helper Utilities
// ============================================

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function escapeHtml(text) {
  const div = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[<>&"']/g, c => div[c]);
}

function validateImage(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
  return allowed.includes(file.mimetype) && file.size <= 5 * 1024 * 1024;
}

module.exports = { slugify, debounce, escapeHtml, validateImage };
