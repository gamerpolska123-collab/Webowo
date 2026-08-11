// ============================================
// Webowo v3.1 – Skeleton Loader
// ============================================

class WebowoSkeleton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const width = this.getAttribute('width') || '100%';
    const height = this.getAttribute('height') || '1rem';
    const circle = this.hasAttribute('circle');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: ${circle ? '50%' : '0.5rem'};
          width: ${width};
          height: ${height};
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      </style>
      <div class="skeleton"></div>
    `;
  }
}

customElements.define('webowo-skeleton', WebowoSkeleton);
