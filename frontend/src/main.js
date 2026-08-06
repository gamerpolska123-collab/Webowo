import './styles/main.css';
import { initI18n } from './app/core/i18n.js';
import { initRouter } from './app/core/router.js';
import { initState } from './app/core/state.js';
import { initAnimations, observeSections } from './app/core/animations.js';
import { initRenderer } from './app/core/renderer.js';

// Web Components
import './app/components/ui/btn.js';
import './app/components/ui/card.js';
import './app/components/ui/input.js';
import './app/components/ui/modal.js';
import './app/components/ui/toast.js';
import './app/components/ui/skeleton.js';
import './app/components/ui/tooltip.js';
import './app/components/layout/nav.js';
import './app/components/layout/footer.js';
import './app/components/layout/container.js';
import './app/components/layout/grid.js';

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

async function init() {
  console.log('[Webowo v2.0] Starting initialization...');

  initI18n();
  initState();
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

  const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api/v2';
  try {
    const res = await fetch(`${API_BASE}/settings/public`);
    if (res.ok) {
      const { data } = await res.json();
      if (data.site_title) document.title = data.site_title;
      if (data.site_description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.content = data.site_description;
      }
    }
  } catch (e) {
    console.warn('[Meta] Could not load public settings:', e.message);
  }

  console.log('[Webowo v2.0] ✅ Initialized');
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Registration failed:', err));
  });
}
