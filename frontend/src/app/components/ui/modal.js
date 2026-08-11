// ============================================
// Webowo v3.1 – Modal Component
// ============================================

class WebowoModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => this.close());
    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => this.close());
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: none; }
        :host([open]) { display: flex; }
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal {
          background: white;
          border-radius: 1rem;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .title { font-size: 1.25rem; font-weight: 700; margin: 0; }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          transition: all 150ms;
        }
        .close-btn:hover { background: #f1f5f9; color: #0f172a; }
        .body { padding: 1.5rem; }
      </style>
      <div class="overlay">
        <div class="modal">
          <div class="header">
            <h3 class="title"><slot name="title"></slot></h3>
            <button class="close-btn">&times;</button>
          </div>
          <div class="body"><slot></slot></div>
        </div>
      </div>
    `;
  }

  open() { this.setAttribute('open', ''); }
  close() { this.removeAttribute('open'); }
}

customElements.define('webowo-modal', WebowoModal);
