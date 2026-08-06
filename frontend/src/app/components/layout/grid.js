// ============================================
// Layout Component: Grid
// ============================================

class WebowoGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const cols = this.getAttribute('cols') || '3';
    const gap = this.getAttribute('gap') || '1.5rem';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .grid { display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
      </style>
      <div class="grid"><slot></slot></div>
    `;
  }
}
customElements.define('webowo-grid', WebowoGrid);
