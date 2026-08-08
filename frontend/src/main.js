// ============================================
// Webowo v3.0 – Main Entry Point
// Advanced initialization, theme, analytics, prefetch
// ============================================

import './styles/main.css';
import { initI18n, setLocale, getLocale } from './app/core/i18n.js';
import { initRouter, navigate } from './app/core/router.js';
import { initState, getState, setState, subscribe, persist } from './app/core/state.js';
import { initAnimations, observeSections, destroyAnimations } from './app/core/animations.js';
import { initRenderer, prefetchPage } from './app/core/renderer.js';

// Web Components – UI
import './app/components/ui/btn.js';
import './app/components/ui/card.js';
import './app/components/ui/input.js';
import './app/components/ui/modal.js';
import './app/components/ui/toast.js';
import './app/components/ui/skeleton.js';
import './app/components/ui/tooltip.js';
import './app/components/ui/badge.js';
import './app/components/ui/accordion.js';

// Web Components – Layout
import './app/components/layout/nav.js';
import './app/components/layout/footer.js';
import './app/components/layout/container.js';
import './app/components/layout/grid.js';
import './app/components/layout/section-wrapper.js';

// Sections
import './app/sections/hero/hero.js';
import './app/sections/about/about.js';
import './app/sections/services/services.js';
import './app/sections/portfolio/portfolio.js';
import './app/sections/process/process.js';
import './app/sections/pricing/pricing.js';
import './app/sections/faq/faq.js';
import './app/sections/contact/contact.js';
import './app/sections/footer/footer.js';

// ============================================
// Theme Manager
// ============================================
function initTheme() {
  const saved = getState('theme') || 'system';
  applyTheme(saved);

  subscribe('theme', (theme) => {
    applyTheme(theme);
  });

  // Listen for system changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (getState('theme') === 'system') {
      applyTheme('system');
    }
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = isDark ? '#0f172a' : '#005ce6';
  }
}

// ============================================
// Analytics (Privacy-first)
// ============================================
function initAnalytics() {
  // Simple page view tracking (no cookies, no personal data)
  const sendEvent = (event, data = {}) => {
    try {
      const payload = {
        event,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        lang: getLocale(),
        timestamp: new Date().toISOString(),
        ...data
      };

      // Send beacon if available
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${getState('apiBase') || '/api/v2'}/analytics/event`, JSON.stringify(payload));
      }
    } catch (e) {
      // Silently fail
    }
  };

  // Track page views
  let lastPath = '';
  subscribe('route', (route) => {
    if (route !== lastPath) {
      lastPath = route;
      sendEvent('page_view', { route });
    }
  });

  // Track CTA clicks
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-track]');
    if (cta) {
      sendEvent('cta_click', {
        action: cta.dataset.track,
        text: cta.textContent?.trim()?.substring(0, 50)
      });
    }
  });

  window.webowoAnalytics = { sendEvent };
}

// ============================================
// Prefetching
// ============================================
function initPrefetching() {
  // Prefetch on hover
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a[href^="/"]');
    if (link && !link.hasAttribute('data-external')) {
      const href = link.getAttribute('href');
      if (href && href !== '/' && !href.startsWith('/api')) {
        prefetchPage(href.replace('/', ''));
      }
    }
  }, { passive: true });
}

// ============================================
// Performance Monitoring
// ============================================
function initPerformance() {
  if ('PerformanceObserver' in window) {
    try {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`[Perf] LCP: ${Math.round(entry.startTime)}ms`);
          }
          if (entry.entryType === 'first-input') {
            console.log(`[Perf] FID: ${Math.round(entry.processingStart - entry.startTime)}ms`);
          }
        }
      });
      perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (e) {}
  }

  // Log basic metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perf = performance.timing;
      const ttfb = perf.responseStart - perf.navigationStart;
      const dcl = perf.domContentLoadedEventEnd - perf.navigationStart;
      const load = perf.loadEventEnd - perf.navigationStart;
      console.log(`[Perf] TTFB: ${ttfb}ms | DCL: ${dcl}ms | Load: ${load}ms`);
    }, 0);
  });
}

// ============================================
// Main Init
// ============================================
async function init() {
  console.log('%c[Webowo v3.0] %cInitializing...', 'color:#005ce6;font-weight:bold', 'color:#64748b');

  const startTime = performance.now();

  initState();
  initI18n();
  initTheme();
  initRouter();

  try {
    await initRenderer();
  } catch (err) {
    console.error('[Renderer] Failed:', err);
  }

  initAnimations();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections);
  } else {
    observeSections();
  }

  initAnalytics();
  initPrefetching();
  initPerformance();

  // Persist preferences
  persist(['locale', 'theme']);

  // Load public settings
  const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
  try {
    const res = await fetch(`${API_BASE}/settings/public`);
    if (res.ok) {
      const { data } = await res.json();
      if (data.site_title) {
        setState('siteTitle', data.site_title);
        document.title = data.site_title;
      }
      if (data.site_description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.content = data.site_description;
      }
      if (data.theme_color) {
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = data.theme_color;
      }
    }
  } catch (e) {
    console.warn('[Meta] Could not load public settings:', e.message);
  }

  const initTime = Math.round(performance.now() - startTime);
  console.log(`%c[Webowo v3.0] %c✅ Initialized in ${initTime}ms`, 'color:#005ce6;font-weight:bold', 'color:#22c55e;font-weight:bold');
}

init();

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Registration failed:', err));
  });
}

// Expose for debugging
window.webowo = {
  version: '3.0.0',
  getState,
  setState,
  subscribe,
  setLocale,
  getLocale,
  navigate,
  destroyAnimations
};
