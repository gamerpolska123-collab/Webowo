// ============================================
// Webowo v3.0 – Card Component
// ============================================

class WebowoCard extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'hover', 'padding'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const hover = this.hasAttribute('hover');
    const padding = this.getAttribute('padding') || 'lg';

    const paddings = { sm: '1rem', md: '1.5rem', lg: '2rem', xl: '2.5rem' };

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: ${paddings[padding] || paddings.lg};
          transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-primary-200);
        }
        .card-elevated {
          box-shadow: var(--shadow-lg);
          border-color: transparent;
        }
        .card-ghost {
          background: transparent;
          border-color: transparent;
        }
        .card-glass {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          border-color: rgba(255, 255, 255, 0.3);
        }
        [data-theme="dark"] .card-glass,
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .card-glass {
            background: rgba(15, 23, 42, 0.6);
            border-color: rgba(255, 255, 255, 0.08);
          }
        }
      </style>
      <div class="card card-${variant} ${hover ? 'card-hover' : ''}">
        <slot name="image"></slot>
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

customElements.define('webowo-card', WebowoCard);
