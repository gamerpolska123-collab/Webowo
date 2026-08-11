// ============================================
// Webowo v3.1 – Services Section
// ============================================

class WebowoSectionServices extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Usługi';
    const subtitle = data.subtitle || 'Kompleksowe rozwiązania dla Twojego biznesu';
    const items = data.items || [
      { title: 'Strony WWW', desc: 'Nowoczesne strony wizytówki i landing page', icon: 'globe' },
      { title: 'Sklepy Online', desc: 'E-commerce z płatnościami online', icon: 'shopping-cart' },
      { title: 'Aplikacje Webowe', desc: 'Zaawansowane SPA i PWA', icon: 'zap' },
      { title: 'Optymalizacja', desc: 'Audyt SEO, performance tuning', icon: 'trending-up' }
    ];

    const icons = {
      globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      'shopping-cart': '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
      zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .services {
          padding: 6rem 0;
          background: #f8fafc;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
        }
        .header {
          text-align: center;
          margin-bottom: 4rem;
        }
        h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .subtitle {
          font-size: 1.125rem;
          color: #64748b;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2rem;
          transition: all 250ms ease;
          cursor: pointer;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          border-color: #005ce6;
        }
        .icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #005ce6 0%, #0047b3 100%);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          color: white;
        }
        .icon svg { width: 24px; height: 24px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        p {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.9375rem;
        }
      </style>
      <section class="services" id="services" data-section="services" data-animate>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="grid">
            ${items.map(item => `
              <div class="card">
                <div class="icon">
                  <svg viewBox="0 0 24 24">${icons[item.icon] || icons.globe}</svg>
                </div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-services', WebowoSectionServices);
