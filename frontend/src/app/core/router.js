import { setState } from './state.js';

function navigate(path) {
  window.location.hash = path;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  setState('route', hash);
  if (hash.startsWith('#')) {
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export { initRouter, navigate };
