// ============================================
// Layout Component: Container
// ============================================

class WebowoContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const maxWidth = this.getAttribute('max-width') || '1200px';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .container { max-width: ${maxWidth}; margin: 0 auto; padding: 0 2rem; }
      </style>
      <div class="container"><slot></slot></div>
    `;
  }
}
customElements.define('webowo-container', WebowoContainer);
