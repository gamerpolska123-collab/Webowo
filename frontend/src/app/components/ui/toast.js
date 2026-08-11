// ============================================
// Webowo v3.1 – Toast Notification
// ============================================

class WebowoToast extends HTMLElement {
  static container = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    setTimeout(() => this.remove(), 5000);
  }

  render() {
    const type = this.getAttribute('type') || 'info';
    const message = this.getAttribute('message') || '';

    const colors = {
      success: '#059669',
      error: '#dc2626',
      warning: '#d97706',
      info: '#005ce6'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          animation: slide-in 300ms ease;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: white;
          border-left: 4px solid ${colors[type]};
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          font-size: 0.875rem;
          color: #0f172a;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      </style>
      <div class="toast">
        <span>${message}</span>
      </div>
    `;
  }

  static show(message, type = 'info') {
    if (!WebowoToast.container) {
      WebowoToast.container = document.createElement('div');
      WebowoToast.container.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
      document.body.appendChild(WebowoToast.container);
    }
    const toast = document.createElement('webowo-toast');
    toast.setAttribute('type', type);
    toast.setAttribute('message', message);
    WebowoToast.container.appendChild(toast);
  }
}

customElements.define('webowo-toast', WebowoToast);
