// ============================================
// Webowo v3.0 – Accordion Component
// ============================================

class WebowoAccordion extends HTMLElement {
  static get observedAttributes() { return ['multiple']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  _bindEvents() {
    const items = this.shadowRoot.querySelectorAll('.accordion-item');
    const multiple = this.hasAttribute('multiple');

    items.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      trigger?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        if (!multiple) {
          items.forEach(i => {
            i.classList.remove('is-open');
            i.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        } else if (multiple) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .accordion {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .accordion-item {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .accordion-item:hover {
          border-color: var(--color-primary-200);
        }
        .accordion-item.is-open {
          border-color: var(--color-primary-300);
          box-shadow: var(--shadow-md);
        }
        .accordion-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--space-4) var(--space-5);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--color-text);
          transition: color var(--transition-fast);
        }
        .accordion-trigger:hover {
          color: var(--color-primary-500);
        }
        .accordion-icon {
          width: 20px;
          height: 20px;
          transition: transform var(--transition-base);
          flex-shrink: 0;
          color: var(--color-muted);
        }
        .accordion-item.is-open .accordion-icon {
          transform: rotate(180deg);
          color: var(--color-primary-500);
        }
        .accordion-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--transition-slow);
        }
        .accordion-item.is-open .accordion-content {
          grid-template-rows: 1fr;
        }
        .accordion-content-inner {
          overflow: hidden;
        }
        .accordion-content-body {
          padding: 0 var(--space-5) var(--space-5);
          color: var(--color-muted);
          font-size: var(--text-sm);
          line-height: 1.7;
        }
      </style>
      <div class="accordion" role="region">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('webowo-accordion', WebowoAccordion);
