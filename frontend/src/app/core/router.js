// ============================================
// Hash-based SPA Router
// ============================================

import { getState, setState } from './state.js';

const routes = {
  '/': () => import('../sections/hero/hero.js'),
  '/about': () => import('../sections/about/about.js'),
  '/services': () => import('../sections/services/services.js'),
  '/portfolio': () => import('../sections/portfolio/portfolio.js'),
  '/contact': () => import('../sections/contact/contact.js'),
  '/admin': () => import('../admin/app.js')
};

function navigate(path) {
  window.location.hash = path;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  setState('route', hash);

  // Scroll to section
  if (hash.startsWith('/#')) {
    const id = hash.split('#')[1];
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export { initRouter, navigate };
