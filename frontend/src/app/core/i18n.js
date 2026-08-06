// ============================================
// i18n System – Static Import + Locale Switch
// ============================================

import pl from '../../assets/i18n/pl.json';
import en from '../../assets/i18n/en.json';

const BUNDLED = { pl, en };
const DEFAULT_LOCALE = import.meta.env?.VITE_DEFAULT_LOCALE || 'pl';
const SUPPORTED_LOCALES = ['pl', 'en'];

let currentLocale = DEFAULT_LOCALE;
let translations = {};
let isReady = false;

function loadLocale(locale) {
  if (BUNDLED[locale]) {
    translations = BUNDLED[locale];
    currentLocale = locale;
    isReady = true;
    console.log(`[i18n] Loaded: ${locale} (bundled)`);
    return;
  }
  translations = BUNDLED[DEFAULT_LOCALE] || {};
  currentLocale = DEFAULT_LOCALE;
  isReady = true;
  console.warn(`[i18n] Locale ${locale} not found, fallback to ${DEFAULT_LOCALE}`);
}

function t(key, fallback = '') {
  return translations[key] || fallback || key;
}

function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  if (locale === currentLocale) return;
  localStorage.setItem('webowo_locale', locale);
  // Reload gwarantuje poprawne przeładowanie WSZYSTKICH komponentów
  window.location.reload();
}

function getLocale() {
  return currentLocale;
}

function initI18n() {
  const saved = localStorage.getItem('webowo_locale');
  const browser = navigator.language.split('-')[0];
  const locale = saved || (SUPPORTED_LOCALES.includes(browser) ? browser : DEFAULT_LOCALE);
  loadLocale(locale);
  document.documentElement.lang = currentLocale;
}

export { initI18n, t, setLocale, getLocale, isReady };
