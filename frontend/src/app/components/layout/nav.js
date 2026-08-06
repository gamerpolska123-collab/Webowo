import { t, getLocale, setLocale } from '../../core/i18n.js';

class WebowoNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    window.addEventListener('i18n:changed', () => this.render());
  }

  render() {
    const isPl = getLocale() === 'pl';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: sticky; top: 0; z-index: 100; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
        nav { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
        .brand { font-size: 1.25rem; font-weight: 800; color: var(--color-primary); }
        .links { display: flex; gap: 2rem; align-items: center; }
        a { color: var(--color-text); text-decoration: none; font-weight: 500; font-size: 0.9375rem; transition: color 0.2s; }
        a:hover { color: var(--color-primary); }
        .lang { display: flex; gap: 0.5rem; }
        .lang button { background: none; border: 1px solid var(--color-border); border-radius: 0.25rem; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.875rem; color: var(--color-muted); }
        .lang button.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
        @media (max-width: 768px) { .links { display: none; } }
      </style>
      <nav>
        <div class="brand">Matys WebDev</div>
        <div class="links">
          <a href="#hero">${t('nav_home') || 'Strona główna'}</a>
          <a href="#about">${t('nav_about') || 'O mnie'}</a>
          <a href="#services">${t('nav_services') || 'Usługi'}</a>
          <a href="#portfolio">${t('nav_portfolio') || 'Portfolio'}</a>
          <a href="#contact">${t('nav_contact') || 'Kontakt'}</a>
          <div class="lang">
            <button class="${isPl ? 'active' : ''}" data-lang="pl">PL</button>
            <button class="${!isPl ? 'active' : ''}" data-lang="en">EN</button>
          </div>
        </div>
      </nav>
    `;
    this.shadowRoot.querySelectorAll('.lang button').forEach(btn => {
      btn.addEventListener('click', () => setLocale(btn.dataset.lang));
    });
  }
}

customElements.define('webowo-nav', WebowoNav);
