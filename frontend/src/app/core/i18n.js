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
    return;
  }
  translations = BUNDLED[DEFAULT_LOCALE] || {};
  currentLocale = DEFAULT_LOCALE;
  isReady = true;
}

// Auto-init on module load (before any component renders)
const saved = localStorage.getItem('webowo_locale');
const browser = navigator.language.split('-')[0];
const initialLocale = saved || (SUPPORTED_LOCALES.includes(browser) ? browser : DEFAULT_LOCALE);
loadLocale(initialLocale);

function t(key, fallback = '') {
  return translations[key] || fallback || key;
}

function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  if (locale === currentLocale) return;
  localStorage.setItem('webowo_locale', locale);
  loadLocale(locale);
  document.documentElement.lang = currentLocale;
  window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { locale } }));
}

function getLocale() {
  return currentLocale;
}

function initI18n() {
  document.documentElement.lang = currentLocale;
  window.dispatchEvent(new CustomEvent('i18n:ready', { detail: { locale: currentLocale } }));
}

export { initI18n, t, setLocale, getLocale, isReady };
