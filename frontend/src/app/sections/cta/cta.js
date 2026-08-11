// ============================================
// Webowo v3.1 – CTA Section
// ============================================

class WebowoSectionCta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Gotowy na nową stronę?';
    const subtitle = data.subtitle || 'Skontaktuj się ze mną i rozpocznijmy współpracę już dziś.';
    const ctaText = data.ctaText || 'Bezpłatna wycena';
    const ctaHref = data.ctaHref || '#contact';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .cta {
          padding: 5rem 0;
          background: linear-gradient(135deg, #005ce6 0%, #0047b3 100%);
          position: relative;
          overflow: hidden;
        }
        .cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
          position: relative;
          z-index: 1;
          text-align: center;
        }
        h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.125rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #005ce6;
          padding: 1rem 2.5rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 150ms;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
      </style>
      <section class="cta" id="cta" data-section="cta" data-animate>
        <div class="container">
          <h2>${title}</h2>
          <p>${subtitle}</p>
          <a href="${ctaHref}" class="btn">${ctaText}</a>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-cta', WebowoSectionCta);
