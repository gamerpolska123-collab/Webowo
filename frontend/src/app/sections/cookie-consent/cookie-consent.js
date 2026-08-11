// ============================================
// Webowo v3.1 – Cookie Consent
// ============================================

class WebowoCookieConsent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const consent = localStorage.getItem('webowo_cookie_consent');
    if (consent === 'accepted' || consent === 'declined') {
      this.style.display = 'none';
      return;
    }
    this.render();
    this.setupEvents();
  }

  setupEvents() {
    this.shadowRoot.querySelector('.accept').addEventListener('click', () => {
      localStorage.setItem('webowo_cookie_consent', 'accepted');
      this.style.display = 'none';
    });
    this.shadowRoot.querySelector('.decline').addEventListener('click', () => {
      localStorage.setItem('webowo_cookie_consent', 'declined');
      this.style.display = 'none';
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999; }
        .banner {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1.5rem;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .text {
          font-size: 0.9375rem;
          line-height: 1.6;
          flex: 1;
          min-width: 250px;
        }
        .text a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .buttons {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        button {
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          border: none;
          transition: all 150ms;
        }
        .accept {
          background: linear-gradient(135deg, #005ce6, #0047b3);
          color: white;
        }
        .accept:hover { transform: translateY(-1px); }
        .decline {
          background: transparent;
          color: #94a3b8;
          border: 1px solid #334155;
        }
        .decline:hover { color: white; border-color: #64748b; }
        @media (max-width: 640px) {
          .container { flex-direction: column; text-align: center; }
        }
      </style>
      <div class="banner">
        <div class="container">
          <div class="text">
            Ta strona używa plików cookie w celu zapewnienia najlepszej jakości usług. 
            <a href="#">Dowiedz się więcej</a>
          </div>
          <div class="buttons">
            <button class="accept">Akceptuję</button>
            <button class="decline">Odrzuć</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('webowo-cookie-consent', WebowoCookieConsent);
