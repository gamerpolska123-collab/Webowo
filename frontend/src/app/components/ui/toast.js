// ============================================
// Web Component: Toast
// ============================================

class WebowoToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.5rem; }
        .toast {
          padding: 1rem 1.5rem; border-radius: 0.5rem; color: white; font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .success { background: var(--color-success); }
        .error { background: var(--color-error); }
        .info { background: var(--color-primary); }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      </style>
    `;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.shadowRoot.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

let toastInstance = null;
function showToast(message, type, duration) {
  if (!toastInstance) {
    toastInstance = document.createElement('webowo-toast');
    document.body.appendChild(toastInstance);
  }
  toastInstance.show(message, type, duration);
}

customElements.define('webowo-toast', WebowoToast);
export { showToast };
