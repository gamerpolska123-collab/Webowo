// ============================================
// Layout Component: Navigation
// ============================================

import { t, setLocale, getLocale } from '../../core/i18n.js';

class WebowoNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-border); }
        nav { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; }
        .brand { font-weight: 800; font-size: 1.25rem; color: var(--color-primary); text-decoration: none; }
        .links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; align-items: center; }
        .links a { text-decoration: none; color: var(--color-text); font-weight: 500; transition: color 0.2s; }
        .links a:hover { color: var(--color-primary); }
        .mobile-toggle { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .lang-switcher { display: flex; gap: 0.5rem; margin-left: 1rem; }
        .lang-switcher button { background: none; border: 1px solid var(--color-border); border-radius: 0.375rem; padding: 0.35rem 0.75rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; color: var(--color-text); transition: all 0.2s; }
        .lang-switcher button:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .lang-switcher button.active-lang { background: var(--color-primary); color: white; border-color: var(--color-primary); }
        @media (max-width: 768px) {
          .links { display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--color-surface); flex-direction: column; padding: 1rem 2rem; border-bottom: 1px solid var(--color-border); align-items: flex-start; }
          .links.open { display: flex; }
          .mobile-toggle { display: block; }
          .lang-switcher { margin-left: 0; margin-top: 0.5rem; }
        }
      </style>
      <nav>
        <a class="brand" href="/">Webowo</a>
        <button class="mobile-toggle" aria-label="Menu">☰</button>
        <ul class="links">
          <li><a href="/#hero">${t('nav_home')}</a></li>
          <li><a href="/#about">${t('nav_about')}</a></li>
          <li><a href="/#services">${t('nav_services')}</a></li>
          <li><a href="/#portfolio">${t('nav_portfolio')}</a></li>
          <li><a href="/#contact">${t('nav_contact')}</a></li>
          <li class="lang-switcher">
            <button class="lang-btn" data-lang="pl">${t('nav_lang_pl')}</button>
            <button class="lang-btn" data-lang="en">${t('nav_lang_en')}</button>
          </li>
        </ul>
      </nav>
    `;

    const toggle = this.shadowRoot.querySelector('.mobile-toggle');
    const links = this.shadowRoot.querySelector('.links');
    toggle.addEventListener('click', () => links.classList.toggle('open'));

    // Language switcher
    const currentLocale = getLocale();
    this.shadowRoot.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === currentLocale) {
        btn.classList.add('active-lang');
      }
      btn.addEventListener('click', () => {
        const locale = btn.dataset.lang;
        setLocale(locale);
        this.shadowRoot.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active-lang'));
        btn.classList.add('active-lang');
      });
    });
  }
}
customElements.define('webowo-nav', WebowoNav);
