// ============================================
// Section: Contact
// ============================================

import { t } from '../../core/i18n.js';
import { isValidEmail } from '../../shared/utils.js';
import { showToast } from '../../components/ui/toast.js';

class WebowoSectionContact extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._onI18nChange = () => this.render();
    window.addEventListener('i18n:changed', this._onI18nChange);
  }

  disconnectedCallback() {
    window.removeEventListener('i18n:changed', this._onI18nChange);
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('contact_title');
    const email = data.email || 'kontakt@matys.net.pl';
    const phone = data.phone || '+48 123 456 789';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; }
        .contact { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        h2 { font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem; }
        .info p { color: var(--color-muted); margin: 0 0 2rem; }
        .detail { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .detail-icon { width: 40px; height: 40px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; }
        form { display: flex; flex-direction: column; gap: 0.25rem; }
        input, textarea { padding: 1rem; border: 1px solid var(--color-border); border-radius: 0.5rem; font-family: inherit; font-size: 1rem; background: var(--color-surface); color: var(--color-text); }
        input:focus, textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(0,92,230,0.1); }
        input.input-error, textarea.input-error { border-color: var(--color-error); }
        button { padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        button:hover { opacity: 0.9; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .field-error { color: var(--color-error); font-size: 0.875rem; min-height: 1.25rem; margin-bottom: 0.5rem; }
        .honeypot { position: absolute; left: -9999px; opacity: 0; pointer-events: none; }
        .success { color: var(--color-success); font-weight: 500; }
        .error { color: var(--color-error); font-weight: 500; }
        @media (max-width: 768px) { .contact { grid-template-columns: 1fr; } }
      </style>
      <section class="contact" id="contact">
        <div class="info">
          <h2>${title}</h2>
          <p>${t('contact_info')}</p>
          <div class="detail">
            <div class="detail-icon">📧</div>
            <div><strong>${t('contact_email_label')}</strong><br><a href="mailto:${email}" style="color:var(--color-primary);text-decoration:none;">${email}</a></div>
          </div>
          <div class="detail">
            <div class="detail-icon">📱</div>
            <div><strong>${t('contact_phone_label')}</strong><br>${phone}</div>
          </div>
        </div>
        <form id="contact-form">
          <input type="text" name="name" placeholder="${t('contact_name_placeholder')}" required>
          <div class="field-error" id="error-name"></div>

          <input type="email" name="email" placeholder="${t('contact_email_placeholder')}" required>
          <div class="field-error" id="error-email"></div>

          <input type="text" name="subject" placeholder="${t('contact_subject_placeholder')}">
          <div class="field-error" id="error-subject"></div>

          <textarea name="message" rows="5" placeholder="${t('contact_message_placeholder')}" required></textarea>
          <div class="field-error" id="error-message"></div>

          <!-- Honeypot anti-bot field -->
          <input type="text" name="website" class="honeypot" tabindex="-1" autocomplete="off">

          <button type="submit">${t('contact_submit')}</button>
          <div id="form-status"></div>
        </form>
      </section>
    `;

    const form = this.shadowRoot.getElementById('contact-form');
    const status = this.shadowRoot.getElementById('form-status');
    const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:6666/api/v2';

    // Walidacja per pole
    const validateField = (name, value) => {
      if (name === 'name') {
        if (!value || value.trim().length < 2) return t('contact_error_name');
      }
      if (name === 'email') {
        if (!value || !isValidEmail(value)) return t('contact_error_email');
      }
      if (name === 'message') {
        if (!value || value.trim().length < 10) return t('contact_error_message');
      }
      return '';
    };

    const clearErrors = () => {
      ['name', 'email', 'subject', 'message'].forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        const errorEl = this.shadowRoot.getElementById(`error-${field}`);
        if (input) input.classList.remove('input-error');
        if (errorEl) errorEl.textContent = '';
      });
      status.textContent = '';
      status.className = '';
    };

    const showFieldError = (field, message) => {
      const input = form.querySelector(`[name="${field}"]`);
      const errorEl = this.shadowRoot.getElementById(`error-${field}`);
      if (input) input.classList.add('input-error');
      if (errorEl) errorEl.textContent = message;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const formData = new FormData(form);
      const body = Object.fromEntries(formData);

      // Honeypot – jeśli wypełnione, symuluj sukces bez wysyłki
      if (body.website && body.website.trim() !== '') {
        showToast(t('contact_success'), 'success');
        form.reset();
        return;
      }

      // Walidacja
      const fieldsToValidate = ['name', 'email', 'message'];
      let hasErrors = false;
      for (const field of fieldsToValidate) {
        const error = validateField(field, body[field]);
        if (error) {
          showFieldError(field, error);
          hasErrors = true;
        }
      }
      if (hasErrors) return;

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
          showToast(t('contact_success'), 'success');
          form.reset();
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (err) {
        showToast(t('contact_error'), 'error');
        status.textContent = t('contact_error');
        status.className = 'error';
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    // Czyść błąd przy input
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const field = input.name;
        const errorEl = this.shadowRoot.getElementById(`error-${field}`);
        if (errorEl) errorEl.textContent = '';
        input.classList.remove('input-error');
      });
    });
  }
}
customElements.define('webowo-section-contact', WebowoSectionContact);
