// ============================================
// Webowo v3.0 – Skeleton Component
// ============================================

class WebowoSkeleton extends HTMLElement {
  static get observedAttributes() { return ['width', 'height', 'variant', 'count']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const width = this.getAttribute('width') || '100%';
    const height = this.getAttribute('height') || '1rem';
    const variant = this.getAttribute('variant') || 'text';
    const count = parseInt(this.getAttribute('count'), 10) || 1;

    const variants = {
      text: { borderRadius: 'var(--radius-md)', height },
      circle: { borderRadius: '50%', width: height, height },
      rect: { borderRadius: 'var(--radius-lg)', height },
      card: { borderRadius: 'var(--radius-xl)', height: '200px' },
      avatar: { borderRadius: '50%', width: '48px', height: '48px' }
    };

    const style = variants[variant] || variants.text;

    this.shadowRoot.innerHTML = `
      <style>
        .skeleton {
          background: linear-gradient(
            90deg,
            var(--color-surface) 25%,
            var(--color-neutral-100) 50%,
            var(--color-surface) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        [data-theme="dark"] .skeleton,
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .skeleton {
            background: linear-gradient(
              90deg,
              var(--color-neutral-800) 25%,
              var(--color-neutral-700) 50%,
              var(--color-neutral-800) 75%
            );
            background-size: 200% 100%;
          }
        }
      </style>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        ${Array.from({ length: count }, () => `
          <div class="skeleton" style="
            width: ${style.width || width};
            height: ${style.height};
            border-radius: ${style.borderRadius};
          "></div>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('webowo-skeleton', WebowoSkeleton);
