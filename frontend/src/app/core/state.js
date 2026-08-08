// ============================================
// Webowo v3.0 – Enhanced Reactive Store
// Persistence, computed, batch updates
// ============================================

const listeners = new Map();
const computedCache = new Map();
const state = {};

const proxy = new Proxy(state, {
  set(target, key, value) {
    const old = target[key];
    if (old === value) return true;
    target[key] = value;

    // Invalidate computed cache
    computedCache.forEach((_, computedKey) => {
      if (computedKey.includes(key)) {
        computedCache.delete(computedKey);
      }
    });

    // Notify listeners
    const cbs = listeners.get(key);
    if (cbs) {
      cbs.forEach(cb => {
        try { cb(value, old); } catch (e) { console.error('[State] Listener error:', e); }
      });
    }

    // Notify wildcard listeners
    const wildcards = listeners.get('*');
    if (wildcards) {
      wildcards.forEach(cb => {
        try { cb(key, value, old); } catch (e) { console.error('[State] Wildcard listener error:', e); }
      });
    }

    return true;
  },
  get(target, key) {
    return target[key];
  }
});

function initState() {
  // Load persisted preferences
  try {
    const saved = localStorage.getItem('webowo_prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      Object.assign(state, prefs);
    }
  } catch (e) {
    console.warn('[State] Could not load preferences');
  }

  // Defaults
  state.locale = state.locale || 'pl';
  state.route = '/';
  state.page = null;
  state.user = null;
  state.theme = state.theme || 'system';
  state.navOpen = false;
  state.scrollY = 0;
  state.siteTitle = 'Matys WebDev';
  state.siteDescription = 'Profesjonalne strony internetowe';

  console.log('[State] Store initialized v3.0');
}

function getState(key) {
  return proxy[key];
}

function setState(key, value) {
  proxy[key] = value;
}

function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(callback);

  // Return unsubscribe function
  return () => {
    listeners.get(key)?.delete(callback);
  };
}

function computed(key, fn) {
  const cacheKey = key;
  if (computedCache.has(cacheKey)) {
    return computedCache.get(cacheKey);
  }
  const result = fn(proxy);
  computedCache.set(cacheKey, result);
  return result;
}

function persist(keys) {
  const unsubscribes = keys.map(key =>
    subscribe(key, () => {
      try {
        const toSave = {};
        keys.forEach(k => { toSave[k] = proxy[k]; });
        localStorage.setItem('webowo_prefs', JSON.stringify(toSave));
      } catch (e) {
        console.warn('[State] Could not persist preferences');
      }
    })
  );
  return () => unsubscribes.forEach(u => u());
}

function batch(fn) {
  // Simple batch - in real implementation would queue updates
  fn(proxy);
}

export { initState, getState, setState, subscribe, computed, persist, batch };
