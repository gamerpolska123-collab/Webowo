// ============================================
// Web Component: Button
// ============================================

class WebowoBtn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const href = this.getAttribute('href');
    const tag = href ? 'a' : 'button';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        ${tag} {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 0.5rem; border: none; border-radius: 0.5rem; cursor: pointer;
          font-family: inherit; font-weight: 600; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        ${tag}:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        ${tag}:active { transform: translateY(0); }
        .primary { background: var(--color-primary); color: white; }
        .secondary { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }
        .ghost { background: transparent; color: var(--color-text); }
        .sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
        .md { padding: 0.75rem 1.5rem; font-size: 1rem; }
        .lg { padding: 1rem 2rem; font-size: 1.125rem; }
      </style>
      <${tag} class="${variant} ${size}" ${href ? `href="${href}"` : ''}>
        <slot></slot>
      </${tag}>
    `;
  }
}
customElements.define('webowo-btn', WebowoBtn);
