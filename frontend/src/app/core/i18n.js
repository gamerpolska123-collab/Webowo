// ============================================
// Webowo v3.1 – Internationalization
// ============================================

let currentLocale = 'pl';
let translations = {};
let isLoaded = false;

async function loadTranslations(locale) {
  try {
    const res = await fetch(`/src/assets/i18n/${locale}.json`);
    if (!res.ok) throw new Error(`Failed to load ${locale}`);
    translations = await res.json();
    isLoaded = true;
  } catch (err) {
    console.warn(`[i18n] Could not load ${locale}, using defaults`);
    translations = {};
  }
}

export async function initI18n() {
  const saved = localStorage.getItem('webowo_locale');
  currentLocale = saved || navigator.language?.split('-')[0] || 'pl';
  if (!['pl', 'en'].includes(currentLocale)) currentLocale = 'pl';
  await loadTranslations(currentLocale);
}

export function t(key, fallback = '') {
  const keys = key.split('.');
  let value = translations;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback || key;
  }
  return value;
}

export function getLocale() {
  return currentLocale;
}

export async function setLocale(locale) {
  if (locale === currentLocale) return;
  currentLocale = locale;
  localStorage.setItem('webowo_locale', locale);
  await loadTranslations(locale);
  window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { locale } }));
}
