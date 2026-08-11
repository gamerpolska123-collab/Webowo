// ============================================
// Webowo v3.0 – Advanced Renderer
// Skeleton loading, error boundaries, prefetch, SSR hints
// ============================================

import { getState, setState, subscribe } from './state.js';

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
const LEGACY_API = import.meta.env?.VITE_LEGACY_API_URL || '/api';
const RENDER_TIMEOUT = 3000;

const DEFAULT_SECTIONS = [
  { type: 'hero', order_index: 1, data: '{"title":"Tworzę nowoczesne strony, które","subtitle":"Profesjonalne strony internetowe, sklepy online i aplikacje webowe.","badge":"Dostępny do nowych projektów","ctaPrimary":{"label":"Bezpłatna wycena","href":"#contact"},"ctaSecondary":{"label":"Zobacz realizacje","href":"#portfolio"}}', is_active: 1 },
  { type: 'about', order_index: 2, data: '{"title":"O mnie","text":"Jestem Patryk Matys — full-stack developer z pasją do tworzenia nowoczesnych stron internetowych. Specjalizuję się w projektowaniu i wdrażaniu rozwiązań webowych, które łączą estetykę z funkcjonalnością.","stats":[{"label":"Zrealizowanych projektów","value":"50+"},{"label":"Zadowolonych klientów","value":"100%"},{"label":"Czas odpowiedzi","value":"<24h"}]}', is_active: 1 },
  { type: 'services', order_index: 3, data: '{"title":"Usługi","subtitle":"Kompleksowe rozwiązania dla Twojego biznesu","items":[{"title":"Strony WWW","desc":"Nowoczesne strony wizytówki i landing page zoptymalizowane pod konwersję","icon":"globe"},{"title":"Sklepy Online","desc":"E-commerce z płatnościami online, zarządzaniem produktami i analizą sprzedaży","icon":"shopping-cart"},{"title":"Aplikacje Webowe","desc":"Zaawansowane SPA i PWA z real-time updates i offline support","icon":"zap"},{"title":"Optymalizacja","desc":"Audyt SEO, performance tuning, dostępność WCAG 2.1 AA","icon":"trending-up"}]}', is_active: 1 },
  { type: 'portfolio', order_index: 4, data: '{"title":"Portfolio","subtitle":"Wybrane realizacje","items":[{"title":"E-commerce Platform","category":"Sklep Online","image":"/uploads/portfolio-1.webp","link":"#"},{"title":"Corporate Website","category":"Strona WWW","image":"/uploads/portfolio-2.webp","link":"#"},{"title":"SaaS Dashboard","category":"Aplikacja Webowa","image":"/uploads/portfolio-3.webp","link":"#"},{"title":"Mobile App Landing","category":"Landing Page","image":"/uploads/portfolio-4.webp","link":"#"}]}', is_active: 1 },
  { type: 'process', order_index: 5, data: '{"title":"Proces współpracy","subtitle":"Od pomysłu do wdrożenia w 4 krokach","steps":[{"number":"01","title":"Konsultacja","desc":"Omawiamy Twoje potrzeby, cele biznesowe i oczekiwania. Przygotowuję wstępną wycenę i harmonogram."},{"number":"02","title":"Projekt","desc":"Tworzę mockupy, prototypy interaktywne i style guide. Iterujemy do pełnej akceptacji."},{"number":"03","title":"Development","desc":"Kodowanie zgodnie z najlepszymi praktykami. Code review, testy automatyczne, CI/CD."},{"number":"04","title":"Wdrożenie","desc":"Deploy na produkcję, monitoring, szkolenie z obsługi CMS i 30-dniowe wsparcie."}]}', is_active: 1 },
  { type: 'pricing', order_index: 6, data: '{"title":"Cennik","subtitle":"Przejrzyste pakiety dopasowane do potrzeb","plans":[{"name":"Starter","price":"999","period":"PLN","description":"Idealny dla małych firm i startupów","features":["1 strona landing page","Responsywność (mobile-first)","Podstawowe SEO","Formularz kontaktowy","Hosting 1 rok"],"popular":false},{"name":"Professional","price":"2 499","period":"PLN","description":"Najpopularniejszy wybór dla rozwijających się biznesów","features":["Do 5 podstron","Panel CMS (headless)","Zaawansowane SEO + Schema.org","Analityka Google Analytics 4","Wsparcie techniczne 30 dni","SSL + CDN"],"popular":true},{"name":"Enterprise","price":"Custom","period":"","description":"Dedykowane rozwiązania dla dużych organizacji","features":["Dedykowane rozwiązanie","API + Integracje","Priorytetowe wsparcie","SLA 99.9%","Dedykowany opiekun","Audyt bezpieczeństwa"],"popular":false}]}', is_active: 1 },
  { type: 'faq', order_index: 7, data: '{"title":"Często zadawane pytania","subtitle":"Masz wątpliwości? Sprawdź odpowiedzi","items":[{"q":"Ile trwa realizacja strony?","a":"Standardowy projekt trwa 2-4 tygodnie. Zależy to od złożoności, ilości podstron i dostępności materiałów. Projekt Enterprise może zająć 6-12 tygodni."},{"q":"Czy strona będzie responsywna?","a":"Tak, wszystkie strony są projektowane w podejściu mobile-first. Testuję na rzeczywistych urządzeniach: iPhone, Android, tablet, desktop."},{"q":"Czy oferujesz wsparcie po wdrożeniu?","a":"Tak, oferuję pakiety wsparcia technicznego: Basic (email, 48h), Professional (email+chat, 24h) i Enterprise (dedykowany opiekun, 4h SLA)."},{"q":"Jakie technologie używasz?","a":"Nowoczesny stack: React/Vue/Svelte, Node.js, PostgreSQL/MongoDB, Docker, AWS/Vercel. Frontend: Tailwind, TypeScript, Web Components."},{"q":"Czy mogę sam edytować treści?","a":"Tak, każdy projekt zawiera dedykowany panel CMS z edytorem WYSIWYG. Możesz edytować teksty, zdjęcia i sekcje bez znajomości kodu."},{"q":"Czy oferujesz hosting?","a":"Tak, oferuję hosting zarządzany na Vercel/Netlify/Cloudflare z automatycznymi backupami, CDN i certyfikatem SSL."}]}', is_active: 1 },
  { type: 'contact', order_index: 8, data: '{"title":"Skontaktuj się","subtitle":"Porozmawiajmy o Twoim projekcie","email":"kontakt@matys.net.pl","phone":"+48 123 456 789","address":"Polska, zdalnie","social":{"github":"https://github.com/gamerpolska123-collab","linkedin":"https://linkedin.com/in/patryk-matys","twitter":"https://twitter.com/patrykmatys"},"form":{"fields":[{"name":"name","label":"Imię i nazwisko","type":"text","required":true},{"name":"email","label":"Adres e-mail","type":"email","required":true},{"name":"subject","label":"Temat","type":"select","options":["Strona WWW","Sklep Online","Aplikacja Webowa","Inne"],"required":true},{"name":"budget","label":"Budżet","type":"select","options":["< 2 000 PLN","2 000 - 5 000 PLN","5 000 - 10 000 PLN","> 10 000 PLN"],"required":false},{"name":"message","label":"Wiadomość","type":"textarea","required":true,"rows":5}]}}', is_active: 1 },
  { type: 'footer', order_index: 9, data: '{"brand":"Matys WebDev","tagline":"Tworzę cyfrowe doświadczenia, które przynoszą rezultaty.","links":{"services":["Strony WWW","Sklepy Online","Aplikacje Webowe","Optymalizacja SEO"],"company":["O mnie","Portfolio","Proces","Cennik"],"legal":["Polityka prywatności","Regulamin","RODO"]},"copyright":"© 2026 Matys WebDev. Wszelkie prawa zastrzeżone."}}', is_active: 1 }
];

