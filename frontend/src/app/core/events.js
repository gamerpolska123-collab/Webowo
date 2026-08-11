// ============================================
// Webowo v3.1 – Event Bus
// ============================================

const events = new Map();

export function on(event, callback) {
  if (!events.has(event)) {
    events.set(event, new Set());
  }
  events.get(event).add(callback);
  return () => off(event, callback);
}

export function off(event, callback) {
  events.get(event)?.delete(callback);
}

export function emit(event, data) {
  events.get(event)?.forEach(cb => cb(data));
}
