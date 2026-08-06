import Lenis from 'lenis';

let lenis = null;

function initAnimations() {
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

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

function observeSections() {
  const sectionSelectors = [
    'webowo-section-hero', 'webowo-section-about', 'webowo-section-services',
    'webowo-section-portfolio', 'webowo-section-process', 'webowo-section-pricing',
    'webowo-section-faq', 'webowo-section-contact', 'webowo-section-footer'
  ];
  const sections = document.querySelectorAll(sectionSelectors.join(', '));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => observer.observe(s));
}

export { initAnimations, scrollTo, observeSections };
