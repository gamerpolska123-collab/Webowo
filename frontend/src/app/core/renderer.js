import { getState, setState } from './state.js';

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
const LEGACY_API = import.meta.env?.VITE_LEGACY_API_URL || '/api';

const DEFAULT_SECTIONS = [
  { type: 'hero', order_index: 1, data: '{"title":"Tworzę nowoczesne strony, które","subtitle":"Profesjonalne strony internetowe, sklepy online i aplikacje webowe.","badge":"Dostępny do nowych projektów","ctaPrimary":{"label":"Bezpłatna wycena","href":"#contact"},"ctaSecondary":{"label":"Zobacz realizacje","href":"#portfolio"}}', is_active: 1 },
  { type: 'about', order_index: 2, data: '{"title":"O mnie","text":"Jestem Patryk Matys — full-stack developer z pasją do tworzenia nowoczesnych stron internetowych.","stats":[{"label":"Zrealizowanych projektów","value":"50+"},{"label":"Zadowolonych klientów","value":"100%"},{"label":"Czas odpowiedzi","value":"24h"}]}', is_active: 1 },
  { type: 'services', order_index: 3, data: '{"title":"Usługi","items":[{"title":"Strony WWW","desc":"Nowoczesne strony wizytówki i landing page"},{"title":"Sklepy Online","desc":"E-commerce z płatnościami online"},{"title":"Aplikacje Webowe","desc":"Zaawansowane aplikacje SPA i PWA"},{"title":"Optymalizacja","desc":"SEO, performance, dostępność"}]}', is_active: 1 },
  { type: 'portfolio', order_index: 4, data: '{"title":"Portfolio","items":[]}', is_active: 1 },
  { type: 'process', order_index: 5, data: '{"title":"Proces współpracy","steps":[{"title":"Konsultacja","desc":"Omawiamy Twoje potrzeby i cele."},{"title":"Projekt","desc":"Tworzę mockupy i prototypy."},{"title":"Development","desc":"Kodowanie zgodnie z najlepszymi praktykami."},{"title":"Wdrożenie","desc":"Deploy, testy, szkolenie."}]}', is_active: 1 },
  { type: 'pricing', order_index: 6, data: '{"title":"Cennik","plans":[{"name":"Starter","price":"999","period":"PLN","features":["1 strona","Responsywność","Podstawowe SEO","Kontakt formularz"],"popular":false},{"name":"Professional","price":"2499","period":"PLN","features":["Do 5 podstron","CMS","Zaawansowane SEO","Analityka","Wsparcie 30 dni"],"popular":true},{"name":"Enterprise","price":"Custom","period":"","features":["Dedykowane rozwiązanie","Priorytetowe wsparcie","SLA","Dedykowany opiekun"],"popular":false}]}', is_active: 1 },
  { type: 'faq', order_index: 7, data: '{"title":"FAQ","items":[{"q":"Ile trwa realizacja strony?","a":"Standardowy projekt trwa 2-4 tygodnie."},{"q":"Czy strona będzie responsywna?","a":"Tak, wszystkie strony są w pełni responsywne."},{"q":"Czy oferujesz wsparcie po wdrożeniu?","a":"Tak, oferuję pakiety wsparcia technicznego."},{"q":"Jakie technologie używasz?","a":"Nowoczesny stack: HTML5, CSS3, JS, Node.js, SQLite."}]}', is_active: 1 },
  { type: 'contact', order_index: 8, data: '{"title":"Kontakt","email":"kontakt@matys.net.pl","phone":"+48 123 456 789","social":{"github":"https://github.com/gamerpolska123-collab","linkedin":"https://linkedin.com/in/patryk-matys"}}', is_active: 1 }
];

async function fetchWithTimeout(url, ms = 1500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return res;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

async function fetchContent(slug = 'home') {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/content/pages/${slug}`);
    if (res.ok) {
      const { data } = await res.json();
      console.log('[Renderer] Loaded from API v2');
      return data;
    }
  } catch (e) {
    console.warn('[Renderer] API v2 failed:', e.message);
  }

  try {
    const res = await fetchWithTimeout(`${LEGACY_API}/content`);
    if (res.ok) {
      const data = await res.json();
      console.log('[Renderer] Loaded from legacy API');
      return { sections: Object.entries(data).map(([type, data], i) => ({ type, order_index: i, data: JSON.stringify(data), is_active: 1 })) };
    }
  } catch (e) {
    console.warn('[Renderer] Legacy API failed:', e.message);
  }

  console.log('[Renderer] Using default sections (API unavailable)');
  return null;
}

function renderSection(container, section) {
  const tag = `webowo-section-${section.type}`;
  const el = document.createElement(tag);
  try {
    el.data = JSON.parse(section.data || '{}');
  } catch {
    el.data = {};
  }
  container.appendChild(el);
}

async function initRenderer() {
  const container = document.getElementById('sections-container');
  if (!container) {
    console.warn('[Renderer] sections-container not found');
    return;
  }
  const page = await fetchContent('home');
  const sections = page?.sections?.length ? page.sections : DEFAULT_SECTIONS;
  sections
    .filter(s => s.is_active)
    .sort((a, b) => a.order_index - b.order_index)
    .forEach(s => renderSection(container, s));
  console.log(`[Renderer] Rendered ${sections.length} sections (fallback: ${!page?.sections?.length})`);
}

export { initRenderer };
