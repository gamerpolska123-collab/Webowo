// ============================================
// Custom Event Bus
// ============================================

const bus = new EventTarget();

function emit(name, detail) {
  bus.dispatchEvent(new CustomEvent(name, { detail }));
}

function on(name, handler) {
  bus.addEventListener(name, handler);
  return () => bus.removeEventListener(name, handler);
}

function once(name, handler) {
  const wrapper = (e) => { handler(e); off(name, wrapper); };
  bus.addEventListener(name, wrapper);
}

function off(name, handler) {
  bus.removeEventListener(name, handler);
}

export { emit, on, once, off };
