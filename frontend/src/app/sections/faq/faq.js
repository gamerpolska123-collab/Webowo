// ============================================
// Webowo v3.1 – FAQ Section
// ============================================

class WebowoSectionFaq extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.openIndex = -1;
  }

  connectedCallback() {
    this.render();
    this.setupAccordion();
  }

  setupAccordion() {
    const items = this.shadowRoot.querySelectorAll('.faq-item');
    items.forEach((item, index) => {
      const question = item.querySelector('.question');
      question.addEventListener('click', () => {
        if (this.openIndex === index) {
          this.openIndex = -1;
          item.classList.remove('open');
        } else {
          items.forEach(i => i.classList.remove('open'));
          this.openIndex = index;
          item.classList.add('open');
        }
      });
    });
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Często zadawane pytania';
    const subtitle = data.subtitle || 'Masz wątpliwości? Sprawdź odpowiedzi';
    const items = data.items || [
      { q: 'Ile trwa realizacja strony?', a: 'Standardowy projekt trwa 2-4 tygodnie. Zależy to od złożoności, ilości podstron i dostępności materiałów.' },
      { q: 'Czy strona będzie responsywna?', a: 'Tak, wszystkie strony są projektowane w podejściu mobile-first. Testuję na rzeczywistych urządzeniach.' },
      { q: 'Czy oferujesz wsparcie po wdrożeniu?', a: 'Tak, oferuję pakiety wsparcia technicznego: Basic, Professional i Enterprise.' },
      { q: 'Jakie technologie używasz?', a: 'Nowoczesny stack: React/Vue/Svelte, Node.js, PostgreSQL/MongoDB, Docker, AWS/Vercel.' },
      { q: 'Czy mogę sam edytować treści?', a: 'Tak, każdy projekt zawiera dedykowany panel CMS z edytorem WYSIWYG.' },
      { q: 'Czy oferujesz hosting?', a: 'Tak, oferuję hosting zarządzany na Vercel/Netlify/Cloudflare z automatycznymi backupami, CDN i certyfikatem SSL.' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .faq {
          padding: 6rem 0;
          background: #ffffff;
        }
        .container {
          max-width: 800px;
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
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .faq-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 200ms ease;
        }
        .faq-item:hover {
          border-color: #cbd5e1;
        }
        .question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          font-weight: 600;
          color: #0f172a;
          font-size: 1rem;
          user-select: none;
        }
        .question:hover { color: #005ce6; }
        .icon {
          width: 20px;
          height: 20px;
          transition: transform 300ms ease;
          flex-shrink: 0;
          margin-left: 1rem;
        }
        .faq-item.open .icon { transform: rotate(180deg); }
        .answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 300ms ease, padding 300ms ease;
        }
        .faq-item.open .answer {
          max-height: 500px;
          padding: 0 1.5rem 1.25rem;
        }
        .answer p {
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }
      </style>
      <section class="faq" id="faq" data-section="faq" data-animate>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="faq-list">
            ${items.map((item, i) => `
              <div class="faq-item ${i === 0 ? 'open' : ''}">
                <div class="question">
                  ${item.q}
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                <div class="answer">
                  <p>${item.a}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-faq', WebowoSectionFaq);
