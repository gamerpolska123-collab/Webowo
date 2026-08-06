class WebowoLayoutFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ::slotted(*) { max-width: 1200px; margin: 0 auto; }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('webowo-layout-footer', WebowoLayoutFooter);