// Prefetch cache
const pageCache = new Map();

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
  // Check cache first
  if (pageCache.has(slug)) {
    console.log(`[Renderer] Cache hit for "${slug}"`);
    return pageCache.get(slug);
  }

  let result = null;

  // Try API v2
  try {
    const res = await fetchWithTimeout(`${API_BASE}/content/pages/${slug}`, 2000);
    if (res.ok) {
      const { data } = await res.json();
      console.log('[Renderer] Loaded from API v2');
      result = data;
    }
  } catch (e) {
    console.warn('[Renderer] API v2 failed:', e.message);
  }

  // Try legacy API
  if (!result) {
    try {
      const res = await fetchWithTimeout(`${LEGACY_API}/content`, 1500);
      if (res.ok) {
        const data = await res.json();
        console.log('[Renderer] Loaded from legacy API');
        result = { sections: Object.entries(data).map(([type, data], i) => ({ type, order_index: i, data: JSON.stringify(data), is_active: 1 })) };
      }
    } catch (e) {
      console.warn('[Renderer] Legacy API failed:', e.message);
    }
  }

  // Cache result
  if (result) {
    pageCache.set(slug, result);
  }

  return result;
}

function createSkeleton(type) {
  const div = document.createElement('div');
  div.className = 'skeleton-shimmer';
  div.style.cssText = 'width:100%;border-radius:var(--radius-xl);margin-bottom:var(--space-8);';

  const heights = {
    hero: '90vh',
    about: '500px',
    services: '600px',
    portfolio: '700px',
    process: '500px',
    pricing: '600px',
    faq: '500px',
    contact: '700px',
    footer: '300px'
  };

  div.style.height = heights[type] || '400px';
  return div;
}

function renderSection(container, section) {
  const tag = `webowo-section-${section.type}`;

  // Check if custom element is defined
  if (!customElements.get(tag)) {
    console.warn(`[Renderer] Custom element "${tag}" not defined, using skeleton`);
    container.appendChild(createSkeleton(section.type));
    return;
  }

  const el = document.createElement(tag);
  try {
    const raw = section.data;
    if (typeof raw === 'string') {
      el.data = JSON.parse(raw || '{}');
    } else if (raw && typeof raw === 'object') {
      el.data = raw;
    } else {
      el.data = {};
    }
  } catch {
    el.data = {};
  }
  el.setAttribute('data-section-type', section.type);
  container.appendChild(el);
}

async function initRenderer() {
  const container = document.getElementById('sections-container');
  if (!container) {
    console.warn('[Renderer] sections-container not found');
    return;
  }

  // Show skeletons immediately
  DEFAULT_SECTIONS.forEach(s => {
    container.appendChild(createSkeleton(s.type));
  });

  const page = await fetchContent('home');
  const sections = page?.sections || DEFAULT_SECTIONS;

  // Sort by order_index
  sections.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  // Clear skeletons
  container.innerHTML = '';

  // Render sections with stagger
  sections.forEach((section, i) => {
    if (!section.is_active) return;
    setTimeout(() => {
      renderSection(container, section);
    }, i * 80);
  });

  setState('page', { sections, loadedAt: Date.now() });
}

function prefetchPage(slug) {
  if (pageCache.has(slug)) return;
  fetchContent(slug).catch(() => {});
}

function invalidateCache(slug) {
  pageCache.delete(slug);
}

export { initRenderer, fetchContent, prefetchPage, invalidateCache };
