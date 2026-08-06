// ============================================
// Section: Footer
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const brand = data.brand || t('footer_brand');
    const tagline = data.tagline || t('footer_tagline');
    const copyright = data.copyright || t('footer_copyright');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; background: var(--color-surface); border-top: 1px solid var(--color-border); }
        footer { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; text-align: center; }
        .brand { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
        .tagline { color: var(--color-muted); margin: 0.5rem 0 1.5rem; }
        .social { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
        .social a { width: 40px; height: 40px; border-radius: 50%; background: var(--color-bg); display: flex; align-items: center; justify-content: center; text-decoration: none; transition: background 0.2s; }
        .social a:hover { background: var(--color-primary); color: white; }
        .copy { color: var(--color-muted); font-size: 0.875rem; }
      </style>
      <footer>
        <div class="brand">${brand}</div>
        <div class="tagline">${tagline}</div>
        <div class="social">
          <a href="https://github.com/gamerpolska123-collab" target="_blank" aria-label="GitHub">GH</a>
          <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">LI</a>
        </div>
        <div class="copy">${copyright}</div>
      </footer>
    `;
  }
}
customElements.define('webowo-section-footer', WebowoSectionFooter);
