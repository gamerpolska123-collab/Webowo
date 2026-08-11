// ============================================
// Webowo v3.0 – Input Component
// ============================================

class WebowoInput extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'placeholder', 'label', 'required', 'error', 'value', 'name', 'rows'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  attributeChangedCallback() {
    this.render();
    this._bindEvents();
  }

  _bindEvents() {
    const input = this.shadowRoot.querySelector('input, textarea, select');
    if (!input) return;

    input.addEventListener('input', () => {
      this.setAttribute('value', input.value);
      this.dispatchEvent(new CustomEvent('input-change', {
        detail: { value: input.value, name: this.getAttribute('name') },
        bubbles: true,
        composed: true
      }));
    });

    input.addEventListener('blur', () => {
      this._validate();
    });
  }

  _validate() {
    const input = this.shadowRoot.querySelector('input, textarea, select');
    const errorEl = this.shadowRoot.querySelector('.error-msg');
    if (!input || !errorEl) return;

    const isRequired = this.hasAttribute('required');
    const isEmpty = !input.value.trim();

    if (isRequired && isEmpty) {
      input.classList.add('is-error');
      errorEl.textContent = 'To pole jest wymagane';
      return false;
    }

    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add('is-error');
        errorEl.textContent = 'Podaj prawidłowy adres e-mail';
        return false;
      }
    }

    input.classList.remove('is-error');
    errorEl.textContent = '';
    return true;
  }

  get value() {
    return this.shadowRoot.querySelector('input, textarea, select')?.value || '';
  }

  render() {
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const label = this.getAttribute('label') || '';
    const required = this.hasAttribute('required');
    const error = this.getAttribute('error') || '';
    const value = this.getAttribute('value') || '';
    const name = this.getAttribute('name') || '';
    const rows = this.getAttribute('rows') || '4';

    const isTextarea = type === 'textarea';
    const isSelect = type === 'select';

    let inputHtml = '';
    if (isTextarea) {
      inputHtml = `<textarea class="input" name="${name}" placeholder="${placeholder}" rows="${rows}">${value}</textarea>`;
    } else if (isSelect) {
      const options = (this.getAttribute('options') || '').split(',').map(o => o.trim()).filter(Boolean);
      inputHtml = `<select class="input" name="${name}">
        <option value="" disabled ${!value ? 'selected' : ''}>${placeholder || 'Wybierz...'}</option>
        ${options.map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>`;
    } else {
      inputHtml = `<input class="input" type="${type}" name="${name}" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''} />`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        .field { display: flex; flex-direction: column; gap: var(--space-1); }
        .label {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text);
        }
        .label-required::after { content: ' *'; color: var(--color-error); }
        .input {
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-sans);
          font-size: var(--text-base);
          color: var(--color-text);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
          width: 100%;
          outline: none;
        }
        .input::placeholder { color: var(--color-neutral-400); }
        .input:focus {
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px rgba(0, 92, 230, 0.1);
          background: var(--color-bg);
        }
        .input.is-error {
          border-color: var(--color-error);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        textarea.input { resize: vertical; min-height: 120px; }
        select.input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 40px; }
        .error-msg {
          font-size: var(--text-xs);
          color: var(--color-error);
          min-height: 1.25rem;
        }
      </style>
      <div class="field">
        ${label ? `<label class="label ${required ? 'label-required' : ''}">${label}</label>` : ''}
        ${inputHtml}
        <span class="error-msg">${error}</span>
      </div>
    `;
  }
}

customElements.define('webowo-input', WebowoInput);
