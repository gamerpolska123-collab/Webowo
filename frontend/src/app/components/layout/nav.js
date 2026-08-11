// ============================================
// Webowo v3.1 – Navigation Component
// ============================================

class WebowoNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isScrolled = false;
    this.isMenuOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  setupEvents() {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== this.isScrolled) {
        this.isScrolled = scrolled;
        this.updateNavStyle();
      }
    });

    this.shadowRoot.querySelector('.menu-toggle')?.addEventListener('click', () => {
      this.isMenuOpen = !this.isMenuOpen;
      this.updateMenuState();
    });

    this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.isMenuOpen = false;
        this.updateMenuState();
      });
    });
  }

  updateNavStyle() {
    const nav = this.shadowRoot.querySelector('nav');
    if (!nav) return;
    if (this.isScrolled) {
      nav.style.background = 'rgba(255,255,255,0.85)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.boxShadow = 'none';
    }
  }

  updateMenuState() {
    const menu = this.shadowRoot.querySelector('.mobile-menu');
    if (menu) {
      menu.style.display = this.isMenuOpen ? 'flex' : 'none';
    }
    const toggle = this.shadowRoot.querySelector('.menu-toggle');
    if (toggle) {
      toggle.innerHTML = this.isMenuOpen 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: sticky; top: 0; z-index: 100; }
        nav {
          transition: all 300ms ease;
          padding: 1rem 0;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 3rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .brand-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #005ce6, #0047b3);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1rem;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          transition: color 150ms;
          position: relative;
        }
        .nav-link:hover { color: #0f172a; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #005ce6;
          transition: width 250ms ease;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-cta {
          background: linear-gradient(135deg, #005ce6, #0047b3);
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 150ms;
          box-shadow: 0 4px 12px rgba(0, 92, 230, 0.3);
        }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 92, 230, 0.4);
        }
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #0f172a;
          padding: 0.5rem;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 1rem;
          margin-top: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .menu-toggle { display: block; }
        }
      </style>
      <nav>
        <div class="container">
          <a href="#" class="brand">
            <div class="brand-icon">M</div>
            Matys WebDev
          </a>
          <div class="nav-links">
            <a href="#about" class="nav-link">O mnie</a>
            <a href="#services" class="nav-link">Usługi</a>
            <a href="#portfolio" class="nav-link">Portfolio</a>
            <a href="#pricing" class="nav-link">Cennik</a>
            <a href="#faq" class="nav-link">FAQ</a>
            <a href="#contact" class="nav-cta">Kontakt</a>
          </div>
          <button class="menu-toggle" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="mobile-menu">
          <a href="#about" class="nav-link">O mnie</a>
          <a href="#services" class="nav-link">Usługi</a>
          <a href="#portfolio" class="nav-link">Portfolio</a>
          <a href="#pricing" class="nav-link">Cennik</a>
          <a href="#faq" class="nav-link">FAQ</a>
          <a href="#contact" class="nav-cta">Kontakt</a>
        </div>
      </nav>
    `;
  }
}

customElements.define('webowo-nav', WebowoNav);
