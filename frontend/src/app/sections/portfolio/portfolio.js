// ============================================
// Section: Portfolio
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionPortfolio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || t('portfolio_title');
    const items = data.items || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; }
        .portfolio { max-width: 1200px; margin: 0 auto; }
        h2 { font-size: 2.5rem; font-weight: 800; text-align: center; margin: 0 0 3rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .item { position: relative; border-radius: 1rem; overflow: hidden; aspect-ratio: 16/10; background: var(--color-surface); border: 1px solid var(--color-border); }
        .item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .item:hover img { transform: scale(1.05); }
        .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 1.5rem; opacity: 0; transition: opacity 0.3s; }
        .item:hover .overlay { opacity: 1; }
        .overlay h3 { color: white; margin: 0; font-size: 1.25rem; }
        .overlay p { color: rgba(255,255,255,0.8); margin: 0.25rem 0 0; font-size: 0.875rem; }
        .empty { text-align: center; color: var(--color-muted); padding: 4rem; }
      </style>
      <section class="portfolio" id="portfolio">
        <h2>${title}</h2>
        <div class="grid">
          ${items.length > 0 ? items.map(item => `
            <div class="item">
              <img src="${item.image}" alt="${item.title}" loading="lazy">
              <div class="overlay">
                <div>
                  <h3>${item.title}</h3>
                  <p>${item.category}</p>
                </div>
              </div>
            </div>
          `).join('') : '<div class="empty">' + t('portfolio_empty') + '</div>'}
        </div>
      </section>
    `;
  }
}
customElements.define('webowo-section-portfolio', WebowoSectionPortfolio);
