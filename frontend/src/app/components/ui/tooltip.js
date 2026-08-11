// ============================================
// Webowo v3.0 – Tooltip Component
// ============================================

class WebowoTooltip extends HTMLElement {
  static get observedAttributes() { return ['text', 'position']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._showTimer = null;
    this._hideTimer = null;
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  _bindEvents() {
    const trigger = this.shadowRoot.querySelector('.tooltip-trigger');
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    if (!trigger || !tooltip) return;

    trigger.addEventListener('mouseenter', () => {
      clearTimeout(this._hideTimer);
      this._showTimer = setTimeout(() => {
        tooltip.classList.add('is-visible');
      }, 200);
    });

    trigger.addEventListener('mouseleave', () => {
      clearTimeout(this._showTimer);
      this._hideTimer = setTimeout(() => {
        tooltip.classList.remove('is-visible');
      }, 100);
    });

    trigger.addEventListener('focus', () => tooltip.classList.add('is-visible'));
    trigger.addEventListener('blur', () => tooltip.classList.remove('is-visible'));
  }

  render() {
    const text = this.getAttribute('text') || '';
    const position = this.getAttribute('position') || 'top';

    const positions = {
      top: 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-4px);',
      bottom: 'top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);',
      left: 'right: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(-4px);',
      right: 'left: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(4px);'
    };

    this.shadowRoot.innerHTML = `
      <style>
        .tooltip-wrapper {
          position: relative;
          display: inline-flex;
        }
        .tooltip {
          position: absolute;
          ${positions[position]}
          background: var(--color-neutral-800);
          color: white;
          font-size: var(--text-xs);
          font-weight: 500;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: var(--z-tooltip);
        }
        .tooltip.is-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0) !important;
        }
        .tooltip::after {
          content: '';
          position: absolute;
          ${position === 'top' ? 'top: 100%; left: 50%; transform: translateX(-50%); border-width: 4px 4px 0; border-color: var(--color-neutral-800) transparent transparent;' :
            position === 'bottom' ? 'bottom: 100%; left: 50%; transform: translateX(-50%); border-width: 0 4px 4px; border-color: transparent transparent var(--color-neutral-800);' :
            position === 'left' ? 'left: 100%; top: 50%; transform: translateY(-50%); border-width: 4px 0 4px 4px; border-color: transparent transparent transparent var(--color-neutral-800);' :
            'right: 100%; top: 50%; transform: translateY(-50%); border-width: 4px 4px 4px 0; border-color: transparent var(--color-neutral-800) transparent transparent;'}
          border-style: solid;
        }
      </style>
      <div class="tooltip-wrapper">
        <span class="tooltip-trigger"><slot></slot></span>
        <div class="tooltip" role="tooltip">${text}</div>
      </div>
    `;
  }
}

customElements.define('webowo-tooltip', WebowoTooltip);
