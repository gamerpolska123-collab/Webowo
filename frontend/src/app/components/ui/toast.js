// ============================================
// Webowo v3.0 – Toast Component
// ============================================

class WebowoToast extends HTMLElement {
  static get observedAttributes() { return ['message', 'type', 'duration']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._timer = null;
    this._startTime = null;
    this._remaining = 5000;
  }

  connectedCallback() {
    this.render();
    this._startTimer();
    this._bindEvents();
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
  }

  _bindEvents() {
    const el = this.shadowRoot.querySelector('.toast');
    if (!el) return;

    el.addEventListener('mouseenter', () => {
      clearTimeout(this._timer);
      this._remaining -= Date.now() - this._startTime;
      const progress = this.shadowRoot.querySelector('.toast-progress');
      if (progress) progress.style.animationPlayState = 'paused';
    });

    el.addEventListener('mouseleave', () => {
      this._startTimer(this._remaining);
      const progress = this.shadowRoot.querySelector('.toast-progress');
      if (progress) progress.style.animationPlayState = 'running';
    });

    this.shadowRoot.querySelector('.toast-close')?.addEventListener('click', () => {
      this._dismiss();
    });
  }

  _startTimer(duration) {
    const dur = duration || parseInt(this.getAttribute('duration'), 10) || 5000;
    this._remaining = dur;
    this._startTime = Date.now();
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._dismiss(), dur);
  }

  _dismiss() {
    const el = this.shadowRoot.querySelector('.toast');
    if (!el) { this.remove(); return; }
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    setTimeout(() => this.remove(), 300);
  }

  render() {
    const message = this.getAttribute('message') || '';
    const type = this.getAttribute('type') || 'info';
    const duration = parseInt(this.getAttribute('duration'), 10) || 5000;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const colors = {
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)'
    };

    this.shadowRoot.innerHTML = `
      <style>
        .toast {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          min-width: 320px;
          max-width: 480px;
          position: relative;
          overflow: hidden;
          animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes toast-in {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-icon {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          background: ${colors[type]}20;
          color: ${colors[type]};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .toast-content {
          flex: 1;
          min-width: 0;
        }
        .toast-message {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text);
          line-height: 1.5;
        }
        .toast-close {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          color: var(--color-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          transition: color var(--transition-fast), background var(--transition-fast);
        }
        .toast-close:hover {
          color: var(--color-text);
          background: var(--color-surface);
        }
        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: ${colors[type]};
          width: 100%;
          animation: toast-progress ${duration}ms linear forwards;
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      </style>
      <div class="toast" role="alert" aria-live="polite">
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Zamknij">&times;</button>
        <div class="toast-progress"></div>
      </div>
    `;
  }
}

customElements.define('webowo-toast', WebowoToast);

// Toast manager
window.showToast = function(message, type = 'info', duration = 5000) {
  const container = document.getElementById('toast-container') || (() => {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.style.cssText = 'position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;';
    document.body.appendChild(c);
    return c;
  })();

  const toast = document.createElement('webowo-toast');
  toast.setAttribute('message', message);
  toast.setAttribute('type', type);
  toast.setAttribute('duration', duration);
  container.appendChild(toast);
};
