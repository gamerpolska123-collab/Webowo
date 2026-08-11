// ============================================
// Webowo v3.0 – Contact Section
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionContact extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isSubmitting = false;
  }

  connectedCallback() {
    this.render();
    this._bindForm();
  }

  _bindForm() {
    const form = this.shadowRoot.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this._isSubmitting) return;

      // Validate
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-error');
          const errorEl = input.parentElement.querySelector('.field-error');
          if (errorEl) errorEl.textContent = 'To pole jest wymagane';
        } else {
          input.classList.remove('is-error');
          const errorEl = input.parentElement.querySelector('.field-error');
          if (errorEl) errorEl.textContent = '';
        }
      });

      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.classList.add('is-error');
          const errorEl = emailInput.parentElement.querySelector('.field-error');
          if (errorEl) errorEl.textContent = 'Podaj prawidłowy adres e-mail';
        }
      }

      if (!isValid) {
        window.showToast?.('Proszę wypełnić wszystkie wymagane pola', 'error');
        return;
      }

      this._isSubmitting = true;
      const submitBtn = form.querySelector('.contact-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Wysyłanie...';
      }

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
        const res = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          window.showToast?.('Wiadomość wysłana pomyślnie! Odpowiem w ciągu 24h.', 'success');
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        console.error('[Contact] Submit error:', err);
        window.showToast?.('Wystąpił błąd. Spróbuj ponownie lub skontaktuj się bezpośrednio.', 'error');
      } finally {
        this._isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Wyślij wiadomość <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';
        }
      }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-error');
        const errorEl = input.parentElement.querySelector('.field-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('contact_title') || 'Skontaktuj się';
    const subtitle = data.subtitle || 'Porozmawiajmy o Twoim projekcie';
    const email = data.email || 'kontakt@matys.net.pl';
    const phone = data.phone || '+48 123 456 789';
    const address = data.address || 'Polska, zdalnie';
    const social = data.social || {};
    const formFields = data.form?.fields || [
      { name: 'name', label: 'Imię i nazwisko', type: 'text', required: true },
      { name: 'email', label: 'Adres e-mail', type: 'email', required: true },
      { name: 'subject', label: 'Temat', type: 'select', options: ['Strona WWW', 'Sklep Online', 'Aplikacja Webowa', 'Inne'], required: true },
      { name: 'budget', label: 'Budżet', type: 'select', options: ['< 2 000 PLN', '2 000 - 5 000 PLN', '5 000 - 10 000 PLN', '> 10 000 PLN'], required: false },
      { name: 'message', label: 'Wiadomość', type: 'textarea', required: true, rows: 5 }
    ];

    const renderField = (field) => {
      const required = field.required ? 'required' : '';
      const label = field.label + (field.required ? ' *' : '');

      if (field.type === 'textarea') {
        return `
          <div class="field">
            <label class="field-label">${label}</label>
            <textarea class="field-input" name="${field.name}" rows="${field.rows || 5}" ${required} placeholder="Opisz swój projekt..."></textarea>
            <span class="field-error"></span>
          </div>
        `;
      }
      if (field.type === 'select') {
        return `
          <div class="field">
            <label class="field-label">${label}</label>
            <div class="field-select-wrapper">
              <select class="field-input field-select" name="${field.name}" ${required}>
                <option value="" disabled selected>Wybierz...</option>
                ${field.options.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
            <span class="field-error"></span>
          </div>
        `;
      }
      return `
        <div class="field">
          <label class="field-label">${label}</label>
          <input class="field-input" type="${field.type}" name="${field.name}" ${required} placeholder="${field.placeholder || ''}">
          <span class="field-error"></span>
        </div>
      `;
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .contact {
          padding: var(--space-24) var(--container-padding);
          position: relative;
        }
        .contact-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: var(--space-16);
          align-items: start;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .contact-label {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-primary-500);
          font-size: var(--text-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .contact-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .contact-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
        }
        .contact-subtitle {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.7;
          margin: 0 0 var(--space-6);
        }
        .contact-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .contact-detail {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .contact-detail:hover {
          border-color: var(--color-primary-200);
          box-shadow: var(--shadow-md);
        }
        .contact-detail-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, var(--color-primary-50), var(--color-accent-50));
          color: var(--color-primary-500);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-detail-content {
          display: flex;
          flex-direction: column;
        }
        .contact-detail-label {
          font-size: var(--text-xs);
          color: var(--color-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .contact-detail-value {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--color-text);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .contact-detail-value:hover {
          color: var(--color-primary-500);
        }
        .contact-social {
          display: flex;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }
        .contact-social-link {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xl);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .contact-social-link:hover {
          background: var(--color-primary-500);
          color: white;
          border-color: var(--color-primary-500);
          transform: translateY(-2px);
        }
        .contact-form-wrapper {
          background: var(--color-surface-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-lg);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .field-label {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-text);
        }
        .field-input {
          padding: var(--space-3) var(--space-4);
          font-family: var(--font-sans);
          font-size: var(--text-base);
          color: var(--color-text);
          background: var(--color-bg);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
          width: 100%;
          outline: none;
        }
        .field-input::placeholder {
          color: var(--color-neutral-400);
        }
        .field-input:focus {
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px rgba(0, 92, 230, 0.1);
          background: var(--color-bg);
        }
        .field-input.is-error {
          border-color: var(--color-error);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        textarea.field-input { resize: vertical; min-height: 120px; }
        .field-select-wrapper {
          position: relative;
        }
        .field-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 40px;
          cursor: pointer;
        }
        .field-error {
          font-size: var(--text-xs);
          color: var(--color-error);
          min-height: 1rem;
        }
        .contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-4) var(--space-8);
          background: var(--gradient-primary);
          color: white;
          font-family: var(--font-sans);
          font-size: var(--text-base);
          font-weight: 700;
          border: none;
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
          box-shadow: 0 4px 14px rgba(0, 92, 230, 0.35);
          margin-top: var(--space-2);
        }
        .contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 92, 230, 0.45);
        }
        .contact-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .contact-privacy {
          font-size: var(--text-xs);
          color: var(--color-muted);
          text-align: center;
          margin-top: var(--space-4);
        }
        .contact-privacy a {
          color: var(--color-primary-500);
          text-decoration: underline;
        }
        @media (max-width: 1024px) {
          .contact-inner { grid-template-columns: 1fr; gap: var(--space-12); }
        }
      </style>
      <section class="contact" id="contact">
        <div class="contact-inner">
          <div class="contact-info">
            <div>
              <div class="contact-label">Kontakt</div>
              <h2 class="contact-title">${title}</h2>
              <p class="contact-subtitle">${subtitle}</p>
            </div>
            <div class="contact-details">
              <div class="contact-detail">
                <div class="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div class="contact-detail-content">
                  <span class="contact-detail-label">E-mail</span>
                  <a href="mailto:${email}" class="contact-detail-value">${email}</a>
                </div>
              </div>
              <div class="contact-detail">
                <div class="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="contact-detail-content">
                  <span class="contact-detail-label">Telefon</span>
                  <a href="tel:${phone}" class="contact-detail-value">${phone}</a>
                </div>
              </div>
              <div class="contact-detail">
                <div class="contact-detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div class="contact-detail-content">
                  <span class="contact-detail-label">Lokalizacja</span>
                  <span class="contact-detail-value">${address}</span>
                </div>
              </div>
            </div>
            <div class="contact-social">
              ${social.github ? `<a href="${social.github}" class="contact-social-link" target="_blank" rel="noopener" aria-label="GitHub" data-external><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>` : ''}
              ${social.linkedin ? `<a href="${social.linkedin}" class="contact-social-link" target="_blank" rel="noopener" aria-label="LinkedIn" data-external><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>` : ''}
              ${social.twitter ? `<a href="${social.twitter}" class="contact-social-link" target="_blank" rel="noopener" aria-label="Twitter" data-external><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>` : ''}
            </div>
          </div>
          <div class="contact-form-wrapper">
            <form class="contact-form" novalidate>
              <div class="contact-form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);">
                ${formFields.slice(0, 2).map(renderField).join('')}
              </div>
              ${formFields.slice(2).map(renderField).join('')}
              <button type="submit" class="contact-submit" data-track="contact_submit">
                Wyślij wiadomość
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
              <p class="contact-privacy">
                Wysyłając formularz, akceptujesz <a href="#privacy">Politykę Prywatności</a> i zgadzasz się na przetwarzanie danych osobowych zgodnie z RODO.
              </p>
            </form>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-contact', WebowoSectionContact);
