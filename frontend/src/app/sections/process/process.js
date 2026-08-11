// ============================================
// Webowo v3.0 – Process Section
// Timeline with animated steps
// ============================================

import { t } from '../../core/i18n.js';

const STEP_ICONS = [
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
];

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
    const title = data.title || t('process_title') || 'Proces współpracy';
    const subtitle = data.subtitle || 'Od pomysłu do wdrożenia w 4 krokach';
    const steps = data.steps || [
      { number: '01', title: 'Konsultacja', desc: 'Omawiamy Twoje potrzeby, cele biznesowe i oczekiwania. Przygotowuję wstępną wycenę i harmonogram.' },
      { number: '02', title: 'Projekt', desc: 'Tworzę mockupy, prototypy interaktywne i style guide. Iterujemy do pełnej akceptacji.' },
      { number: '03', title: 'Development', desc: 'Kodowanie zgodnie z najlepszymi praktykami. Code review, testy automatyczne, CI/CD.' },
      { number: '04', title: 'Wdrożenie', desc: 'Deploy na produkcję, monitoring, szkolenie z obsługi CMS i 30-dniowe wsparcie.' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .process {
          padding: var(--space-24) var(--container-padding);
          background: var(--color-surface);
          position: relative;
          overflow: hidden;
        }
        .process-inner {
          max-width: var(--container-max);
          margin: 0 auto;
        }
        .process-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto var(--space-16);
        }
        .process-label {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-primary-500);
          font-size: var(--text-sm);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-4);
        }
        .process-label::before {
          content: '';
          width: 24px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
        .process-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 var(--space-4);
        }
        .process-subtitle {
          font-size: var(--text-lg);
          color: var(--color-muted);
          line-height: 1.7;
        }
        .process-timeline {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }
        .process-timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--color-primary-200), var(--color-accent-200));
          transform: translateX(-50%);
        }
        .process-step {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: center;
          margin-bottom: var(--space-12);
          position: relative;
        }
        .process-step:last-child {
          margin-bottom: 0;
        }
        .process-step:nth-child(even) .process-step-content {
          order: -1;
          text-align: right;
        }
        .process-step:nth-child(even) .process-step-number {
          left: auto;
          right: calc(50% - 28px);
        }
        .process-step-number {
          position: absolute;
          left: calc(50% - 28px);
          top: 0;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-lg);
          font-weight: 900;
          box-shadow: var(--shadow-lg);
          z-index: 1;
        }
        .process-step-content {
          padding: var(--space-6);
        }
        .process-step-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xl);
          background: var(--color-primary-50);
          color: var(--color-primary-500);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-4);
        }
        .process-step-title {
          font-size: var(--text-2xl);
          font-weight: 800;
          margin: 0 0 var(--space-3);
        }
        .process-step-desc {
          font-size: var(--text-base);
          color: var(--color-muted);
          line-height: 1.7;
          margin: 0;
        }
        @media (max-width: 768px) {
          .process-timeline::before { left: 24px; }
          .process-step { grid-template-columns: 1fr; gap: var(--space-6); padding-left: 64px; }
          .process-step:nth-child(even) .process-step-content { order: 0; text-align: left; }
          .process-step-number { left: 0 !important; right: auto !important; width: 48px; height: 48px; font-size: var(--text-base); }
          .process-step-content { padding: 0; }
        }
      </style>
      <section class="process" id="process">
        <div class="process-inner">
          <div class="process-header">
            <div class="process-label">Proces</div>
            <h2 class="process-title">${title}</h2>
            <p class="process-subtitle">${subtitle}</p>
          </div>
          <div class="process-timeline">
            ${steps.map((step, i) => `
              <div class="process-step" data-animate data-animate-delay="${i + 1}">
                <div class="process-step-number">${step.number}</div>
                <div class="process-step-content">
                  <div class="process-step-icon">${STEP_ICONS[i] || ''}</div>
                  <h3 class="process-step-title">${step.title}</h3>
                  <p class="process-step-desc">${step.desc}</p>
                </div>
                <div></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-process', WebowoSectionProcess);
