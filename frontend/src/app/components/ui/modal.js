// ============================================
// Web Component: Modal
// ============================================

class WebowoModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: none; }
        :host([open]) { display: flex; position: fixed; inset: 0; z-index: 1000; align-items: center; justify-content: center; }
        .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
        .content { position: relative; background: var(--color-surface); border-radius: 1rem; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-muted); }
        .close:hover { color: var(--color-text); }
      </style>
      <div class="backdrop" part="backdrop"></div>
      <div class="content" part="content">
        <button class="close" aria-label="Zamknij">&times;</button>
        <slot></slot>
      </div>
    `;

    this.shadowRoot.querySelector('.close').addEventListener('click', () => this.close());
    this.shadowRoot.querySelector('.backdrop').addEventListener('click', () => this.close());
    this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
  }

  open() { this.setAttribute('open', ''); document.body.style.overflow = 'hidden'; }
  close() { this.removeAttribute('open'); document.body.style.overflow = ''; }
}
customElements.define('webowo-modal', WebowoModal);
