// ============================================
// Webowo v3.1 – About Section
// ============================================

class WebowoSectionAbout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'O mnie';
    const text = data.text || 'Jestem Patryk Matys — full-stack developer z pasją do tworzenia nowoczesnych stron internetowych.';
    const stats = data.stats || [
      { label: 'Projektów', value: '50+' },
      { label: 'Zadowolenia', value: '100%' },
      { label: 'Lat doświadczenia', value: '5+' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .about {
          padding: 6rem 0;
          background: #ffffff;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        .text {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 2rem;
        }
        .stats {
          display: flex;
          gap: 2rem;
        }
        .stat {
          text-align: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #005ce6;
        }
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }
        .image-wrapper {
          position: relative;
        }
        .image-wrapper::before {
          content: '';
          position: absolute;
          inset: -1rem;
          background: linear-gradient(135deg, #005ce6 0%, #00d4aa 100%);
          border-radius: 1.5rem;
          opacity: 0.1;
          transform: rotate(-3deg);
        }
        .image {
          position: relative;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 1rem;
          aspect-ratio: 4/5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .image svg {
          width: 60%;
          height: 60%;
          opacity: 0.3;
        }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; gap: 2rem; }
          .stats { justify-content: center; }
        }
      </style>
      <section class="about" id="about" data-section="about" data-animate>
        <div class="container">
          <div class="grid">
            <div class="content">
              <h2>${title}</h2>
              <p class="text">${text}</p>
              <div class="stats">
                ${stats.map(s => `
                  <div class="stat">
                    <div class="stat-value">${s.value}</div>
                    <div class="stat-label">${s.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="image-wrapper">
              <div class="image">
                <svg viewBox="0 0 24 24" fill="none" stroke="#005ce6" stroke-width="1">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-about', WebowoSectionAbout);
