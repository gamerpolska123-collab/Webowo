// ============================================
// Webowo v3.0 – Hero Section
// Cinematic, animated, with particle background
// ============================================

import { t } from '../../core/i18n.js';

class WebowoSectionHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onI18nChange = () => {
      this.render();
      // Re-initialize particles after DOM update
      requestAnimationFrame(() => this._initParticles());
    };
    this._particles = [];
    this._rafId = null;
    this._resizeHandler = null;
  }

  connectedCallback() {
    this.render();
    window.addEventListener('i18n:changed', this._onI18nChange);
    this._initParticles();
  }

  disconnectedCallback() {
    window.removeEventListener('i18n:changed', this._onI18nChange);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
  }

  _initParticles() {
    const canvas = this.shadowRoot.querySelector('.particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Remove old resize handler if exists
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
    };
    this._resizeHandler = resize;
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    const particleCount = Math.min(50, Math.floor(canvas.width / 30));
    this._particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width / dpr,
      y: Math.random() * canvas.height / dpr,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const animate = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      this._particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 92, 230, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < this._particles.length; j++) {
          const p2 = this._particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 92, 230, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      this._rafId = requestAnimationFrame(animate);
    };
    animate();
  }

  render() {
    const data = this.data || {};
    const title = data.title || t('hero_title') || 'Tworzę nowoczesne strony, które';
    const subtitle = data.subtitle || t('hero_subtitle') || 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.';
    const badge = data.badge || t('hero_badge') || 'Dostępny do nowych projektów';
    const ctaPrimary = data.ctaPrimary || { label: t('hero_cta_primary') || 'Bezpłatna wycena', href: '#contact' };
    const ctaSecondary = data.ctaSecondary || { label: t('hero_cta_secondary') || 'Zobacz realizacje', href: '#portfolio' };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; overflow: hidden; }
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: var(--gradient-hero);
          padding: var(--space-16) var(--container-padding);
        }
        .particles-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 92, 230, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 92, 230, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          animation: hero-fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: rgba(0, 212, 170, 0.1);
          color: var(--color-accent-600);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 600;
          margin-bottom: var(--space-6);
          border: 1px solid rgba(0, 212, 170, 0.2);
          animation: hero-fade-in 1s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-badge-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent-500);
          border-radius: 50%;
          animation: pulse-glow 2s infinite;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.05;
          margin: 0 0 var(--space-6);
          letter-spacing: -0.03em;
          animation: hero-fade-in 1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-title .gradient {
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          color: var(--color-muted);
          max-width: 600px;
          margin: 0 auto var(--space-8);
          line-height: 1.7;
          animation: hero-fade-in 1s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-ctas {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
          animation: hero-fade-in 1s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--gradient-primary);
          color: white;
          padding: var(--space-4) var(--space-8);
          border-radius: var(--radius-xl);
          text-decoration: none;
          font-weight: 700;
          font-size: var(--text-base);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
          box-shadow: 0 8px 24px rgba(0, 92, 230, 0.35);
        }
        .hero-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 92, 230, 0.45);
        }
        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: transparent;
          color: var(--color-text);
          padding: var(--space-4) var(--space-8);
          border-radius: var(--radius-xl);
          text-decoration: none;
          font-weight: 700;
          font-size: var(--text-base);
          border: 2px solid var(--color-border);
          transition: all var(--transition-fast);
        }
        .hero-cta-secondary:hover {
          border-color: var(--color-primary-500);
          color: var(--color-primary-500);
          background: var(--color-primary-50);
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: var(--space-12);
          margin-top: var(--space-16);
          animation: hero-fade-in 1s 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-stat {
          text-align: center;
        }
        .hero-stat-value {
          font-size: var(--text-3xl);
          font-weight: 900;
          color: var(--color-text);
          line-height: 1;
        }
        .hero-stat-label {
          font-size: var(--text-sm);
          color: var(--color-muted);
          margin-top: var(--space-1);
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: var(--space-8);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-muted);
          font-size: var(--text-xs);
          font-weight: 500;
          animation: hero-fade-in 1s 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          cursor: pointer;
          transition: color var(--transition-fast);
        }
        .hero-scroll-indicator:hover {
          color: var(--color-primary-500);
        }
        .hero-scroll-indicator svg {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
        @media (max-width: 768px) {
          .hero-stats { gap: var(--space-6); }
          .hero-stat-value { font-size: var(--text-2xl); }
        }
      </style>
      <section class="hero" id="hero">
        <canvas class="particles-canvas"></canvas>
        <div class="hero-grid"></div>
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            ${badge}
          </div>
          <h1 class="hero-title">
            ${title}<br><span class="gradient">przynoszą rezultaty</span>
          </h1>
          <p class="hero-subtitle">${subtitle}</p>
          <div class="hero-ctas">
            <a class="hero-cta-primary" href="${ctaPrimary.href}" data-track="hero_cta_primary">
              ${ctaPrimary.label}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a class="hero-cta-secondary" href="${ctaSecondary.href}" data-track="hero_cta_secondary">
              ${ctaSecondary.label}
            </a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value" data-count-target="50" data-count-suffix="+">50+</div>
              <div class="hero-stat-label">Projektów</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" data-count-target="100" data-count-suffix="%">100%</div>
              <div class="hero-stat-label">Zadowolenia</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" data-count-target="5" data-count-suffix="+">5+</div>
              <div class="hero-stat-label">Lat doświadczenia</div>
            </div>
          </div>
        </div>
        <div class="hero-scroll-indicator" onclick="document.getElementById('about').scrollIntoView({behavior:'smooth'})">
          <span>Przewiń w dół</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-hero', WebowoSectionHero);
