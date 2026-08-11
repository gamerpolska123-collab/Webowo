// ============================================
// Webowo v3.1 – State Management
// ============================================

const state = new Map();
const listeners = new Map();

export function initState() {
  // Load persisted state
  try {
    const persisted = JSON.parse(localStorage.getItem('webowo_state') || '{}');
    Object.entries(persisted).forEach(([key, value]) => {
      state.set(key, value);
    });
  } catch (e) {
    console.warn('[State] Failed to load persisted state');
  }
}

export function getState(key) {
  return state.get(key);
}

export function setState(key, value) {
  const oldValue = state.get(key);
  state.set(key, value);

  const keyListeners = listeners.get(key);
  if (keyListeners) {
    keyListeners.forEach(cb => cb(value, oldValue));
  }
}

export function subscribe(key, callback) {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key).add(callback);

  // Return unsubscribe function
  return () => {
    listeners.get(key)?.delete(callback);
  };
}

export function persist(keys) {
  const data = {};
  keys.forEach(key => {
    data[key] = state.get(key);
  });
  localStorage.setItem('webowo_state', JSON.stringify(data));
}
