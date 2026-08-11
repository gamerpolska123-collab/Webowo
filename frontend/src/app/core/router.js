// ============================================
// Webowo v3.1 – Router
// ============================================

let currentRoute = '/';
const routeListeners = new Set();

export function initRouter() {
  // Handle hash changes for SPA sections
  window.addEventListener('hashchange', () => {
    const route = getRoute();
    navigate(route);
  });

  // Handle clicks on internal links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        navigate(href.slice(1));
      }
    }
  });

  // Initial route
  const initial = getRoute();
  if (initial && initial !== '/') {
    setTimeout(() => navigate(initial, false), 100);
  }
}

export function getRoute() {
  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    return hash.slice(1).replace(/^\//, '');
  }
  return '/';
}

export function navigate(route, updateHash = true) {
  if (route === currentRoute) return;
  currentRoute = route;

  if (updateHash) {
    window.location.hash = route;
  }

  // Scroll to section
  const sectionId = route === '/' ? 'hero' : route;
  const section = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  routeListeners.forEach(cb => cb(route));
}

export function subscribeToRoute(callback) {
  routeListeners.add(callback);
  return () => routeListeners.delete(callback);
}
