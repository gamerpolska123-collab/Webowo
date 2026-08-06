// ============================================
// Section: Pricing
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionPricing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._onI18nChange = () => this.render();
    window.addEventListener('i18n:changed', this._onI18nChange);
  }

  disconnectedCallback() {
    window.removeEventListener('i18n:changed', this._onI18nChange);
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('pricing_title');
    const plans = data.plans || [
      { name: t('pricing_plan1_name'), price: '999', period: 'PLN', features: [t('pricing_plan1_feature1'), t('pricing_plan1_feature2'), t('pricing_plan1_feature3'), t('pricing_plan1_feature4')], popular: false },
      { name: t('pricing_plan2_name'), price: '2499', period: 'PLN', features: [t('pricing_plan2_feature1'), t('pricing_plan2_feature2'), t('pricing_plan2_feature3'), t('pricing_plan2_feature4'), t('pricing_plan2_feature5')], popular: true },
      { name: t('pricing_plan3_name'), price: 'Custom', period: '', features: [t('pricing_plan3_feature1'), t('pricing_plan3_feature2'), t('pricing_plan3_feature3'), t('pricing_plan3_feature4')], popular: false }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; }
        .pricing { max-width: 1200px; margin: 0 auto; }
        h2 { font-size: 2.5rem; font-weight: 800; text-align: center; margin: 0 0 3rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: start; }
        .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 1rem; padding: 2rem; position: relative; transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .card.popular { border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-primary); }
        .badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: white; padding: 0.25rem 1rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
        .name { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
        .price { font-size: 3rem; font-weight: 800; color: var(--color-primary); margin: 0; }
        .price span { font-size: 1rem; color: var(--color-muted); font-weight: 400; }
        ul { list-style: none; padding: 0; margin: 1.5rem 0; }
        li { padding: 0.5rem 0; color: var(--color-muted); display: flex; align-items: center; gap: 0.5rem; }
        li::before { content: '✓'; color: var(--color-accent); font-weight: 700; }
        .cta { display: block; width: 100%; text-align: center; padding: 1rem; background: var(--color-primary); color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: opacity 0.2s; }
        .cta:hover { opacity: 0.9; }
      </style>
      <section class="pricing" id="pricing">
        <h2>${title}</h2>
        <div class="grid">
          ${plans.map(plan => `
            <div class="card ${plan.popular ? 'popular' : ''}">
              ${plan.popular ? `<div class="badge">${t('pricing_badge_popular')}</div>` : ''}
              <div class="name">${plan.name}</div>
              <div class="price">${plan.price} <span>${plan.period}</span></div>
              <ul>
                ${plan.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
              <a class="cta" href="#contact">${t('pricing_cta')}</a>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}
customElements.define('webowo-section-pricing', WebowoSectionPricing);
