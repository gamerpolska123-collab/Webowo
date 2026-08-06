// ============================================
// Web Component: Skeleton Loader
// ============================================

class WebowoSkeleton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const lines = parseInt(this.getAttribute('lines') || '3');
    const width = this.getAttribute('width') || '100%';
    let html = '<style>';
    html += ':host { display: block; }';
    html += '.skeleton { background: linear-gradient(90deg, var(--color-border) 25%, var(--color-surface) 50%, var(--color-border) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 0.25rem; height: 1rem; margin-bottom: 0.5rem; }';
    html += '@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }';
    html += '</style>';
    for (let i = 0; i < lines; i++) {
      const w = i === lines - 1 ? '60%' : width;
      html += `<div class="skeleton" style="width:${w}"></div>`;
    }
    this.shadowRoot.innerHTML = html;
  }
}
customElements.define('webowo-skeleton', WebowoSkeleton);
