import { t } from '../../core/i18n.js';
import { isValidEmail } from '../../shared/utils.js';

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
        h2 { font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem; color: var(--color-text); }
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
        @media (max-width: 768px) { .contact { grid-template-columns: 1fr; } }
      </style>
      <section class="contact" id="contact">
        <div class="info">
          <h2>${title}</h2>
          <p>Masz pomysł na stronę? Napisz do mnie — odpowiadam w ciągu 24h.</p>
          <div class="detail">
            <div class="detail-icon">✉</div>
            <div><div>Email</div><a href="mailto:${email}">${email}</a></div>
          </div>
          <div class="detail">
            <div class="detail-icon">☎</div>
            <div><div>Telefon</div><a href="tel:${phone.replace(/\s/g,'')}">${phone}</a></div>
          </div>
        </div>
        <form id="contact-form">
          <input type="text" name="name" placeholder="${t('contact_name') || 'Imię i nazwisko'}" required />
          <div class="field-error" id="err-name"></div>
          <input type="email" name="email" placeholder="${t('contact_email') || 'Email'}" required />
          <div class="field-error" id="err-email"></div>
          <input type="text" name="subject" placeholder="${t('contact_subject') || 'Temat'}" required />
          <div class="field-error" id="err-subject"></div>
          <textarea name="message" rows="5" placeholder="${t('contact_message') || 'Twoja wiadomość'}" required></textarea>
          <div class="field-error" id="err-message"></div>
          <input type="text" name="website" class="honeypot" tabindex="-1" autocomplete="off" />
          <button type="submit">${t('contact_submit') || 'Wyślij wiadomość'}</button>
        </form>
      </section>
    `;

    const form = this.shadowRoot.getElementById('contact-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd);
      if (payload.website) return;
      let valid = true;
      ['name','email','subject','message'].forEach(k => {
        this.shadowRoot.getElementById('err-' + k).textContent = '';
      });
      if (!payload.name || payload.name.length < 2) { this.shadowRoot.getElementById('err-name').textContent = 'Wpisz imię'; valid = false; }
      if (!isValidEmail(payload.email)) { this.shadowRoot.getElementById('err-email').textContent = 'Niepoprawny email'; valid = false; }
      if (!payload.subject || payload.subject.length < 2) { this.shadowRoot.getElementById('err-subject').textContent = 'Wpisz temat'; valid = false; }
      if (!payload.message || payload.message.length < 10) { this.shadowRoot.getElementById('err-message').textContent = 'Wiadomość za krótka'; valid = false; }
      if (!valid) return;

      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Wysyłanie...';
      try {
        const res = await fetch('/api/v2/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { btn.textContent = 'Wysłano! ✅'; form.reset(); }
        else { btn.textContent = 'Błąd wysyłki ❌'; }
      } catch { btn.textContent = 'Błąd sieci ❌'; }
      finally { setTimeout(() => { btn.disabled = false; btn.textContent = t('contact_submit') || 'Wyślij wiadomość'; }, 3000); }
    });
  }
}

customElements.define('webowo-section-contact', WebowoSectionContact);
