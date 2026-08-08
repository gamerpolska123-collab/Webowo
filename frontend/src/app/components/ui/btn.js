// ============================================
// Webowo v3.0 – Button Component
// ============================================

class WebowoBtn extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'href', 'disabled', 'loading'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._setupRipple();
  }

  attributeChangedCallback() {
    this.render();
    this._setupRipple();
  }

  _setupRipple() {
    const btn = this.shadowRoot.querySelector('.btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      if (btn.disabled || btn.classList.contains('is-loading')) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const href = this.getAttribute('href');
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');
    const tag = href ? 'a' : 'button';

    this.shadowRoot.innerHTML = `
      <style>
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          font-family: var(--font-sans);
          font-weight: 600;
          border-radius: var(--radius-lg);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          text-decoration: none;
          user-select: none;
          outline: none;
        }
        .btn:disabled, .btn.is-loading {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Sizes */
        .btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
        .btn-md { padding: var(--space-3) var(--space-6); font-size: var(--text-sm); }
        .btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-base); }

        /* Variants */
        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(0, 92, 230, 0.39);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(0, 92, 230, 0.5);
          filter: brightness(1.1);
        }
        .btn-secondary {
          background: transparent;
          color: var(--color-text);
          border-color: var(--color-border);
        }
        .btn-secondary:hover:not(:disabled) {
          border-color: var(--color-primary-500);
          color: var(--color-primary-500);
          background: var(--color-primary-50);
        }
        .btn-accent {
          background: var(--gradient-accent);
          color: white;
          box-shadow: 0 4px 14px 0 rgba(0, 212, 170, 0.39);
        }
        .btn-accent:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(0, 212, 170, 0.5);
          filter: brightness(1.1);
        }
        .btn-ghost {
          background: transparent;
          color: var(--color-muted);
        }
        .btn-ghost:hover:not(:disabled) {
          color: var(--color-text);
          background: var(--color-surface);
        }

        /* Ripple */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple-anim 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple-anim {
          to { transform: scale(4); opacity: 0; }
        }

        /* Loading spinner */
        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <${tag} class="btn btn-${variant} btn-${size} ${loading ? 'is-loading' : ''}" ${disabled ? 'disabled' : ''} ${href ? `href="${href}"` : ''}>
        ${loading ? '<span class="spinner"></span>' : ''}
        <slot></slot>
      </${tag}>
    `;
  }
}

customElements.define('webowo-btn', WebowoBtn);
