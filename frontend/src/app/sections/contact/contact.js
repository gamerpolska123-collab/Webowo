// ============================================
// Section: Contact
// ============================================

class WebowoSectionContact extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || 'Kontakt';
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
        form { display: flex; flex-direction: column; gap: 1rem; }
        input, textarea { padding: 1rem; border: 1px solid var(--color-border); border-radius: 0.5rem; font-family: inherit; font-size: 1rem; background: var(--color-surface); color: var(--color-text); }
        input:focus, textarea:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(0,92,230,0.1); }
        button { padding: 1rem; background: var(--color-primary); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        button:hover { opacity: 0.9; }
        .success { color: var(--color-success); font-weight: 500; }
        .error { color: var(--color-error); font-weight: 500; }
        @media (max-width: 768px) { .contact { grid-template-columns: 1fr; } }
      </style>
      <section class="contact" id="contact">
        <div class="info">
          <h2>${title}</h2>
          <p>Masz pomysł na stronę? Napisz do mnie — odpowiadam w ciągu 24h.</p>
          <div class="detail">
            <div class="detail-icon">📧</div>
            <div><strong>Email</strong><br><a href="mailto:${email}" style="color:var(--color-primary);text-decoration:none;">${email}</a></div>
          </div>
          <div class="detail">
            <div class="detail-icon">📱</div>
            <div><strong>Telefon</strong><br>${phone}</div>
          </div>
        </div>
        <form id="contact-form">
          <input type="text" name="name" placeholder="Imię i nazwisko" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="text" name="subject" placeholder="Temat">
          <textarea name="message" rows="5" placeholder="Twoja wiadomość..." required></textarea>
          <button type="submit">Wyślij wiadomość</button>
          <div id="form-status"></div>
        </form>
      </section>
    `;

    const form = this.shadowRoot.getElementById('contact-form');
    const status = this.shadowRoot.getElementById('form-status');
    const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:6666/api/v2';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = '';
      const formData = new FormData(form);
      const body = Object.fromEntries(formData);
      try {
        const res = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        if (result.success) {
          status.textContent = '✅ Wiadomość wysłana! Odpowiem w ciągu 24h.';
          status.className = 'success';
          form.reset();
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        status.textContent = '❌ ' + (err.message || 'Błąd wysyłania. Spróbuj ponownie.');
        status.className = 'error';
      }
    });
  }
}
customElements.define('webowo-section-contact', WebowoSectionContact);
