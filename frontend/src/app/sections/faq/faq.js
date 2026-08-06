// ============================================
// Section: FAQ
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionFaq extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const data = this.data || {};
    const title = data.title || t('faq_title');
    const items = data.items || [
      { q: t('faq_q1'), a: t('faq_a1') },
      { q: t('faq_q2'), a: t('faq_a2') },
      { q: t('faq_q3'), a: t('faq_a3') },
      { q: t('faq_q4'), a: t('faq_a4') }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 6rem 2rem; background: var(--color-surface); }
        .faq { max-width: 800px; margin: 0 auto; }
        h2 { font-size: 2.5rem; font-weight: 800; text-align: center; margin: 0 0 3rem; }
        .item { border-bottom: 1px solid var(--color-border); }
        .question { width: 100%; background: none; border: none; padding: 1.5rem 0; text-align: left; font-size: 1.125rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--color-text); }
        .question::after { content: '+'; font-size: 1.5rem; color: var(--color-primary); transition: transform 0.3s; }
        .question.open::after { content: '−'; }
        .answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; color: var(--color-muted); line-height: 1.6; }
        .answer.open { max-height: 200px; padding-bottom: 1.5rem; }
      </style>
      <section class="faq" id="faq">
        <h2>${title}</h2>
        <div class="items">
          ${items.map(item => `
            <div class="item">
              <button class="question">${item.q}</button>
              <div class="answer">${item.a}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    this.shadowRoot.querySelectorAll('.question').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = answer.classList.contains('open');
        this.shadowRoot.querySelectorAll('.answer').forEach(a => a.classList.remove('open'));
        this.shadowRoot.querySelectorAll('.question').forEach(q => q.classList.remove('open'));
        if (!isOpen) {
          answer.classList.add('open');
          btn.classList.add('open');
        }
      });
    });
  }
}
customElements.define('webowo-section-faq', WebowoSectionFaq);
