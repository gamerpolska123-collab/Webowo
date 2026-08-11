// ============================================
// Webowo v3.0 – Professional Navigation
// Sticky, scroll-aware, mobile menu, theme toggle, progress bar
// ============================================

import { t } from '../../core/i18n.js';
import { getState, setState, subscribe } from '../../core/state.js';
import { scrollTo } from '../../core/animations.js';

class WebowoNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._scrollY = 0;
    this._isScrolled = false;
    this._mobileOpen = false;
    this._unsubscribers = [];
  }

  connectedCallback() {
    this.render();
    this._setupScrollListener();
    this._setupKeyboard();
    this._setupThemeToggle();

    // Subscribe to state changes
    this._unsubscribers.push(
      subscribe('locale', () => this._updateActiveLink()),
      subscribe('route', () => this._updateActiveLink())
    );
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this._onScroll);
    this._unsubscribers.forEach(u => u());
  }

  _setupScrollListener() {
    this._onScroll = () => {
      const y = window.scrollY;
      const nav = this.shadowRoot.querySelector('.nav');
      const progress = this.shadowRoot.querySelector('.progress-bar');

      // Sticky state
      if (y > 50 && !this._isScrolled) {
        this._isScrolled = true;
        nav?.classList.add('is-scrolled');
      } else if (y <= 50 && this._isScrolled) {
        this._isScrolled = false;
        nav?.classList.remove('is-scrolled');
      }

      // Scroll progress
      if (progress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
        progress.style.width = `${pct}%`;
      }

      // Hide/show on scroll direction
      const direction = y > this._scrollY ? 'down' : 'up';
      if (y > 200) {
        if (direction === 'down' && y > this._scrollY + 10) {
          nav?.classList.add('is-hidden');
        } else {
          nav?.classList.remove('is-hidden');
        }
      } else {
        nav?.classList.remove('is-hidden');
      }
      this._scrollY = y;
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  _setupKeyboard() {
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._mobileOpen) {
        this._toggleMobile(false);
      }
    });
  }

  _setupThemeToggle() {
    const btn = this.shadowRoot.querySelector('.theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = getState('theme') || 'system';
      const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
      setState('theme', next);
      this._updateThemeIcon(next);
    });

    subscribe('theme', (theme) => this._updateThemeIcon(theme));
  }

  _updateThemeIcon(theme) {
    const btn = this.shadowRoot.querySelector('.theme-toggle');
    if (!btn) return;
    const icons = { light: '☀️', dark: '🌙', system: '🖥️' };
    btn.textContent = icons[theme] || '🖥️';
    btn.setAttribute('aria-label', `Motyw: ${theme}`);
  }

  _updateActiveLink() {
    const route = getState('route') || '/';
    this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === route || (route === '/' && href === '#hero');
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  _toggleMobile(force) {
    this._mobileOpen = force !== undefined ? force : !this._mobileOpen;
    const overlay = this.shadowRoot.querySelector('.mobile-overlay');
    const menu = this.shadowRoot.querySelector('.mobile-menu');
    const btn = this.shadowRoot.querySelector('.mobile-toggle');

    if (this._mobileOpen) {
      overlay?.classList.add('is-open');
      menu?.classList.add('is-open');
      btn?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      overlay?.classList.remove('is-open');
      menu?.classList.remove('is-open');
      btn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  render() {
    const navItems = [
      { label: t('nav_about') || 'O mnie', href: '#about' },
      { label: t('nav_services') || 'Usługi', href: '#services' },
      { label: t('nav_portfolio') || 'Portfolio', href: '#portfolio' },
      { label: t('nav_process') || 'Proces', href: '#process' },
      { label: t('nav_pricing') || 'Cennik', href: '#pricing' },
      { label: t('nav_faq') || 'FAQ', href: '#faq' },
      { label: t('nav_contact') || 'Kontakt', href: '#contact' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: sticky; top: 0; z-index: var(--z-sticky); }

        .nav {
          position: relative;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid transparent;
          transition: background var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
        }
        .nav.is-scrolled {
          background: rgba(255, 255, 255, 0.95);
          border-bottom-color: var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        .nav.is-hidden {
          transform: translateY(-100%);
        }

        [data-theme="dark"] .nav,
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .nav {
            background: rgba(15, 23, 42, 0.8);
          }
          :root:not([data-theme="light"]) .nav.is-scrolled {
            background: rgba(15, 23, 42, 0.95);
          }
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: var(--gradient-accent);
          width: 0%;
          transition: width 0.1s linear;
          z-index: 1;
        }

        .nav-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          font-weight: 800;
          font-size: var(--text-xl);
          color: var(--color-text);
          letter-spacing: -0.02em;
        }
        .brand-logo {
          width: 36px;
          height: 36px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 0.875rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-link {
          display: block;
          padding: var(--space-2) var(--space-3);
          color: var(--color-muted);
          font-size: var(--text-sm);
          font-weight: 500;
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: color var(--transition-fast), background var(--transition-fast);
          position: relative;
        }
        .nav-link:hover {
          color: var(--color-text);
          background: var(--color-surface);
        }
        .nav-link.is-active {
          color: var(--color-primary-500);
          font-weight: 600;
        }
        .nav-link.is-active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .theme-toggle {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .theme-toggle:hover {
          background: var(--color-surface);
          border-color: var(--color-primary-300);
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--gradient-primary);
          color: white;
          font-size: var(--text-sm);
          font-weight: 600;
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
          box-shadow: 0 4px 12px rgba(0, 92, 230, 0.25);
        }
        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 92, 230, 0.35);
        }

        .mobile-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          background: transparent;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0;
        }
        .mobile-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--color-text);
          border-radius: var(--radius-full);
          transition: transform var(--transition-base), opacity var(--transition-base);
        }
        .mobile-toggle[aria-expanded="true"] span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .mobile-toggle[aria-expanded="true"] span:nth-child(2) {
          opacity: 0;
        }
        .mobile-toggle[aria-expanded="true"] span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: var(--z-modal-backdrop);
          opacity: 0;
          transition: opacity var(--transition-base);
        }
        .mobile-overlay.is-open {
          display: block;
          opacity: 1;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          width: min(320px, 85vw);
          height: 100vh;
          background: var(--color-bg);
          border-left: 1px solid var(--color-border);
          z-index: var(--z-modal);
          padding: calc(var(--nav-height) + var(--space-6)) var(--space-6) var(--space-6);
          transform: translateX(100%);
          transition: transform var(--transition-slow);
          overflow-y: auto;
        }
        .mobile-menu.is-open {
          display: block;
          transform: translateX(0);
        }
        .mobile-menu .nav-links {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2);
        }
        .mobile-menu .nav-link {
          font-size: var(--text-lg);
          padding: var(--space-3) 0;
          width: 100%;
          border-bottom: 1px solid var(--color-border-subtle);
          border-radius: 0;
        }
        .mobile-menu .nav-link.is-active::after {
          display: none;
        }
        .mobile-menu .nav-link.is-active {
          color: var(--color-primary-500);
        }
        .mobile-menu .nav-actions {
          margin-top: var(--space-6);
          flex-direction: column;
          width: 100%;
        }
        .mobile-menu .cta-btn {
          width: 100%;
          justify-content: center;
          padding: var(--space-3);
        }

        @media (max-width: 1024px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: flex; }
        }
        @media (min-width: 1025px) {
          .mobile-overlay, .mobile-menu { display: none !important; }
        }
      </style>

      <nav class="nav" role="navigation" aria-label="Główna nawigacja">
        <div class="progress-bar" aria-hidden="true"></div>
        <div class="nav-inner">
          <a class="brand" href="#hero" data-track="nav_brand">
            <span class="brand-logo">M</span>
            <span>Matys WebDev</span>
          </a>

          <div class="desktop-nav">
            <ul class="nav-links">
              ${navItems.map(item => `
                <li><a class="nav-link" href="${item.href}" data-track="nav_${item.href.replace('#', '')}">${item.label}</a></li>
              `).join('')}
            </ul>
          </div>

          <div class="nav-actions">
            <button class="theme-toggle" aria-label="Zmień motyw" title="Zmień motyw">🖥️</button>
            <a class="cta-btn hide-mobile" href="#contact" data-track="nav_cta">${t('nav_cta') || 'Bezpłatna wycena'}</a>
            <button class="mobile-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        <div class="mobile-overlay" aria-hidden="true"></div>
        <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu mobilne">
          <ul class="nav-links">
            ${navItems.map(item => `
              <li><a class="nav-link" href="${item.href}" data-track="nav_mobile_${item.href.replace('#', '')}">${item.label}</a></li>
            `).join('')}
          </ul>
          <div class="nav-actions">
            <a class="cta-btn" href="#contact" data-track="nav_mobile_cta">${t('nav_cta') || 'Bezpłatna wycena'}</a>
          </div>
        </div>
      </nav>
    `;

    // Event bindings
    this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (this._mobileOpen) this._toggleMobile(false);
      });
    });

    this.shadowRoot.querySelector('.mobile-toggle')?.addEventListener('click', () => {
      this._toggleMobile();
    });

    this.shadowRoot.querySelector('.mobile-overlay')?.addEventListener('click', () => {
      this._toggleMobile(false);
    });

    this._updateActiveLink();
    this._updateThemeIcon(getState('theme') || 'system');
  }
}

customElements.define('webowo-nav', WebowoNav);
