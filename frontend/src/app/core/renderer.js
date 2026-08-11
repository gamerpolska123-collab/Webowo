// ============================================
// Webowo v3.1 – Page Renderer
// ============================================

const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
const RENDER_TIMEOUT = 3000;

const DEFAULT_SECTIONS = [
  { type: 'hero', order_index: 1, data: '{"title":"Tworzę nowoczesne strony, które","subtitle":"Profesjonalne strony internetowe, sklepy online i aplikacje webowe.","badge":"Dostępny do nowych projektów","ctaPrimary":{"label":"Bezpłatna wycena","href":"#contact"},"ctaSecondary":{"label":"Zobacz realizacje","href":"#portfolio"}}', is_active: 1 },
  { type: 'stats', order_index: 2, data: '{"items":[{"value":"50+","label":"Projektów"},{"value":"100%","label":"Zadowolenia"},{"value":"5+","label":"Lat doświadczenia"}]}', is_active: 1 },
  { type: 'about', order_index: 3, data: '{"title":"O mnie","text":"Jestem Patryk Matys — full-stack developer z pasją do tworzenia nowoczesnych stron internetowych. Specjalizuję się w projektowaniu i wdrażaniu rozwiązań webowych, które łączą estetykę z funkcjonalnością.","stats":[{"label":"Projektów","value":"50+"},{"label":"Zadowolenia","value":"100%"},{"label":"Lat doświadczenia","value":"5+"}]}', is_active: 1 },
  { type: 'services', order_index: 4, data: '{"title":"Usługi","subtitle":"Kompleksowe rozwiązania dla Twojego biznesu","items":[{"title":"Strony WWW","desc":"Nowoczesne strony wizytówki i landing page zoptymalizowane pod konwersję","icon":"globe"},{"title":"Sklepy Online","desc":"E-commerce z płatnościami online, zarządzaniem produktami i analizą sprzedaży","icon":"shopping-cart"},{"title":"Aplikacje Webowe","desc":"Zaawansowane SPA i PWA z real-time updates i offline support","icon":"zap"},{"title":"Optymalizacja","desc":"Audyt SEO, performance tuning, dostępność WCAG 2.1 AA","icon":"trending-up"}]}', is_active: 1 },
  { type: 'portfolio', order_index: 5, data: '{"title":"Portfolio","subtitle":"Wybrane realizacje","items":[{"title":"E-commerce Platform","category":"Sklep Online","image":"/uploads/portfolio-1.webp","link":"#"},{"title":"Corporate Website","category":"Strona WWW","image":"/uploads/portfolio-2.webp","link":"#"},{"title":"SaaS Dashboard","category":"Aplikacja Webowa","image":"/uploads/portfolio-3.webp","link":"#"},{"title":"Mobile App Landing","category":"Landing Page","image":"/uploads/portfolio-4.webp","link":"#"}]}', is_active: 1 },
  { type: 'process', order_index: 6, data: '{"title":"Proces współpracy","subtitle":"Od pomysłu do wdrożenia w 4 krokach","steps":[{"number":"01","title":"Konsultacja","desc":"Omawiamy Twoje potrzeby, cele biznesowe i oczekiwania. Przygotowuję wstępną wycenę i harmonogram."},{"number":"02","title":"Projekt","desc":"Tworzę mockupy, prototypy interaktywne i style guide. Iterujemy do pełnej akceptacji."},{"number":"03","title":"Development","desc":"Kodowanie zgodnie z najlepszymi praktykami. Code review, testy automatyczne, CI/CD."},{"number":"04","title":"Wdrożenie","desc":"Deploy na produkcję, monitoring, szkolenie z obsługi CMS i 30-dniowe wsparcie."}]}', is_active: 1 },
  { type: 'pricing', order_index: 7, data: '{"title":"Cennik","subtitle":"Przejrzyste pakiety dopasowane do potrzeb","plans":[{"name":"Starter","price":"999","period":"PLN","description":"Idealny dla małych firm i startupów","features":["1 strona landing page","Responsywność (mobile-first)","Podstawowe SEO","Formularz kontaktowy","Hosting 1 rok"],"popular":false},{"name":"Professional","price":"2 499","period":"PLN","description":"Najpopularniejszy wybór dla rozwijających się biznesów","features":["Do 5 podstron","Panel CMS (headless)","Zaawansowane SEO + Schema.org","Analityka Google Analytics 4","Wsparcie techniczne 30 dni","SSL + CDN"],"popular":true},{"name":"Enterprise","price":"Custom","period":"","description":"Dedykowane rozwiązania dla dużych organizacji","features":["Dedykowane rozwiązanie","API + Integracje","Priorytetowe wsparcie","SLA 99.9%","Dedykowany opiekun","Audyt bezpieczeństwa"],"popular":false}]}', is_active: 1 },
  { type: 'faq', order_index: 8, data: '{"title":"Często zadawane pytania","subtitle":"Masz wątpliwości? Sprawdź odpowiedzi","items":[{"q":"Ile trwa realizacja strony?","a":"Standardowy projekt trwa 2-4 tygodnie. Zależy to od złożoności, ilości podstron i dostępności materiałów. Projekt Enterprise może zająć 6-12 tygodni."},{"q":"Czy strona będzie responsywna?","a":"Tak, wszystkie strony są projektowane w podejściu mobile-first. Testuję na rzeczywistych urządzeniach: iPhone, Android, tablet, desktop."},{"q":"Czy oferujesz wsparcie po wdrożeniu?","a":"Tak, oferuję pakiety wsparcia technicznego: Basic (email, 48h), Professional (email+chat, 24h) i Enterprise (dedykowany opiekun, 4h SLA)."},{"q":"Jakie technologie używasz?","a":"Nowoczesny stack: React/Vue/Svelte, Node.js, PostgreSQL/MongoDB, Docker, AWS/Vercel. Frontend: Tailwind, TypeScript, Web Components."},{"q":"Czy mogę sam edytować treści?","a":"Tak, każdy projekt zawiera dedykowany panel CMS z edytorem WYSIWYG. Możesz edytować teksty, zdjęcia i sekcje bez znajomości kodu."},{"q":"Czy oferujesz hosting?","a":"Tak, oferuję hosting zarządzany na Vercel/Netlify/Cloudflare z automatycznymi backupami, CDN i certyfikatem SSL."}]}', is_active: 1 },
  { type: 'testimonials', order_index: 9, data: '{"title":"Opinie klientów","subtitle":"Co mówią o współpracy","items":[{"name":"Anna Kowalska","role":"CEO, TechStart","text":"Patryk stworzył dla nas stronę, która przekroczyła wszystkie oczekiwania. Profesjonalizm, terminowość i dbałość o szczegóły na najwyższym poziomie.","rating":5},{"name":"Marek Nowak","role":"Dyrektor Marketingu, BuildCorp","text":"Współpraca była bezproblemowa od pierwszego kontaktu. Strona działa szybko, wygląda świetnie i przynosi realne wyniki biznesowe.","rating":5},{"name":"Katarzyna Wiśniewska","role":"Właścicielka, ArtStudio","text":"Polecam z całego serca! Patryk nie tylko zaprojektował stronę, ale też doradził w kwestii SEO i optymalizacji.","rating":5}]}', is_active: 1 },
  { type: 'contact', order_index: 10, data: '{"title":"Skontaktuj się","subtitle":"Porozmawiajmy o Twoim projekcie","email":"kontakt@matys.net.pl","phone":"+48 123 456 789","address":"Polska, zdalnie","social":{"github":"https://github.com/gamerpolska123-collab","linkedin":"https://linkedin.com/in/patryk-matys","twitter":"https://twitter.com/patrykmatys"},"form":{"fields":[{"name":"name","label":"Imię i nazwisko","type":"text","required":true},{"name":"email","label":"Adres e-mail","type":"email","required":true},{"name":"subject","label":"Temat","type":"select","options":["Strona WWW","Sklep Online","Aplikacja Webowa","Inne"],"required":true},{"name":"budget","label":"Budżet","type":"select","options":["< 2 000 PLN","2 000 - 5 000 PLN","5 000 - 10 000 PLN","> 10 000 PLN"],"required":false},{"name":"message","label":"Wiadomość","type":"textarea","required":true,"rows":5}]}}', is_active: 1 },
  { type: 'footer', order_index: 11, data: '{"brand":"Matys WebDev","tagline":"Tworzę cyfrowe doświadczenia, które przynoszą rezultaty.","links":{"services":["Strony WWW","Sklepy Online","Aplikacje Webowe","Optymalizacja SEO"],"company":["O mnie","Portfolio","Proces","Cennik"],"legal":["Polityka prywatności","Regulamin","Kontakt"]},"copyright":"© 2026 Matys WebDev. Wszelkie prawa zastrzeżone."}}', is_active: 1 }
];

