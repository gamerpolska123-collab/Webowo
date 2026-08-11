// ============================================
// Webowo v3.1 – Process Section
// ============================================

class WebowoSectionProcess extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Proces współpracy';
    const subtitle = data.subtitle || 'Od pomysłu do wdrożenia w 4 krokach';
    const steps = data.steps || [
      { number: '01', title: 'Konsultacja', desc: 'Omawiamy Twoje potrzeby, cele biznesowe i oczekiwania.' },
      { number: '02', title: 'Projekt', desc: 'Tworzę mockupy, prototypy interaktywne i style guide.' },
      { number: '03', title: 'Development', desc: 'Kodowanie zgodnie z najlepszymi praktykami.' },
      { number: '04', title: 'Wdrożenie', desc: 'Deploy na produkcję, monitoring, szkolenie z obsługi CMS.' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .process {
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
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          position: relative;
        }
        .step {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 2rem;
          position: relative;
          transition: all 250ms ease;
        }
        .step:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          border-color: #005ce6;
        }
        .step-number {
          font-size: 3rem;
          font-weight: 900;
          color: #005ce6;
          opacity: 0.2;
          line-height: 1;
          margin-bottom: 1rem;
        }
        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        p {
          color: #64748b;
          line-height: 1.7;
          font-size: 0.9375rem;
        }
        .connector {
          display: none;
        }
        @media (min-width: 768px) {
          .steps { grid-template-columns: repeat(4, 1fr); }
        }
      </style>
      <section class="process" id="process" data-section="process" data-animate>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="steps">
            ${steps.map(step => `
              <div class="step">
                <div class="step-number">${step.number}</div>
                <h3>${step.title}</h3>
                <p>${step.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-process', WebowoSectionProcess);
