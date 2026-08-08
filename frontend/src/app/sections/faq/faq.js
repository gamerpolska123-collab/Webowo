// ============================================
// Webowo v3.0 – FAQ Section
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionFaq extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  _bindEvents() {
    const search = this.shadowRoot.querySelector('.faq-search');
    if (!search) return;

    search.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const items = this.shadowRoot.querySelectorAll('.faq-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });

    // Accordion
    this.shadowRoot.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const isOpen = item.classList.contains('is-open');

        // Close all
        this.shadowRoot.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('is-open');
          i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('faq_title') || 'Często zadawane pytania';
    const subtitle = data.subtitle || 'Masz wątpliwości? Sprawdź odpowiedzi';
    const items = data.items || [
      { q: 'Ile trwa realizacja strony?', a: 'Standardowy projekt trwa 2-4 tygodnie. Zależy to od złożoności, ilości podstron i dostępności materiałów. Projekt Enterprise może zająć 6-12 tygodni.' },
      { q: 'Czy strona będzie responsywna?', a: 'Tak, wszystkie strony są projektowane w podejściu mobile-first. Testuję na rzeczywistych urządzeniach: iPhone, Android, tablet, desktop.' },
      { q: 'Czy oferujesz wsparcie po wdrożeniu?', a: 'Tak, oferuję pakiety wsparcia technicznego: Basic (email, 48h), Professional (email+chat, 24h) i Enterprise (dedykowany opiekun, 4h SLA).' },
      { q: 'Jakie technologie używasz?', a: 'Nowoczesny stack: React/Vue/Svelte, Node.js, PostgreSQL/MongoDB, Docker, AWS/Vercel. Frontend: Tailwind, TypeScript, Web Components.' },
      { q: 'Czy mogę sam edytować treści?', a: 'Tak, każdy projekt zawiera dedykowany panel CMS z edytorem WYSIWYG. Możesz edytować teksty, zdjęcia i sekcje bez znajomości kodu.' },
      { q: 'Czy oferujesz hosting?', a: 'Tak, oferuję hosting zarządzany na Vercel/Netlify/Cloudflare z automatycznymi backupami, CDN i certyfikatem SSL.' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .faq {
          padding: var(--space-24) var(--container-padding);
          background: var(--color-surface);
          position: relative;
        }
        .faq-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .faq-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto var(--space-10);
        }
        .faq-label {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-primary-500);
          font-size: var(--text-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-4);
        }
        .faq-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .faq-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
        }
        .faq-subtitle {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.7;
        }
        .faq-search-wrapper {
          position: relative;
          margin-bottom: var(--space-8);
        }
        .faq-search-icon {
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-muted);
          pointer-events: none;
        }
        .faq-search {
          width: 100%;
          padding: var(--space-4) var(--space-4) var(--space-4) var(--space-12);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-bg);
          color: var(--color-text);
          font-family: var(--font-sans);
          font-size: var(--text-base);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          outline: none;
        }
        .faq-search::placeholder {
          color: var(--color-neutral-400);
        }
        .faq-search:focus {
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px rgba(0, 92, 230, 0.1);
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .faq-item {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .faq-item:hover {
          border-color: var(--color-primary-200);
        }
        .faq-item.is-open {
          border-color: var(--color-primary-300);
          box-shadow: var(--shadow-md);
        }
        .faq-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--space-5) var(--space-6);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--color-text);
          transition: color var(--transition-fast);
        }
        .faq-trigger:hover {
          color: var(--color-primary-500);
        }
        .faq-trigger-icon {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          background: var(--color-surface);
          color: var(--color-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-base), background var(--transition-fast), color var(--transition-fast);
          margin-left: var(--space-4);
        }
        .faq-item.is-open .faq-trigger-icon {
          transform: rotate(180deg);
          background: var(--color-primary-500);
          color: white;
        }
        .faq-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--transition-slow);
        }
        .faq-item.is-open .faq-content {
          grid-template-rows: 1fr;
        }
        .faq-content-inner {
          overflow: hidden;
        }
        .faq-answer {
          padding: 0 var(--space-6) var(--space-6);
          color: var(--color-muted);
          font-size: var(--text-base);
          line-height: 1.7;
        }
      </style>
      <section class="faq" id="faq">
        <div class="faq-inner">
          <div class="faq-header">
            <div class="faq-label">FAQ</div>
            <h2 class="faq-title">${title}</h2>
            <p class="faq-subtitle">${subtitle}</p>
          </div>
          <div class="faq-search-wrapper">
            <span class="faq-search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input type="text" class="faq-search" placeholder="Wyszukaj pytanie..." aria-label="Wyszukaj pytanie">
          </div>
          <div class="faq-list">
            ${items.map((item, i) => `
              <div class="faq-item" data-animate data-animate-delay="${Math.min(i + 1, 6)}">
                <button class="faq-trigger" aria-expanded="false" aria-controls="faq-answer-${i}">
                  <span>${item.q}</span>
                  <span class="faq-trigger-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </button>
                <div class="faq-content" id="faq-answer-${i}">
                  <div class="faq-content-inner">
                    <p class="faq-answer">${item.a}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-faq', WebowoSectionFaq);
