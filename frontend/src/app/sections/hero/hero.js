// ============================================
// Webowo v3.1 – Hero Section
// ============================================

class WebowoSectionHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initParticles();
  }

  initParticles() {
    const canvas = this.shadowRoot.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 92, 230, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    this._cleanup = () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }

  disconnectedCallback() {
    this._cleanup?.();
  }

  render() {
    const data = this.data || {};
    const title = data.title || 'Tworzę nowoczesne strony, które';
    const subtitle = data.subtitle || 'Profesjonalne strony internetowe, sklepy online i aplikacje webowe.';
    const badge = data.badge || 'Dostępny do nowych projektów';
    const ctaPrimary = data.ctaPrimary || { label: 'Bezpłatna wycena', href: '#contact' };
    const ctaSecondary = data.ctaSecondary || { label: 'Zobacz realizacje', href: '#portfolio' };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%);
        }
        canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          padding: 2rem;
          animation: fade-in-up 0.8s ease-out;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.3);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #059669;
          margin-bottom: 1.5rem;
        }
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #00d4aa;
          border-radius: 50%;
          animation: pulse-glow 2s infinite;
        }
        h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        .gradient-text {
          background: linear-gradient(135deg, #005ce6 0%, #00d4aa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #64748b;
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-primary {
          background: linear-gradient(135deg, #005ce6 0%, #0047b3 100%);
          color: white;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 150ms;
          box-shadow: 0 4px 12px rgba(0, 92, 230, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 92, 230, 0.4);
        }
        .btn-secondary {
          background: transparent;
          color: #0f172a;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid #e2e8f0;
          transition: all 150ms;
        }
        .btn-secondary:hover {
          border-color: #005ce6;
          color: #005ce6;
          background: #eff6ff;
        }
        .scroll-down {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          animation: fade-in 1s ease 1s both;
          cursor: pointer;
        }
        .scroll-down svg {
          animation: float 2s ease infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(0, 212, 170, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (max-width: 640px) {
          .ctas { flex-direction: column; }
          .ctas a { width: 100%; text-align: center; }
        }
      </style>
      <section class="hero" data-section="hero">
        <canvas></canvas>
        <div class="content">
          <div class="badge">
            <span class="badge-dot"></span>
            ${badge}
          </div>
          <h1>
            ${title}<br>
            <span class="gradient-text">przynoszą rezultaty</span>
          </h1>
          <p class="subtitle">${subtitle}</p>
          <div class="ctas">
            <a href="${ctaPrimary.href}" class="btn-primary">${ctaPrimary.label}</a>
            <a href="${ctaSecondary.href}" class="btn-secondary">${ctaSecondary.label}</a>
          </div>
        </div>
        <div class="scroll-down" onclick="document.getElementById('stats').scrollIntoView({behavior:'smooth'})">
          <span>Przewiń w dół</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </section>
    `;
  }
}

customElements.define('webowo-section-hero', WebowoSectionHero);
