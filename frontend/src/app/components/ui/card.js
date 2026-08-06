// ============================================
// Web Component: Card
// ============================================

class WebowoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: var(--color-surface);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
        ::slotted(h3) { margin: 0 0 0.5rem; font-size: 1.25rem; }
        ::slotted(p) { margin: 0; color: var(--color-muted); }
      </style>
      <div class="card"><slot></slot></div>
    `;
  }
}
customElements.define('webowo-card', WebowoCard);
