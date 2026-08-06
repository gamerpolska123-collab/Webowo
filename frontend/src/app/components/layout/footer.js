// ============================================
// Layout Component: Footer
// ============================================

class WebowoLayoutFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; background: var(--color-surface); border-top: 1px solid var(--color-border); margin-top: 4rem; }
        footer { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
        .col h4 { margin: 0 0 1rem; font-size: 1rem; }
        .col a { display: block; color: var(--color-muted); text-decoration: none; margin-bottom: 0.5rem; transition: color 0.2s; }
        .col a:hover { color: var(--color-primary); }
        .bottom { grid-column: 1 / -1; text-align: center; padding-top: 2rem; border-top: 1px solid var(--color-border); color: var(--color-muted); font-size: 0.875rem; }
      </style>
      <footer>
        <div class="col">
          <h4>Webowo</h4>
          <p style="color:var(--color-muted);margin:0;">Tworzymy nowoczesne strony internetowe.</p>
        </div>
        <div class="col">
          <h4>Nawigacja</h4>
          <a href="/#hero">Strona główna</a>
          <a href="/#about">O mnie</a>
          <a href="/#services">Usługi</a>
          <a href="/#contact">Kontakt</a>
        </div>
        <div class="col">
          <h4>Social</h4>
          <a href="https://github.com/gamerpolska123-collab" target="_blank">GitHub</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
        </div>
        <div class="bottom">
          <slot></slot>
        </div>
      </footer>
    `;
  }
}
customElements.define('webowo-layout-footer', WebowoLayoutFooter);
