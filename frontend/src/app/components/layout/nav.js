// ============================================
// Layout Component: Navigation
// ============================================

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
        .links { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
        .links a { text-decoration: none; color: var(--color-text); font-weight: 500; transition: color 0.2s; }
        .links a:hover { color: var(--color-primary); }
        .mobile-toggle { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        @media (max-width: 768px) {
          .links { display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--color-surface); flex-direction: column; padding: 1rem 2rem; border-bottom: 1px solid var(--color-border); }
          .links.open { display: flex; }
          .mobile-toggle { display: block; }
        }
      </style>
      <nav>
        <a class="brand" href="/">Webowo</a>
        <button class="mobile-toggle" aria-label="Menu">☰</button>
        <ul class="links">
          <li><a href="/#hero">Strona główna</a></li>
          <li><a href="/#about">O mnie</a></li>
          <li><a href="/#services">Usługi</a></li>
          <li><a href="/#portfolio">Portfolio</a></li>
          <li><a href="/#contact">Kontakt</a></li>
        </ul>
      </nav>
    `;

    const toggle = this.shadowRoot.querySelector('.mobile-toggle');
    const links = this.shadowRoot.querySelector('.links');
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}
customElements.define('webowo-nav', WebowoNav);
