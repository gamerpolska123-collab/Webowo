// ============================================
// Webowo v3.0 – Advanced i18n Engine
// Interpolation, pluralization, lazy loading, RTL support
// ============================================

import pl from '../../assets/i18n/pl.json';
import en from '../../assets/i18n/en.json';

const BUNDLED = { pl, en };
const DEFAULT_LOCALE = import.meta.env?.VITE_DEFAULT_LOCALE || 'pl';
const SUPPORTED_LOCALES = ['pl', 'en'];
const RTL_LOCALES = ['ar', 'he', 'fa'];

let currentLocale = DEFAULT_LOCALE;
let translations = {};
let isReady = false;
let localeListeners = new Set();

function loadLocale(locale) {
  if (BUNDLED[locale]) {
    translations = BUNDLED[locale];
    currentLocale = locale;
    isReady = true;
    notifyListeners();
    updateDocumentAttributes();
    return Promise.resolve();
  }

  // Fallback
  translations = BUNDLED[DEFAULT_LOCALE] || {};
  currentLocale = DEFAULT_LOCALE;
  isReady = true;
  notifyListeners();
  updateDocumentAttributes();
  return Promise.resolve();
}

function updateDocumentAttributes() {
  document.documentElement.lang = currentLocale;
  document.documentElement.dir = RTL_LOCALES.includes(currentLocale) ? 'rtl' : 'ltr';
}

function notifyListeners() {
  localeListeners.forEach(cb => {
    try { cb(currentLocale); } catch (e) { console.error('[i18n] Listener error:', e); }
  });
  window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { locale: currentLocale } }));
}

function t(key, params = {}) {
  if (!isReady) return key;

  let value = translations[key];
  if (value === undefined) {
    // Try fallback
    value = BUNDLED[DEFAULT_LOCALE]?.[key] || key;
  }

  // Interpolation: {name}, {{count}}
  if (params && typeof value === 'string') {
    value = value.replace(/\{\{?(\w+)\}?\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });

    // Pluralization: {count, plural, one {X} other {Y}}
    value = value.replace(/\{count\s*,\s*plural\s*,\s*one\s*\{([^}]+)\}\s*other\s*\{([^}]+)\}\}/g,
      (match, oneForm, otherForm) => {
        const count = parseInt(params.count, 10);
        return count === 1 ? oneForm : otherForm;
      }
    );
  }

  return value;
}

function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`[i18n] Locale "${locale}" not supported`);
    return;
  }
  if (locale === currentLocale) return;
  loadLocale(locale);
}

function getLocale() {
  return currentLocale;
}

function onLocaleChange(callback) {
  localeListeners.add(callback);
  return () => localeListeners.delete(callback);
}

function detectLocale() {
  // Check URL param
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocale = urlParams.get('lang');
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) return urlLocale;

  // Check localStorage
  try {
    const saved = localStorage.getItem('webowo_locale');
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  } catch (e) {}

  // Check browser
  const browserLang = navigator.language?.split('-')[0];
  if (browserLang && SUPPORTED_LOCALES.includes(browserLang)) return browserLang;

  return DEFAULT_LOCALE;
}

function initI18n() {
  const detected = detectLocale();
  loadLocale(detected);
  console.log(`[i18n] Initialized with locale: ${detected}`);
}

export { initI18n, t, setLocale, getLocale, onLocaleChange, SUPPORTED_LOCALES };
