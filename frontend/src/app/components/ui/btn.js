// ============================================
// Webowo v3.1 – Button Component
// ============================================

class WebowoBtn extends HTMLElement {
  static get observedAttributes() { return ['variant', 'size', 'href']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const href = this.getAttribute('href');

    const tag = href ? 'a' : 'button';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 150ms ease;
          white-space: nowrap;
          text-decoration: none;
          font-family: inherit;
          width: 100%;
        }
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.75rem; }
        .btn-md { padding: 0.75rem 1.5rem; font-size: 0.875rem; }
        .btn-lg { padding: 1rem 2rem; font-size: 1rem; }
        .btn-primary {
          background: linear-gradient(135deg, #005ce6 0%, #0047b3 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 92, 230, 0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 92, 230, 0.4); }
        .btn-secondary {
          background: transparent;
          color: inherit;
          border: 2px solid #e2e8f0;
        }
        .btn-secondary:hover { border-color: #005ce6; color: #005ce6; background: #eff6ff; }
        .btn-ghost { background: transparent; color: #64748b; }
        .btn-ghost:hover { color: #0f172a; background: #f8fafc; }
        ::slotted(svg) { width: 1.25em; height: 1.25em; }
      </style>
      <${tag} class="btn btn-${size} btn-${variant}" ${href ? `href="${href}"` : ''}>
        <slot></slot>
      </${tag}>
    `;
  }
}

customElements.define('webowo-btn', WebowoBtn);
