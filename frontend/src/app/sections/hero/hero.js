// ============================================
// Section: Hero
// ============================================

class WebowoSectionHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || 'Tworzę nowoczesne strony, które';
    const subtitle = data.subtitle || 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.';
    const badge = data.badge || 'Dostępny do nowych projektów';
    const ctaPrimary = data.ctaPrimary || { label: 'Bezpłatna wycena', href: '#contact' };
    const ctaSecondary = data.ctaSecondary || { label: 'Zobacz realizacje', href: '#portfolio' };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; position: relative; overflow: hidden; }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(0,92,230,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(0,212,170,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(0,212,170,0.1); color: var(--color-accent); padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.875rem; font-weight: 500; margin-bottom: 1.5rem; }
        h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.1; margin: 0 0 1rem; background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { font-size: 1.25rem; color: var(--color-muted); max-width: 600px; margin: 0 auto 2rem; }
        .ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .cta-primary { background: var(--color-primary); color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,92,230,0.3); }
        .cta-secondary { background: transparent; color: var(--color-text); padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; border: 2px solid var(--color-border); transition: all 0.2s; }
        .cta-secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }
      </style>
      <section class="hero" id="hero">
        <div>
          <div class="badge">🟢 ${badge}</div>
          <h1>${title}</h1>
          <p>${subtitle}</p>
          <div class="ctas">
            <a class="cta-primary" href="${ctaPrimary.href}">${ctaPrimary.label}</a>
            <a class="cta-secondary" href="${ctaSecondary.href}">${ctaSecondary.label}</a>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('webowo-section-hero', WebowoSectionHero);
