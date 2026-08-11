// ============================================
// Webowo v3.0 – About Section
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionAbout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onI18nChange = () => this.render();
  }

  connectedCallback() {
    this.render();
    window.addEventListener('i18n:changed', this._onI18nChange);
  }

  disconnectedCallback() {
    window.removeEventListener('i18n:changed', this._onI18nChange);
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('about_title') || 'O mnie';
    const text = data.text || t('about_text') || 'Jestem Patryk Matys — full-stack developer z pasją do tworzenia nowoczesnych stron internetowych.';
    const stats = data.stats || [
      { label: t('about_stat1_label') || 'Projektów', value: '50+' },
      { label: t('about_stat2_label') || 'Zadowolonych klientów', value: '100%' },
      { label: t('about_stat3_label') || 'Czas odpowiedzi', value: '<24h' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .about {
          padding: var(--space-24) var(--container-padding);
          position: relative;
          overflow: hidden;
        }
        .about-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: center;
        }
        .about-visual {
          position: relative;
        }
        .about-image-wrapper {
          position: relative;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--gradient-primary);
          padding: 4px;
        }
        .about-image {
          width: 100%;
          aspect-ratio: 1;
          border-radius: calc(var(--radius-2xl) - 4px);
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 6rem;
          position: relative;
          overflow: hidden;
        }
        .about-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--color-primary-100), var(--color-accent-100));
          opacity: 0.3;
        }
        .about-image span {
          position: relative;
          z-index: 1;
        }
        .about-image-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: var(--color-bg);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-4) var(--space-6);
          box-shadow: var(--shadow-xl);
          z-index: 2;
        }
        .about-image-badge-value {
          font-size: var(--text-2xl);
          font-weight: 900;
          color: var(--color-primary-500);
          line-height: 1;
        }
        .about-image-badge-label {
          font-size: var(--text-xs);
          color: var(--color-muted);
          font-weight: 500;
        }
        .about-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .about-label {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-primary-500);
          font-size: var(--text-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .about-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .about-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0;
        }
        .about-text {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.8;
          margin: 0;
        }
        .about-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }
        .about-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-base);
          color: var(--color-text);
        }
        .about-feature-icon {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-md);
          background: var(--color-primary-50);
          color: var(--color-primary-500);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          margin-top: var(--space-4);
          padding-top: var(--space-6);
          border-top: 1px solid var(--color-border);
        }
        .about-stat {
          text-align: center;
        }
        .about-stat-value {
          font-size: var(--text-3xl);
          font-weight: 900;
          color: var(--color-primary-500);
          line-height: 1;
        }
        .about-stat-label {
          font-size: var(--text-sm);
          color: var(--color-muted);
          margin-top: var(--space-1);
        }
        @media (max-width: 1024px) {
          .about-inner { grid-template-columns: 1fr; gap: var(--space-10); }
          .about-visual { order: -1; max-width: 400px; margin: 0 auto; }
        }
        @media (max-width: 768px) {
          .about-stats { grid-template-columns: 1fr; }
        }
      </style>
      <section class="about" id="about">
        <div class="about-inner">
          <div class="about-visual">
            <div class="about-image-wrapper">
              <div class="about-image">
                <span>👨‍💻</span>
              </div>
              <div class="about-image-badge">
                <div class="about-image-badge-value">5+</div>
                <div class="about-image-badge-label">Lat doświadczenia</div>
              </div>
            </div>
          </div>
          <div class="about-content">
            <div class="about-label">O mnie</div>
            <h2 class="about-title">${title}</h2>
            <p class="about-text">${text}</p>
            <div class="about-features">
              <div class="about-feature">
                <div class="about-feature-icon">✓</div>
                <span>Nowoczesne technologie i najlepsze praktyki</span>
              </div>
              <div class="about-feature">
                <div class="about-feature-icon">✓</div>
                <span>Responsywny design mobile-first</span>
              </div>
              <div class="about-feature">
                <div class="about-feature-icon">✓</div>
                <span>Optymalizacja SEO i wydajności</span>
              </div>
              <div class="about-feature">
                <div class="about-feature-icon">✓</div>
                <span>Wsparcie techniczne po wdrożeniu</span>
              </div>
            </div>
            <div class="about-stats">
              ${stats.map(s => `
                <div class="about-stat">
                  <div class="about-stat-value">${s.value}</div>
                  <div class="about-stat-label">${s.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-about', WebowoSectionAbout);
