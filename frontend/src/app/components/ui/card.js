// ============================================
// Webowo v3.1 – Card Component
// ============================================

class WebowoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const padding = this.getAttribute('padding') || 'lg';
    const hover = this.hasAttribute('hover');

    const paddingMap = { sm: '1rem', md: '1.5rem', lg: '2rem', xl: '2.5rem' };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: ${paddingMap[padding] || paddingMap.lg};
          transition: all 250ms ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          border-color: #005ce6;
        }
      </style>
      <div class="card ${hover ? 'card-hover' : ''}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('webowo-card', WebowoCard);
