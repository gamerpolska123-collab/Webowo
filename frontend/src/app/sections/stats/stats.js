// ============================================
// Webowo v3.1 – Stats Section
// ============================================

class WebowoSectionStats extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.observeCounters();
  }

  observeCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-value');
          counters.forEach(counter => {
            const target = counter.dataset.value;
            this.animateCounter(counter, target);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.shadowRoot.querySelector('.stats'));
  }

  animateCounter(el, target) {
    const start = performance.now();
    const duration = 2000;
    const isPercent = target.includes('%');
    const isPlus = target.includes('+');
    const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));

    const update = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(numericValue * easeOut);

      let display = current.toString();
      if (isPlus) display += '+';
      if (isPercent) display += '%';
      el.textContent = display;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  render() {
    const data = this.data || {};
    const items = data.items || [
      { value: '50+', label: 'Projektów' },
      { value: '100%', label: 'Zadowolenia' },
      { value: '5+', label: 'Lat doświadczenia' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .stats {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }
        .stat-value {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }
        @media (max-width: 640px) {
          .grid { grid-template-columns: 1fr; }
        }
      </style>
      <section class="stats" id="stats" data-section="stats" data-animate>
        <div class="container">
          <div class="grid">
            ${items.map(item => `
              <div class="stat">
                <div class="stat-value" data-value="${item.value}">0</div>
                <div class="stat-label">${item.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-stats', WebowoSectionStats);
