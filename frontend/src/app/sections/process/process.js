// ============================================
// Section: Process
// ============================================

class WebowoSectionProcess extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || 'Proces współpracy';
    const steps = data.steps || [
      { title: 'Konsultacja', desc: 'Omawiamy Twoje potrzeby i cele.' },
      { title: 'Projekt', desc: 'Tworzę mockupy i prototypy.' },
      { title: 'Development', desc: 'Kodowanie zgodnie z najlepszymi praktykami.' },
      { title: 'Wdrożenie', desc: 'Deploy, testy, szkolenie.' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; background: var(--color-surface); }
        .process { max-width: 1200px; margin: 0 auto; }
        h2 { font-size: 2.5rem; font-weight: 800; text-align: center; margin: 0 0 3rem; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; position: relative; }
        .step { text-align: center; padding: 2rem; position: relative; }
        .step-num { width: 48px; height: 48px; background: var(--color-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; margin: 0 auto 1rem; }
        h3 { margin: 0 0 0.5rem; font-size: 1.25rem; }
        p { margin: 0; color: var(--color-muted); }
      </style>
      <section class="process" id="process">
        <h2>${title}</h2>
        <div class="steps">
          ${steps.map((step, i) => `
            <div class="step">
              <div class="step-num">${i + 1}</div>
              <h3>${step.title}</h3>
              <p>${step.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}
customElements.define('webowo-section-process', WebowoSectionProcess);
