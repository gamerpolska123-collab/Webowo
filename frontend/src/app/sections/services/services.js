// ============================================
// Section: Services
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionServices extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || t('services_title');
    const items = data.items || [
      { title: t('services_item1_title'), desc: t('services_item1_desc') },
      { title: t('services_item2_title'), desc: t('services_item2_desc') },
      { title: t('services_item3_title'), desc: t('services_item3_desc') },
      { title: t('services_item4_title'), desc: t('services_item4_desc') }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; background: var(--color-surface); }
        .services { max-width: 1200px; margin: 0 auto; }
        h2 { font-size: 2.5rem; font-weight: 800; text-align: center; margin: 0 0 3rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .card { background: var(--color-bg); padding: 2rem; border-radius: 1rem; border: 1px solid var(--color-border); transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .icon { width: 48px; height: 48px; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); border-radius: 0.75rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        h3 { margin: 0 0 0.5rem; font-size: 1.25rem; }
        p { margin: 0; color: var(--color-muted); }
      </style>
      <section class="services" id="services">
        <h2>${title}</h2>
        <div class="grid">
          ${items.map((item, i) => `
            <div class="card">
              <div class="icon">${['🌐','🛒','⚡','🚀'][i]}</div>
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}
customElements.define('webowo-section-services', WebowoSectionServices);
