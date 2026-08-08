// ============================================
// Webowo v3.0 – Portfolio Section
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionPortfolio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeFilter = 'all';
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  _bindEvents() {
    const filters = this.shadowRoot.querySelectorAll('.portfolio-filter');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this._activeFilter = filter;
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this._applyFilter(filter);
      });
    });
  }

  _applyFilter(filter) {
    const items = this.shadowRoot.querySelectorAll('.portfolio-item');
    items.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('portfolio_title') || 'Portfolio';
    const subtitle = data.subtitle || 'Wybrane realizacje';
    const items = data.items || [
      { title: 'E-commerce Platform', category: 'Sklep Online', image: '/uploads/portfolio-1.webp', link: '#', tags: ['React', 'Node.js', 'Stripe'] },
      { title: 'Corporate Website', category: 'Strona WWW', image: '/uploads/portfolio-2.webp', link: '#', tags: ['Next.js', 'Tailwind', 'CMS'] },
      { title: 'SaaS Dashboard', category: 'Aplikacja Webowa', image: '/uploads/portfolio-3.webp', link: '#', tags: ['Vue', 'Firebase', 'Charts'] },
      { title: 'Mobile App Landing', category: 'Landing Page', image: '/uploads/portfolio-4.webp', link: '#', tags: ['Astro', 'GSAP', 'PWA'] },
      { title: 'Real Estate Portal', category: 'Strona WWW', image: '/uploads/portfolio-5.webp', link: '#', tags: ['Next.js', 'Mapbox', 'Prisma'] },
      { title: 'Fitness Tracker', category: 'Aplikacja Webowa', image: '/uploads/portfolio-6.webp', link: '#', tags: ['React', 'D3.js', 'Supabase'] }
    ];

    const categories = ['all', ...new Set(items.map(i => i.category))];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .portfolio {
          padding: var(--space-24) var(--container-padding);
          position: relative;
        }
        .portfolio-inner {
          max-width: var(--container-max);
          margin: 0 auto;
        }
        .portfolio-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto var(--space-10);
        }
        .portfolio-label {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-primary-500);
          font-size: var(--text-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-4);
        }
        .portfolio-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .portfolio-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
        }
        .portfolio-subtitle {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.7;
        }
        .portfolio-filters {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
          flex-wrap: wrap;
          margin-bottom: var(--space-10);
        }
        .portfolio-filter {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-muted);
          font-family: var(--font-sans);
          font-size: var(--text-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .portfolio-filter:hover {
          border-color: var(--color-primary-300);
          color: var(--color-text);
        }
        .portfolio-filter.is-active {
          background: var(--color-primary-500);
          color: white;
          border-color: var(--color-primary-500);
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: var(--space-6);
        }
        .portfolio-item {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          transition: opacity 0.3s ease, transform 0.3s ease;
          cursor: pointer;
        }
        .portfolio-item-image {
          width: 100%;
          aspect-ratio: 16/10;
          background: linear-gradient(135deg, var(--color-primary-100), var(--color-accent-100));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          position: relative;
          overflow: hidden;
        }
        .portfolio-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .portfolio-item:hover .portfolio-item-image img {
          transform: scale(1.05);
        }
        .portfolio-item-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          opacity: 0;
          transition: opacity var(--transition-base);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: var(--space-6);
        }
        .portfolio-item:hover .portfolio-item-overlay {
          opacity: 1;
        }
        .portfolio-item-tags {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
          margin-bottom: var(--space-3);
        }
        .portfolio-item-tag {
          padding: var(--space-1) var(--space-2);
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 600;
          color: white;
        }
        .portfolio-item-title {
          font-size: var(--text-xl);
          font-weight: 700;
          color: white;
          margin: 0 0 var(--space-1);
        }
        .portfolio-item-category {
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.8);
        }
        .portfolio-item-link {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.9);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(-10px);
          transition: all var(--transition-base);
          text-decoration: none;
        }
        .portfolio-item:hover .portfolio-item-link {
          opacity: 1;
          transform: translateY(0);
        }
        .portfolio-item-link:hover {
          background: white;
          transform: scale(1.1);
        }
        .portfolio-item-info {
          padding: var(--space-5);
        }
        .portfolio-item-info-title {
          font-size: var(--text-lg);
          font-weight: 700;
          margin: 0 0 var(--space-1);
        }
        .portfolio-item-info-category {
          font-size: var(--text-sm);
          color: var(--color-muted);
        }
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr; }
        }
      </style>
      <section class="portfolio" id="portfolio">
        <div class="portfolio-inner">
          <div class="portfolio-header">
            <div class="portfolio-label">Portfolio</div>
            <h2 class="portfolio-title">${title}</h2>
            <p class="portfolio-subtitle">${subtitle}</p>
          </div>
          <div class="portfolio-filters">
            ${categories.map((cat, i) => `
              <button class="portfolio-filter ${i === 0 ? 'is-active' : ''}" data-filter="${cat}">
                ${cat === 'all' ? 'Wszystkie' : cat}
              </button>
            `).join('')}
          </div>
          <div class="portfolio-grid">
            ${items.map((item, i) => `
              <div class="portfolio-item" data-category="${item.category}" data-animate data-animate-delay="${(i % 4) + 1}">
                <div class="portfolio-item-image">
                  <span>🖼️</span>
                  <div class="portfolio-item-overlay">
                    <div class="portfolio-item-tags">
                      ${(item.tags || []).map(tag => `<span class="portfolio-item-tag">${tag}</span>`).join('')}
                    </div>
                    <h3 class="portfolio-item-title">${item.title}</h3>
                    <span class="portfolio-item-category">${item.category}</span>
                  </div>
                  <a href="${item.link}" class="portfolio-item-link" data-external aria-label="Zobacz projekt ${item.title}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
                  </a>
                </div>
                <div class="portfolio-item-info">
                  <h3 class="portfolio-item-info-title">${item.title}</h3>
                  <span class="portfolio-item-info-category">${item.category}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-portfolio', WebowoSectionPortfolio);
