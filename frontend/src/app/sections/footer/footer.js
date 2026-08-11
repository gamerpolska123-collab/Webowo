// ============================================
// Webowo v3.1 – Footer Section
// ============================================

class WebowoFooterSection extends HTMLElement {
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
      legal: ['Polityka prywatności', 'Regulamin', 'Kontakt']
    };
    const copyright = data.copyright || '© 2026 Matys WebDev. Wszelkie prawa zastrzeżone.';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .footer {
          background: #0f172a;
          color: #94a3b8;
          padding: 4rem 0 2rem;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
        }
        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .brand {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .brand-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #005ce6, #0047b3);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1rem;
        }
        .tagline {
          font-size: 0.9375rem;
          line-height: 1.7;
          max-width: 300px;
        }
        h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          margin-bottom: 0.5rem;
        }
        a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9375rem;
          transition: color 150ms;
        }
        a:hover { color: white; }
        .bottom {
          border-top: 1px solid #1e293b;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .copyright {
          font-size: 0.875rem;
        }
        .admin-link {
          font-size: 0.875rem;
          color: #64748b;
        }
        .admin-link:hover { color: white; }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .bottom { flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .grid { grid-template-columns: 1fr; }
        }
      </style>
      <footer class="footer">
        <div class="container">
          <div class="grid">
            <div>
              <div class="brand">
                <div class="brand-icon">M</div>
                ${brand}
              </div>
              <p class="tagline">${tagline}</p>
            </div>
            <div>
              <h4>Usługi</h4>
              <ul>
                ${links.services.map(l => `<li><a href="#services">${l}</a></li>`).join('')}
              </ul>
            </div>
            <div>
              <h4>Firma</h4>
              <ul>
                ${links.company.map(l => `<li><a href="#${l.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}">${l}</a></li>`).join('')}
              </ul>
            </div>
            <div>
              <h4>Informacje</h4>
              <ul>
                ${links.legal.map(l => `<li><a href="#">${l}</a></li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="bottom">
            <div class="copyright">${copyright}</div>
            <a href="/admin.html" class="admin-link">Panel administracyjny</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('webowo-footer-section', WebowoFooterSection);
