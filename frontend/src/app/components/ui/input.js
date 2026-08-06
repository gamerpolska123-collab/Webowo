// ============================================
// Web Component: Input
// ============================================

class WebowoInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const label = this.getAttribute('label') || '';
    const required = this.hasAttribute('required');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem; }
        input, textarea {
          width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border);
          border-radius: 0.5rem; font-family: inherit; font-size: 1rem;
          background: var(--color-surface); color: var(--color-text);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(0,92,230,0.1); }
        .error { border-color: var(--color-error); }
        .error-msg { color: var(--color-error); font-size: 0.75rem; margin-top: 0.25rem; }
      </style>
      ${label ? `<label>${label}${required ? ' *' : ''}</label>` : ''}
      ${type === 'textarea' ? `<textarea placeholder="${placeholder}" ${required ? 'required' : ''}></textarea>` : `<input type="${type}" placeholder="${placeholder}" ${required ? 'required' : ''}>`}
      <div class="error-msg" hidden></div>
    `;

    this._input = this.shadowRoot.querySelector('input, textarea');
    this._input.addEventListener('input', () => this.clearError());
  }

  get value() { return this._input.value; }
  set value(v) { this._input.value = v; }

  setError(msg) {
    this._input.classList.add('error');
    const err = this.shadowRoot.querySelector('.error-msg');
    err.textContent = msg;
    err.hidden = false;
  }

  clearError() {
    this._input.classList.remove('error');
    this.shadowRoot.querySelector('.error-msg').hidden = true;
  }
}
customElements.define('webowo-input', WebowoInput);
