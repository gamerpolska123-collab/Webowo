// ============================================
// Webowo v3.0 – Advanced Animation Engine
// Lenis smooth scroll + IntersectionObserver + custom effects
// ============================================

import Lenis from 'lenis';

let lenis = null;
let rafId = null;

function initAnimations() {
  // Initialize Lenis smooth scroll
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  // Scroll-triggered animations
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.animateDelay) || 0;
        const type = el.dataset.animate || 'fade-up';

        setTimeout(() => {
          el.classList.add('is-visible');

          // Custom per-element animations
          if (type === 'count-up') {
            animateCountUp(el);
          } else if (type === 'typewriter') {
            animateTypewriter(el);
          } else if (type === 'stagger-children') {
            animateStaggerChildren(el);
          }
        }, delay * 1000);

        animateObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => {
    animateObserver.observe(el);
  });

  // Parallax elements
  const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initParallax(entry.target);
      }
    });
  }, { threshold: 0 });

  document.querySelectorAll('[data-parallax]').forEach(el => {
    parallaxObserver.observe(el);
  });

  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    initMagnetic(el);
  });

  console.log('[Animations] Engine initialized v3.0');
}

function animateCountUp(el) {
  const target = parseInt(el.dataset.countTarget, 10);
  const suffix = el.dataset.countSuffix || '';
  const duration = parseInt(el.dataset.countDuration, 10) || 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(update);
}

function animateTypewriter(el) {
  const text = el.textContent;
  el.textContent = '';
  el.style.borderRight = '2px solid var(--color-primary-500)';
  el.style.animation = 'blink 0.7s step-end infinite';

  let i = 0;
  const speed = parseInt(el.dataset.typeSpeed, 10) || 50;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      el.style.borderRight = 'none';
      el.style.animation = 'none';
    }
  }
  type();
}

function animateStaggerChildren(el) {
  const children = el.children;
  Array.from(children).forEach((child, i) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    setTimeout(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, 50);
  });
}

function initParallax(el) {
  const speed = parseFloat(el.dataset.parallax) || 0.5;
  let ticking = false;

  function update() {
    const rect = el.getBoundingClientRect();
    const scrolled = window.scrollY;
    const rate = scrolled * speed;
    el.style.transform = `translate3d(0, ${rate}px, 0)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

function initMagnetic(el) {
  const strength = parseFloat(el.dataset.magnetic) || 0.3;

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => { el.style.transition = ''; }, 300);
  });
}

function scrollTo(target, options = {}) {
  if (!lenis) return;
  const { offset = 0, duration = 1.2 } = options;
  lenis.scrollTo(target, { offset, duration });
}

function observeSections() {
  const sectionSelectors = [
    'webowo-section-hero',
    'webowo-section-about',
    'webowo-section-services',
    'webowo-section-portfolio',
    'webowo-section-process',
    'webowo-section-pricing',
    'webowo-section-faq',
    'webowo-section-contact',
    'webowo-section-footer'
  ];

  const sections = document.querySelectorAll(sectionSelectors.join(', '));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

  sections.forEach(s => observer.observe(s));
}

function destroyAnimations() {
  if (rafId) cancelAnimationFrame(rafId);
  if (lenis) lenis.destroy();
}

export { initAnimations, scrollTo, observeSections, destroyAnimations };