const SECTION_MAP = {
  hero: 'webowo-section-hero',
  stats: 'webowo-section-stats',
  about: 'webowo-section-about',
  services: 'webowo-section-services',
  portfolio: 'webowo-section-portfolio',
  process: 'webowo-section-process',
  pricing: 'webowo-section-pricing',
  testimonials: 'webowo-section-testimonials',
  faq: 'webowo-section-faq',
  contact: 'webowo-section-contact',
  footer: 'webowo-footer-section',
  cta: 'webowo-section-cta',
  'cookie-consent': 'webowo-cookie-consent'
};

export async function initRenderer() {
  const main = document.getElementById('main-content');
  if (!main) return;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RENDER_TIMEOUT);

    const res = await fetch(`${API_BASE}/content/pages/home`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = await res.json();
    renderPage(data, main);
  } catch (err) {
    console.warn('[Renderer] API failed, using defaults:', err.message);
    renderPage({ sections: DEFAULT_SECTIONS }, main);
  }
}

function renderPage(page, container) {
  container.innerHTML = '';

  const sections = page.sections || DEFAULT_SECTIONS;

  sections
    .filter(s => s.is_active !== 0)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .forEach(section => {
      const tagName = SECTION_MAP[section.type];
      if (!tagName) {
        console.warn(`[Renderer] Unknown section type: ${section.type}`);
        return;
      }

      const el = document.createElement(tagName);
      el.id = section.type;
      el.setAttribute('data-section', section.type);
      el.setAttribute('data-animate', '');

      // Parse data
      let data = section.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { data = {}; }
      }
      el.data = data;

      container.appendChild(el);
    });
}

export async function prefetchPage(slug) {
  // No-op for now - could implement caching
}
