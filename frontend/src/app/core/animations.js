// ============================================
// Webowo v3.1 – Animations & Intersection Observer
// ============================================

let observer = null;

export function initAnimations() {
  // Nothing to init at module level
}

export function observeSections() {
  if (!('IntersectionObserver' in window)) return;

  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

export function destroyAnimations() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

export function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const isPercent = target.includes('%');
  const isPlus = target.includes('+');
  const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(numericValue * easeOut);

    let display = current.toString();
    if (isPlus) display += '+';
    if (isPercent) display += '%';

    el.textContent = display;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
