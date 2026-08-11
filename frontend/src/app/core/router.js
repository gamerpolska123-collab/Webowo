// ============================================
// Webowo v3.0 – Advanced Router
// History API + Hash fallback + Scroll management
// ============================================

import { setState, getState, subscribe } from './state.js';

const ROUTES = {
  '/': { title: 'Strona główna', section: 'hero' },
  '/about': { title: 'O mnie', section: 'about' },
  '/services': { title: 'Usługi', section: 'services' },
  '/portfolio': { title: 'Portfolio', section: 'portfolio' },
  '/process': { title: 'Proces', section: 'process' },
  '/pricing': { title: 'Cennik', section: 'pricing' },
  '/faq': { title: 'FAQ', section: 'faq' },
  '/contact': { title: 'Kontakt', section: 'contact' }
};

let scrollPosition = 0;
let isNavigating = false;

function getRoute() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    // Normalize hash to route key (about -> /about)
    const normalized = hash.startsWith('/') ? hash : '/' + hash;
    return normalized;
  }
  const path = window.location.pathname;
  return path === '/' ? '/' : path;
}

function updateTitle(route) {
  const info = ROUTES[route] || ROUTES['/'];
  const baseTitle = getState('siteTitle') || 'Matys WebDev';
  document.title = `${info.title} | ${baseTitle}`;
}

function scrollToSection(id, behavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) return false;
  const navHeight = document.querySelector('webowo-nav')?.offsetHeight || 72;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
  window.scrollTo({ top, behavior });
  return true;
}

function handleRoute() {
  if (isNavigating) return;
  const route = getRoute();
  setState('route', route);
  updateTitle(route);

  // Scroll to section if it's a hash anchor
  if (route.startsWith('#')) {
    const id = route.slice(1);
    requestAnimationFrame(() => scrollToSection(id));
    return;
  }

  // Map route to section
  const info = ROUTES[route];
  if (info) {
    requestAnimationFrame(() => scrollToSection(info.section));
  }
}

function navigate(path, options = {}) {
  const { replace = false, scroll = true } = options;
  isNavigating = true;

  if (path.startsWith('#')) {
    if (replace) {
      history.replaceState(null, '', path);
    } else {
      history.pushState(null, '', path);
    }
  } else if (path.startsWith('/')) {
    if (replace) {
      history.replaceState({ scrollPosition: window.scrollY }, '', path);
    } else {
      history.pushState({ scrollPosition: window.scrollY }, '', path);
    }
  } else {
    // Treat as section ID
    const hashPath = `#${path}`;
    if (replace) {
      history.replaceState(null, '', hashPath);
    } else {
      history.pushState(null, '', hashPath);
    }
  }

  handleRoute();

  if (scroll) {
    const route = getRoute();
    const info = ROUTES[route];
    if (info) {
      setTimeout(() => scrollToSection(info.section), 50);
    }
  }

  setTimeout(() => { isNavigating = false; }, 100);
}

function initRouter() {
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    handleRoute();
    if (e.state && e.state.scrollPosition !== undefined) {
      window.scrollTo({ top: e.state.scrollPosition, behavior: 'auto' });
    }
  });

  // Handle hash changes
  window.addEventListener('hashchange', handleRoute);

  // Intercept link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"], a[href^="/"]');
    if (!link) return;
    if (link.hasAttribute('data-external')) return;
    if (link.target === '_blank') return;

    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      navigate(href);
    } else if (href.startsWith('/') && !href.startsWith('/api') && !href.startsWith('/uploads')) {
      e.preventDefault();
      navigate(href);
    }
  });

  // Initial route
  handleRoute();

  // Update active nav on scroll
  const sections = Object.values(ROUTES).map(r => r.section).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const route = Object.entries(ROUTES).find(([, v]) => v.section === id)?.[0];
        if (route && !window.location.hash) {
          // Update URL without scrolling
          history.replaceState(null, '', route === '/' ? '/' : route);
          updateTitle(route);
        }
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  setTimeout(() => {
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }, 500);
}

export { initRouter, navigate, scrollToSection, ROUTES };
