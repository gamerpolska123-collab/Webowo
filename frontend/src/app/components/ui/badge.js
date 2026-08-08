// ============================================
// Webowo v3.0 – Badge Component
// ============================================

class WebowoBadge extends HTMLElement {
  static get observedAttributes() { return ['variant', 'size', 'pulse']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'md';
    const pulse = this.hasAttribute('pulse');

    const variants = {
      default: 'background: var(--color-surface); color: var(--color-muted); border-color: var(--color-border);',
      primary: 'background: var(--color-primary-50); color: var(--color-primary-600); border-color: var(--color-primary-200);',
      accent: 'background: var(--color-accent-50); color: var(--color-accent-600); border-color: var(--color-accent-200);',
      success: 'background: var(--color-success-bg); color: var(--color-success); border-color: rgba(34, 197, 94, 0.2);',
      warning: 'background: var(--color-warning-bg); color: var(--color-warning); border-color: rgba(245, 158, 11, 0.2);',
      error: 'background: var(--color-error-bg); color: var(--color-error); border-color: rgba(239, 68, 68, 0.2);'
    };

    const sizes = {
      sm: 'padding: 0.125rem 0.5rem; font-size: var(--text-xs);',
      md: 'padding: 0.25rem 0.75rem; font-size: var(--text-sm);',
      lg: 'padding: 0.375rem 1rem; font-size: var(--text-base);'
    };

    this.shadowRoot.innerHTML = `
      <style>
        .badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          border-radius: var(--radius-full);
          border: 1px solid;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
          ${variants[variant] || variants.default}
          ${sizes[size] || sizes.md}
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      </style>
      <span class="badge">
        ${pulse ? '<span class="pulse-dot"></span>' : ''}
        <slot></slot>
      </span>
    `;
  }
}

customElements.define('webowo-badge', WebowoBadge);
