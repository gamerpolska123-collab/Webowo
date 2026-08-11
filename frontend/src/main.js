// ============================================
// Webowo v3.1 – Main Entry Point
// ============================================

import './styles/main.css';

// Core
import { initI18n } from './app/core/i18n.js';
import { initState } from './app/core/state.js';
import { initRouter } from './app/core/router.js';
import { initAnimations, observeSections } from './app/core/animations.js';
import { initRenderer } from './app/core/renderer.js';

// Layout
import './app/components/layout/nav.js';

// UI Components
import './app/components/ui/btn.js';
import './app/components/ui/card.js';
import './app/components/ui/toast.js';
import './app/components/ui/modal.js';
import './app/components/ui/skeleton.js';

// Sections
import './app/sections/hero/hero.js';
import './app/sections/stats/stats.js';
import './app/sections/about/about.js';
import './app/sections/services/services.js';
import './app/sections/portfolio/portfolio.js';
import './app/sections/process/process.js';
import './app/sections/pricing/pricing.js';
import './app/sections/testimonials/testimonials.js';
import './app/sections/faq/faq.js';
import './app/sections/contact/contact.js';
import './app/sections/footer/footer.js';
import './app/sections/cta/cta.js';
import './app/sections/cookie-consent/cookie-consent.js';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Failed:', err));
  });
}

// Initialize
async function init() {
  initState();
  await initI18n();
  initRouter();
  initAnimations();
  await initRenderer();

  // Observe sections for animations after render
  setTimeout(() => {
    observeSections();

    // Add cookie consent after content loads
    const app = document.getElementById('app');
    if (app) {
      const cookieConsent = document.createElement('webowo-cookie-consent');
      app.appendChild(cookieConsent);
    }
  }, 100);

  console.log('[Webowo] v3.1 initialized');
}

init();
