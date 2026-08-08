// ============================================
// Webowo v3.0 – Services Section
// ============================================

import { t } from '../../core/i18n.js';

const ICONS = {
  globe: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  'shopping-cart': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  zap: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  'trending-up': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  code: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  smartphone: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  shield: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
  palette: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>`
};

class WebowoSectionServices extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('services_title') || 'Usługi';
    const subtitle = data.subtitle || 'Kompleksowe rozwiązania dla Twojego biznesu';
    const items = data.items || [
      { title: 'Strony WWW', desc: 'Nowoczesne strony wizytówki i landing page zoptymalizowane pod konwersję', icon: 'globe' },
      { title: 'Sklepy Online', desc: 'E-commerce z płatnościami online, zarządzaniem produktami i analizą sprzedaży', icon: 'shopping-cart' },
      { title: 'Aplikacje Webowe', desc: 'Zaawansowane SPA i PWA z real-time updates i offline support', icon: 'zap' },
      { title: 'Optymalizacja', desc: 'Audyt SEO, performance tuning, dostępność WCAG 2.1 AA', icon: 'trending-up' },
      { title: 'API & Integracje', desc: 'RESTful API, GraphQL, webhooks i integracje z zewnętrznymi systemami', icon: 'code' },
      { title: 'PWA & Mobile', desc: 'Progressive Web Apps działające jak natywne aplikacje mobilne', icon: 'smartphone' },
      { title: 'Bezpieczeństwo', desc: 'Audyt bezpieczeństwa, GDPR compliance, szyfrowanie i monitoring', icon: 'shield' },
      { title: 'UI/UX Design', desc: 'Projektowanie interfejsów z naciskiem na UX research i accessibility', icon: 'palette' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .services {
          padding: var(--space-24) var(--container-padding);
          background: var(--color-surface);
          position: relative;
        }
        .services-inner {
          max-width: var(--container-max);
          margin: 0 auto;
        }
        .services-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto var(--space-12);
        }
        .services-label {
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
        .services-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .services-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
        }
        .services-subtitle {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.7;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-6);
        }
        .service-card {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-8) var(--space-6);
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition-slow);
        }
        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-primary-200);
        }
        .service-card:hover::before {
          transform: scaleX(1);
        }
        .service-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--color-primary-50), var(--color-accent-50));
          color: var(--color-primary-500);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-5);
          transition: transform var(--transition-bounce);
        }
        .service-card:hover .service-icon {
          transform: scale(1.1) rotate(-5deg);
        }
        .service-title {
          font-size: var(--text-xl);
          font-weight: 700;
          margin: 0 0 var(--space-2);
          color: var(--color-text);
        }
        .service-desc {
          font-size: var(--text-base);
          color: var(--color-muted);
          line-height: 1.7;
          margin: 0;
        }
        .service-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          margin-top: var(--space-4);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-primary-500);
          text-decoration: none;
          transition: gap var(--transition-fast);
        }
        .service-link:hover {
          gap: var(--space-2);
        }
      </style>
      <section class="services" id="services">
        <div class="services-inner">
          <div class="services-header">
            <div class="services-label">Usługi</div>
            <h2 class="services-title">${title}</h2>
            <p class="services-subtitle">${subtitle}</p>
          </div>
          <div class="services-grid">
            ${items.map(item => `
              <div class="service-card" data-animate data-animate-delay="${Math.floor(Math.random() * 5) + 1}">
                <div class="service-icon">
                  ${ICONS[item.icon] || ICONS.globe}
                </div>
                <h3 class="service-title">${item.title}</h3>
                <p class="service-desc">${item.desc}</p>
                <a href="#contact" class="service-link" data-track="services_${item.title.toLowerCase().replace(/\s+/g, '_')}">
                  Dowiedz się więcej
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-services', WebowoSectionServices);
