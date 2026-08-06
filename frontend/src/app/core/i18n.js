// ============================================
// i18n System – Fetch with Fallback
// ============================================

const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE || 'pl';
const SUPPORTED_LOCALES = ['pl', 'en'];

let currentLocale = DEFAULT_LOCALE;
let translations = {};
let isReady = false;

async function loadLocale(locale) {
  try {
    const res = await fetch(`/i18n/${locale}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    translations = data;
    currentLocale = locale;
    isReady = true;
    console.log(`[i18n] Loaded: ${locale}`);
  } catch (err) {
    console.warn(`[i18n] Failed to load ${locale}: ${err.message}`);
    // Fallback to default (TODO #3)
    if (locale !== DEFAULT_LOCALE) {
      console.log(`[i18n] Falling back to ${DEFAULT_LOCALE}`);
      await loadLocale(DEFAULT_LOCALE);
    } else {
      // Ultimate fallback — inline Polish
      translations = {
        nav_home: 'Strona główna',
        nav_about: 'O mnie',
        nav_services: 'Usługi',
        nav_portfolio: 'Portfolio',
        nav_contact: 'Kontakt',
        hero_title: 'Tworzę nowoczesne strony, które',
        hero_subtitle: 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.',
        contact_name: 'Imię i nazwisko',
        contact_email: 'Email',
        contact_message: 'Wiadomość',
        contact_send: 'Wyślij wiadomość',
        footer_copyright: 'Wszelkie prawa zastrzeżone.'
      };
      isReady = true;
    }
  }
}

function t(key, fallback = '') {
  return translations[key] || fallback || key;
}

function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  loadLocale(locale);
  document.documentElement.lang = locale;
}

function getLocale() {
  return currentLocale;
}

async function initI18n() {
  const saved = localStorage.getItem('webowo_locale');
  const browser = navigator.language.split('-')[0];
  const locale = saved || (SUPPORTED_LOCALES.includes(browser) ? browser : DEFAULT_LOCALE);
  await loadLocale(locale);
  document.documentElement.lang = currentLocale;
}

export { initI18n, t, setLocale, getLocale, isReady };
