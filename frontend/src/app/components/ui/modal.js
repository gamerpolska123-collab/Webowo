// ============================================
// Webowo v3.0 – Modal Component
// ============================================

class WebowoModal extends HTMLElement {
  static get observedAttributes() { return ['open', 'title', 'size']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  attributeChangedCallback(name) {
    if (name === 'open') this._toggle();
    else this.render();
  }

  _bindEvents() {
    const overlay = this.shadowRoot.querySelector('.modal-overlay');
    const closeBtn = this.shadowRoot.querySelector('.modal-close');

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    closeBtn?.addEventListener('click', () => this.close());

    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open() {
    this.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    // Focus trap
    setTimeout(() => {
      const focusable = this.shadowRoot.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus();
    }, 100);
  }

  close() {
    this.removeAttribute('open');
    document.body.style.overflow = '';
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
  }

  _toggle() {
    const isOpen = this.hasAttribute('open');
    const overlay = this.shadowRoot.querySelector('.modal-overlay');
    const content = this.shadowRoot.querySelector('.modal-content');
    if (!overlay || !content) return;

    if (isOpen) {
      overlay.style.display = 'flex';
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        content.style.transform = 'scale(1) translateY(0)';
        content.style.opacity = '1';
      });
    } else {
      overlay.style.opacity = '0';
      content.style.transform = 'scale(0.95) translateY(10px)';
      content.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 300);
    }
  }

  render() {
    const title = this.getAttribute('title') || '';
    const size = this.getAttribute('size') || 'md';
    const sizes = { sm: '480px', md: '640px', lg: '800px', xl: '960px', full: '100%' };

    this.shadowRoot.innerHTML = `
      <style>
        .modal-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          z-index: var(--z-modal-backdrop);
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .modal-content {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          width: 100%;
          max-width: ${sizes[size] || sizes.md};
          max-height: 90vh;
          overflow-y: auto;
          transform: scale(0.95) translateY(10px);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          box-shadow: var(--shadow-2xl);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .modal-title {
          font-size: var(--text-xl);
          font-weight: 700;
          margin: 0;
        }
        .modal-close {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: none;
          background: var(--color-surface);
          color: var(--color-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .modal-close:hover {
          background: var(--color-border);
          color: var(--color-text);
        }
        .modal-body {
          padding: var(--space-6);
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          padding: var(--space-6);
          border-top: 1px solid var(--color-border);
        }
      </style>
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="modal-title">${title}</h2>
            <button class="modal-close" aria-label="Zamknij">&times;</button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
    this._toggle();
  }
}

customElements.define('webowo-modal', WebowoModal);
