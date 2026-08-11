// ============================================
// Webowo v3.1 – Pricing Section
// ============================================

class WebowoSectionPricing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Cennik';
    const subtitle = data.subtitle || 'Przejrzyste pakiety dopasowane do potrzeb';
    const plans = data.plans || [
      { name: 'Starter', price: '999', period: 'PLN', description: 'Idealny dla małych firm', features: ['1 strona landing page', 'Responsywność', 'Podstawowe SEO', 'Formularz kontaktowy', 'Hosting 1 rok'], popular: false },
      { name: 'Professional', price: '2 499', period: 'PLN', description: 'Najpopularniejszy wybór', features: ['Do 5 podstron', 'Panel CMS', 'Zaawansowane SEO', 'Analityka GA4', 'Wsparcie 30 dni', 'SSL + CDN'], popular: true },
      { name: 'Enterprise', price: 'Custom', period: '', description: 'Dedykowane rozwiązania', features: ['Dedykowane rozwiązanie', 'API + Integracje', 'Priorytetowe wsparcie', 'SLA 99.9%', 'Dedykowany opiekun', 'Audyt bezpieczeństwa'], popular: false }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .pricing {
          padding: 6rem 0;
          background: #ffffff;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
        }
        .header {
          text-align: center;
          margin-bottom: 4rem;
        }
        h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .subtitle {
          font-size: 1.125rem;
          color: #64748b;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          align-items: start;
        }
        .card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 1.5rem;
          padding: 2.5rem;
          position: relative;
          transition: all 250ms ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .card.popular {
          border-color: #005ce6;
          box-shadow: 0 0 40px rgba(0, 92, 230, 0.1);
          transform: scale(1.02);
        }
        .card.popular:hover {
          transform: scale(1.02) translateY(-4px);
        }
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #005ce6, #0047b3);
          color: white;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .plan-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .price {
          font-size: 3rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .price-period {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }
        .description {
          color: #64748b;
          margin: 1rem 0 1.5rem;
          font-size: 0.9375rem;
        }
        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
        }
        .features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: #475569;
          font-size: 0.9375rem;
        }
        .features li::before {
          content: '';
          width: 20px;
          height: 20px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300d4aa' stroke-width='3'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") center/contain no-repeat;
          flex-shrink: 0;
        }
        .cta {
          display: block;
          width: 100%;
          padding: 0.875rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: all 150ms;
          border: 2px solid transparent;
        }
        .cta-primary {
          background: linear-gradient(135deg, #005ce6, #0047b3);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 92, 230, 0.3);
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 92, 230, 0.4);
        }
        .cta-secondary {
          background: transparent;
          color: #0f172a;
          border-color: #e2e8f0;
        }
        .cta-secondary:hover {
          border-color: #005ce6;
          color: #005ce6;
          background: #eff6ff;
        }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; }
          .card.popular { transform: none; }
          .card.popular:hover { transform: translateY(-4px); }
        }
      </style>
      <section class="pricing" id="pricing" data-section="pricing" data-animate>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="grid">
            ${plans.map(plan => `
              <div class="card ${plan.popular ? 'popular' : ''}">
                ${plan.popular ? '<div class="popular-badge">Najpopularniejszy</div>' : ''}
                <div class="plan-name">${plan.name}</div>
                <div class="price">${plan.price}</div>
                <div class="price-period">${plan.period}</div>
                <p class="description">${plan.description}</p>
                <ul class="features">
                  ${plan.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <a href="#contact" class="cta ${plan.popular ? 'cta-primary' : 'cta-secondary'}">
                  ${plan.price === 'Custom' ? 'Skontaktuj się' : 'Wybieram ten pakiet'}
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-pricing', WebowoSectionPricing);
