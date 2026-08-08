// ============================================
// Webowo v3.0 – Section Wrapper
// ============================================

class WebowoSectionWrapper extends HTMLElement {
  static get observedAttributes() { return ['variant', 'id']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const id = this.getAttribute('id') || '';

    const variants = {
      default: 'background: var(--color-bg);',
      surface: 'background: var(--color-surface);',
      gradient: 'background: var(--gradient-hero);',
      mesh: 'background: var(--gradient-mesh);'
    };

    this.shadowRoot.innerHTML = `
      <style>
        .section-wrapper {
          ${variants[variant] || variants.default}
          position: relative;
          overflow: hidden;
        }
      </style>
      <section class="section-wrapper" ${id ? `id="${id}"` : ''}>
        <slot></slot>
      </section>
    `;
  }
}

customElements.define('webowo-section-wrapper', WebowoSectionWrapper);
