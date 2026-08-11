// ============================================
// Webowo v3.1 – Portfolio Section
// ============================================

class WebowoSectionPortfolio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Portfolio';
    const subtitle = data.subtitle || 'Wybrane realizacje';
    const items = data.items || [
      { title: 'E-commerce Platform', category: 'Sklep Online', image: '/uploads/portfolio-1.webp', link: '#' },
      { title: 'Corporate Website', category: 'Strona WWW', image: '/uploads/portfolio-2.webp', link: '#' },
      { title: 'SaaS Dashboard', category: 'Aplikacja Webowa', image: '/uploads/portfolio-3.webp', link: '#' },
      { title: 'Mobile App Landing', category: 'Landing Page', image: '/uploads/portfolio-4.webp', link: '#' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .portfolio {
          padding: 6rem 0;
          background: #ffffff;
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .card {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          aspect-ratio: 4/3;
          cursor: pointer;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 500ms ease;
        }
        .card:hover img { transform: scale(1.05); }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .card:hover .overlay { opacity: 1; }
        .category {
          font-size: 0.75rem;
          font-weight: 600;
          color: #00d4aa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }
        .placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 0.875rem;
        }
      </style>
      <section class="portfolio" id="portfolio" data-section="portfolio" data-animate>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="grid">
            ${items.map(item => `
              <a href="${item.link}" class="card">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                <div class="placeholder" style="display:${item.image ? 'none' : 'flex'}">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
                <div class="overlay">
                  <div class="category">${item.category}</div>
                  <div class="card-title">${item.title}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-portfolio', WebowoSectionPortfolio);
