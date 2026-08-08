// ============================================
// Webowo v3.0 – Footer Section
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const brand = data.brand || 'Matys WebDev';
    const tagline = data.tagline || 'Tworzę cyfrowe doświadczenia, które przynoszą rezultaty.';
    const links = data.links || {
      services: ['Strony WWW', 'Sklepy Online', 'Aplikacje Webowe', 'Optymalizacja SEO'],
      company: ['O mnie', 'Portfolio', 'Proces', 'Cennik'],
      legal: ['Polityka prywatności', 'Regulamin', 'RODO']
    };
    const copyright = data.copyright || '© 2026 Matys WebDev. Wszelkie prawa zastrzeżone.';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .footer {
          background: var(--color-neutral-900);
          color: var(--color-neutral-300);
          position: relative;
          overflow: hidden;
        }
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-primary-500), transparent);
        }
        .footer-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: var(--space-16) var(--container-padding) var(--space-8);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--space-12);
          margin-bottom: var(--space-12);
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
        }
        .footer-brand-icon {
          width: 36px;
          height: 36px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 0.875rem;
        }
        .footer-brand-name {
          font-size: var(--text-xl);
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
        }
        .footer-brand-tagline {
          font-size: var(--text-base);
          color: var(--color-neutral-400);
          line-height: 1.7;
          max-width: 320px;
        }
        .footer-social {
          display: flex;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }
        .footer-social-link {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-xl);
          background: var(--color-neutral-800);
          color: var(--color-neutral-400);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .footer-social-link:hover {
          background: var(--color-primary-500);
          color: white;
          transform: translateY(-2px);
        }
        .footer-column-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 var(--space-4);
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .footer-links a {
          color: var(--color-neutral-400);
          font-size: var(--text-sm);
          text-decoration: none;
          transition: color var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }
        .footer-links a:hover {
          color: white;
        }
        .footer-links a::before {
          content: '';
          width: 0;
          height: 1px;
          background: var(--color-primary-500);
          transition: width var(--transition-fast);
        }
        .footer-links a:hover::before {
          width: 12px;
        }
        .footer-bottom {
          border-top: 1px solid var(--color-neutral-800);
          padding-top: var(--space-8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .footer-copyright {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
        }
        .footer-bottom-links {
          display: flex;
          gap: var(--space-6);
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-bottom-links a {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-bottom-links a:hover {
          color: white;
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: var(--space-8); }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      </style>
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="#hero" class="footer-brand-logo">
                <span class="footer-brand-icon">M</span>
                <span class="footer-brand-name">${brand}</span>
              </a>
              <p class="footer-brand-tagline">${tagline}</p>
              <div class="footer-social">
                <a href="https://github.com/gamerpolska123-collab" class="footer-social-link" target="_blank" rel="noopener" aria-label="GitHub" data-external>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com/in/patryk-matys" class="footer-social-link" target="_blank" rel="noopener" aria-label="LinkedIn" data-external>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 class="footer-column-title">Usługi</h4>
              <ul class="footer-links">
                ${(links.services || []).map(l => `<li><a href="#services">${l}</a></li>`).join('')}
              </ul>
            </div>
            <div>
              <h4 class="footer-column-title">Firma</h4>
              <ul class="footer-links">
                ${(links.company || []).map(l => `<li><a href="#${l.toLowerCase().replace(/\s+/g, '-')}">${l}</a></li>`).join('')}
              </ul>
            </div>
            <div>
              <h4 class="footer-column-title">Prawne</h4>
              <ul class="footer-links">
                ${(links.legal || []).map(l => `<li><a href="#${l.toLowerCase().replace(/\s+/g, '-')}">${l}</a></li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span class="footer-copyright">${copyright}</span>
            <ul class="footer-bottom-links">
              <li><a href="#privacy">Prywatność</a></li>
              <li><a href="#terms">Regulamin</a></li>
              <li><a href="#cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('webowo-section-footer', WebowoSectionFooter);
