// ============================================
// Webowo v3.0 – Pricing Section
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionPricing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isYearly = false;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  _bindEvents() {
    const toggle = this.shadowRoot.querySelector('.pricing-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this._isYearly = !this._isYearly;
      toggle.classList.toggle('is-yearly', this._isYearly);
      this._updatePrices();
    });
  }

  _updatePrices() {
    const prices = this.shadowRoot.querySelectorAll('.pricing-price-value');
    prices.forEach(el => {
      const monthly = el.dataset.monthly;
      const yearly = el.dataset.yearly;
      if (monthly && yearly) {
        el.textContent = this._isYearly ? yearly : monthly;
      }
    });
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('pricing_title') || 'Cennik';
    const subtitle = data.subtitle || 'Przejrzyste pakiety dopasowane do potrzeb';
    const plans = data.plans || [
      { name: 'Starter', price: '999', period: 'PLN', description: 'Idealny dla małych firm i startupów', features: ['1 strona landing page', 'Responsywność (mobile-first)', 'Podstawowe SEO', 'Formularz kontaktowy', 'Hosting 1 rok'], popular: false },
      { name: 'Professional', price: '2 499', period: 'PLN', description: 'Najpopularniejszy wybór dla rozwijających się biznesów', features: ['Do 5 podstron', 'Panel CMS (headless)', 'Zaawansowane SEO + Schema.org', 'Analityka Google Analytics 4', 'Wsparcie techniczne 30 dni', 'SSL + CDN'], popular: true },
      { name: 'Enterprise', price: 'Custom', period: '', description: 'Dedykowane rozwiązania dla dużych organizacji', features: ['Dedykowane rozwiązanie', 'API + Integracje', 'Priorytetowe wsparcie', 'SLA 99.9%', 'Dedykowany opiekun', 'Audyt bezpieczeństwa'], popular: false }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .pricing {
          padding: var(--space-24) var(--container-padding);
          position: relative;
        }
        .pricing-inner {
          max-width: var(--container-max);
          margin: 0 auto;
        }
        .pricing-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto var(--space-10);
        }
        .pricing-label {
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
        .pricing-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .pricing-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
        }
        .pricing-subtitle {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.7;
        }
        .pricing-toggle-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-12);
        }
        .pricing-toggle-label {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-muted);
          transition: color var(--transition-fast);
        }
        .pricing-toggle-label.is-active {
          color: var(--color-text);
        }
        .pricing-toggle {
          width: 52px;
          height: 28px;
          border-radius: var(--radius-full);
          background: var(--color-border);
          border: none;
          cursor: pointer;
          position: relative;
          transition: background var(--transition-base);
        }
        .pricing-toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-base);
        }
        .pricing-toggle.is-yearly {
          background: var(--color-primary-500);
        }
        .pricing-toggle.is-yearly::after {
          transform: translateX(24px);
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
          align-items: start;
        }
        .pricing-card {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          position: relative;
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-primary-200);
        }
        .pricing-card.is-popular {
          border-color: var(--color-primary-300);
          box-shadow: var(--shadow-glow);
          transform: scale(1.03);
        }
        .pricing-card.is-popular:hover {
          transform: scale(1.03) translateY(-4px);
        }
        .pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: var(--space-1) var(--space-4);
          background: var(--gradient-primary);
          color: white;
          font-size: var(--text-xs);
          font-weight: 700;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pricing-card-name {
          font-size: var(--text-xl);
          font-weight: 800;
          margin: 0 0 var(--space-2);
          text-align: center;
        }
        .pricing-card-desc {
          font-size: var(--text-sm);
          color: var(--color-muted);
          text-align: center;
          margin: 0 0 var(--space-6);
          min-height: 40px;
        }
        .pricing-price {
          text-align: center;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .pricing-price-value {
          font-size: var(--text-5xl);
          font-weight: 900;
          color: var(--color-text);
          line-height: 1;
        }
        .pricing-price-period {
          font-size: var(--text-lg);
          color: var(--color-muted);
          font-weight: 500;
        }
        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .pricing-feature {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          font-size: var(--text-sm);
          color: var(--color-text);
        }
        .pricing-feature-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-success-bg);
          color: var(--color-success);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: 900;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .pricing-cta {
          display: block;
          width: 100%;
          margin-top: var(--space-8);
          padding: var(--space-4);
          border-radius: var(--radius-xl);
          font-family: var(--font-sans);
          font-size: var(--text-base);
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 2px solid transparent;
        }
        .pricing-cta-primary {
          background: var(--gradient-primary);
          color: white;
          box-shadow: 0 4px 14px rgba(0, 92, 230, 0.35);
        }
        .pricing-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 92, 230, 0.45);
        }
        .pricing-cta-secondary {
          background: transparent;
          color: var(--color-text);
          border-color: var(--color-border);
        }
        .pricing-cta-secondary:hover {
          border-color: var(--color-primary-500);
          color: var(--color-primary-500);
          background: var(--color-primary-50);
        }
        @media (max-width: 1024px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .pricing-card.is-popular { transform: none; }
          .pricing-card.is-popular:hover { transform: translateY(-4px); }
        }
      </style>
      <section class="pricing" id="pricing">
        <div class="pricing-inner">
          <div class="pricing-header">
            <div class="pricing-label">Cennik</div>
            <h2 class="pricing-title">${title}</h2>
            <p class="pricing-subtitle">${subtitle}</p>
          </div>
          <div class="pricing-toggle-wrapper">
            <span class="pricing-toggle-label is-active">Jednorazowo</span>
            <button class="pricing-toggle" aria-label="Przełącz rozliczenie roczne"></button>
            <span class="pricing-toggle-label">Rocznie <span style="color:var(--color-accent-500);font-size:0.75rem;">-20%</span></span>
          </div>
          <div class="pricing-grid">
            ${plans.map((plan, i) => `
              <div class="pricing-card ${plan.popular ? 'is-popular' : ''}" data-animate data-animate-delay="${i + 1}">
                ${plan.popular ? '<div class="pricing-badge">Najpopularniejszy</div>' : ''}
                <h3 class="pricing-card-name">${plan.name}</h3>
                <p class="pricing-card-desc">${plan.description}</p>
                <div class="pricing-price">
                  <span class="pricing-price-value" data-monthly="${plan.price}" data-yearly="${plan.price !== 'Custom' ? Math.round(parseInt(plan.price.replace(/\s/g, '')) * 0.8).toLocaleString('pl-PL') : 'Custom'}">${plan.price}</span>
                  ${plan.period ? `<span class="pricing-price-period"> ${plan.period}</span>` : ''}
                </div>
                <ul class="pricing-features">
                  ${plan.features.map(f => `
                    <li class="pricing-feature">
                      <span class="pricing-feature-icon">✓</span>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
                <a href="#contact" class="pricing-cta ${plan.popular ? 'pricing-cta-primary' : 'pricing-cta-secondary'}" data-track="pricing_${plan.name.toLowerCase()}">
                  ${plan.price === 'Custom' ? 'Skontaktuj się' : 'Wybieram ten pakiet'}
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-pricing', WebowoSectionPricing);
