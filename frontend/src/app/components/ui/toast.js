class WebowoToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const msg = this.getAttribute('message') || '';
    const type = this.getAttribute('type') || 'info';
    const colors = { info: '#005ce6', success: '#22c55e', error: '#ef4444', warning: '#f59e0b' };
    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; animation: slideIn 0.3s ease; }
        .toast { padding: 1rem 1.5rem; border-radius: 0.5rem; background: ${colors[type] || colors.info}; color: white; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        @keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
      <div class="toast">${msg}</div>
    `;
    setTimeout(() => this.remove(), 4000);
  }
}

customElements.define('webowo-toast', WebowoToast);

export function showToast(message, type = 'info') {
  const toast = document.createElement('webowo-toast');
  toast.setAttribute('message', message);
  toast.setAttribute('type', type);
  document.body.appendChild(toast);
}
