// ============================================
// Section: Portfolio
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionPortfolio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._onI18nChange = () => this.render();
    window.addEventListener('i18n:changed', this._onI18nChange);
  }

  disconnectedCallback() {
    window.removeEventListener('i18n:changed', this._onI18nChange);
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('portfolio_title');
    const items = data.items || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; }
        .portfolio { max-width: 1200px; margin: 0 auto; }
        h2 { font-size: 2.5rem; font-weight: 800; text-align: center; margin: 0 0 3rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .item { position: relative; border-radius: 1rem; overflow: hidden; aspect-ratio: 16/10; background: var(--color-surface); border: 1px solid var(--color-border); }
        .item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s, opacity 0.4s; }
        .item:hover img { transform: scale(1.05); }
        .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 1.5rem; opacity: 0; transition: opacity 0.3s; }
        .item:hover .overlay { opacity: 1; }
        .overlay h3 { color: white; margin: 0; font-size: 1.25rem; }
        .overlay p { color: rgba(255,255,255,0.8); margin: 0.25rem 0 0; font-size: 0.875rem; }
        .empty { text-align: center; color: var(--color-muted); padding: 4rem; }

        /* Placeholder / blur-up effect */
        .img-wrap { position: relative; width: 100%; height: 100%; }
        .img-wrap .placeholder { position: absolute; inset: 0; filter: blur(20px); transform: scale(1.1); opacity: 1; transition: opacity 0.4s; }
        .img-wrap .placeholder.loaded { opacity: 0; }
        .img-wrap .main-img { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s; }
        .img-wrap .main-img.loaded { opacity: 1; }
      </style>
      <section class="portfolio" id="portfolio">
        <h2>${title}</h2>
        <div class="grid">
          ${items.length > 0 ? items.map(item => this.renderItem(item)).join('') : '<div class="empty">' + t('portfolio_empty') + '</div>'}
        </div>
      </section>
    `;

    // Inicjalizacja lazy loading + blur-up
    this.initLazyLoad();
  }

  renderItem(item) {
    const image = item.image || '';
    const title = item.title || '';
    const category = item.category || '';

    // Generuj srcset z wariantami Sharp jeśli dostępne
    let srcset = '';
    let sizes = '(max-width: 768px) 100vw, 33vw';

    if (item.variants && typeof item.variants === 'object') {
      const srcs = [];
      if (item.variants.thumbnail) srcs.push(`${item.variants.thumbnail} 300w`);
      if (item.variants.medium) srcs.push(`${item.variants.medium} 800w`);
      if (item.variants.large) srcs.push(`${item.variants.large} 1600w`);
      if (srcs.length) srcset = srcs.join(', ');
    }

    // Placeholder – użyj wariantu thumbnail jako LQIP (low quality image placeholder)
    // lub samego obrazka z klasą placeholder
    const placeholderSrc = item.variants?.thumbnail || image;

    return `
      <div class="item">
        <div class="img-wrap">
          <img class="placeholder" src="${placeholderSrc}" alt="" aria-hidden="true" loading="eager">
          <img class="main-img" 
               src="${image}" 
               ${srcset ? `srcset="${srcset}"` : ''} 
               ${srcset ? `sizes="${sizes}"` : ''}
               alt="${title}" 
               loading="lazy"
               data-src="${image}">
        </div>
        <div class="overlay">
          <div>
            <h3>${title}</h3>
            <p>${category}</p>
          </div>
        </div>
      </div>
    `;
  }

  initLazyLoad() {
    const mainImages = this.shadowRoot.querySelectorAll('.main-img[data-src]');
    if (!mainImages.length) return;

    // Jeśli natywny lazy loading jest wspierany, użyj zdarzenia load
    // W przeciwnym razie IntersectionObserver jako fallback
    const supportsLazy = 'loading' in HTMLImageElement.prototype;

    mainImages.forEach(img => {
      const placeholder = img.parentElement.querySelector('.placeholder');

      const onLoad = () => {
        img.classList.add('loaded');
        if (placeholder) placeholder.classList.add('loaded');
      };

      if (img.complete && img.naturalHeight !== 0) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', () => {
          // Przy błędzie ładowania pokaż placeholder
          if (placeholder) placeholder.style.opacity = '1';
        }, { once: true });
      }
    });

    // Fallback IntersectionObserver dla przeglądarek bez native lazy loading
    if (!supportsLazy) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      mainImages.forEach(img => observer.observe(img));
    }
  }
}
customElements.define('webowo-section-portfolio', WebowoSectionPortfolio);
