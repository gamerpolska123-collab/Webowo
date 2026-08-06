// ============================================
// Web Component: Tooltip
// ============================================

class WebowoTooltip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const text = this.getAttribute('text') || '';
    this.shadowRoot.innerHTML = `
      <style>
        :host { position: relative; display: inline-block; }
        .tip {
          position: absolute; bottom: calc(100% + 0.5rem); left: 50%; transform: translateX(-50%);
          background: var(--color-text); color: var(--color-bg); padding: 0.5rem 0.75rem;
          border-radius: 0.375rem; font-size: 0.75rem; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
          z-index: 100;
        }
        .tip::after {
          content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border: 4px solid transparent; border-top-color: var(--color-text);
        }
        :host(:hover) .tip { opacity: 1; }
      </style>
      <slot></slot>
      <div class="tip">${text}</div>
    `;
  }
}
customElements.define('webowo-tooltip', WebowoTooltip);
