// ============================================
// Animation Engine (WAAPI)
// ============================================

import Lenis from 'lenis';

let lenis = null;

function initAnimations() {
  // Lenis smooth scroll
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function scrollTo(target) {
  if (lenis) lenis.scrollTo(target);
}

// ============================================
// IntersectionObserver dla sekcji landing page
// Dodaje klasę .animate-in gdy sekcja wejdzie w viewport
// ============================================
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
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => observer.observe(section));
}

export { initAnimations, scrollTo, observeSections };
