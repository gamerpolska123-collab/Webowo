// ============================================
// Reactive Store
// ============================================

const listeners = new Map();
const state = new Proxy({}, {
  set(target, key, value) {
    const old = target[key];
    target[key] = value;
    if (old !== value) {
      listeners.get(key)?.forEach(cb => cb(value, old));
    }
    return true;
  }
});

function initState() {
  // Initialize store with default values
  state.locale = 'pl';
  state.route = '/';
  state.page = null;
  state.user = null;
  console.log('[State] Store initialized');
}

function getState(key) {
  return state[key];
}

function setState(key, value) {
  state[key] = value;
}

function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(callback);
  return () => listeners.get(key).delete(callback);
}

export { initState, getState, setState, subscribe };
