// ============================================
// Webowo v3.1 – Environment Validation
// ============================================

function validateEnv() {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Brakujące zmienne środowiskowe (używane wartości domyślne): ${missing.join(', ')}`);
    console.warn('   W produkcji ustaw te zmienne dla bezpieczeństwa!');
  }
}

module.exports = { validateEnv };
