// ============================================
// Webowo v3.1 – Testimonials Section
// ============================================

class WebowoSectionTestimonials extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Opinie klientów';
    const subtitle = data.subtitle || 'Co mówią o współpracy';
    const items = data.items || [
      { name: 'Anna Kowalska', role: 'CEO, TechStart', text: 'Patryk stworzył dla nas stronę, która przekroczyła wszystkie oczekiwania. Profesjonalizm, terminowość i dbałość o szczegóły na najwyższym poziomie.', rating: 5 },
      { name: 'Marek Nowak', role: 'Dyrektor Marketingu, BuildCorp', text: 'Współpraca była bezproblemowa od pierwszego kontaktu. Strona działa szybko, wygląda świetnie i przynosi realne wyniki biznesowe.', rating: 5 },
      { name: 'Katarzyna Wiśniewska', role: 'Właścicielka, ArtStudio', text: 'Polecam z całego serca! Patryk nie tylko zaprojektował stronę, ale też doradził w kwestii SEO i optymalizacji.', rating: 5 }
    ];

    const starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .testimonials {
          padding: 6rem 0;
          background: #f8fafc;
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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2rem;
          transition: all 250ms ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .text {
          font-size: 1rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #005ce6, #00d4aa);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
        }
        .name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.9375rem;
        }
        .role {
          font-size: 0.875rem;
          color: #64748b;
        }
      </style>
      <section class="testimonials" id="testimonials" data-section="testimonials" data-animate>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="grid">
            ${items.map(item => `
              <div class="card">
                <div class="stars">${Array(item.rating || 5).fill(starSvg).join('')}</div>
                <p class="text">"${item.text}"</p>
                <div class="author">
                  <div class="avatar">${item.name.charAt(0)}</div>
                  <div>
                    <div class="name">${item.name}</div>
                    <div class="role">${item.role}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-testimonials', WebowoSectionTestimonials);
