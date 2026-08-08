// ============================================
// Webowo v3.0 – Layout Footer
// ============================================

class WebowoLayoutFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .layout-footer {
          border-top: 1px solid var(--color-border);
          padding: var(--space-6) 0;
          background: var(--color-surface);
        }
        .layout-footer-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .copyright {
          font-size: var(--text-sm);
          color: var(--color-muted);
        }
        .footer-links {
          display: flex;
          gap: var(--space-6);
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links a {
          font-size: var(--text-sm);
          color: var(--color-muted);
          transition: color var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--color-primary-500);
        }
        @media (max-width: 768px) {
          .layout-footer-inner { flex-direction: column; text-align: center; }
          .footer-links { gap: var(--space-4); }
        }
      </style>
      <footer class="layout-footer">
        <div class="layout-footer-inner">
          <span class="copyright">© 2026 Matys WebDev</span>
          <ul class="footer-links">
            <li><a href="#privacy">Polityka prywatności</a></li>
            <li><a href="#terms">Regulamin</a></li>
            <li><a href="#contact">Kontakt</a></li>
          </ul>
        </div>
      </footer>
    `;
  }
}

customElements.define('webowo-layout-footer', WebowoLayoutFooter);
