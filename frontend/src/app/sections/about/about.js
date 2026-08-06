// ============================================
// Section: About
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionAbout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || t('about_title');
    const text = data.text || t('about_text');
    const stats = data.stats || [
      { label: t('about_stat1_label'), value: t('about_stat1_value') },
      { label: t('about_stat2_label'), value: t('about_stat2_value') },
      { label: t('about_stat3_label'), value: t('about_stat3_value') }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; }
        .about { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        h2 { font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem; }
        p { color: var(--color-muted); font-size: 1.125rem; line-height: 1.7; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .stat { text-align: center; padding: 1.5rem; background: var(--color-surface); border-radius: 1rem; border: 1px solid var(--color-border); }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--color-primary); }
        .stat-label { font-size: 0.875rem; color: var(--color-muted); margin-top: 0.25rem; }
        @media (max-width: 768px) { .about { grid-template-columns: 1fr; } .stats { grid-template-columns: 1fr; } }
      </style>
      <section class="about" id="about">
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
          <div class="stats">
            ${stats.map(s => `<div class="stat"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join('')}
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;">
          <div style="width:300px;height:300px;background:linear-gradient(135deg,var(--color-primary),var(--color-accent));border-radius:1.5rem;opacity:0.1;"></div>
        </div>
      </section>
    `;
  }
}
customElements.define('webowo-section-about', WebowoSectionAbout);
