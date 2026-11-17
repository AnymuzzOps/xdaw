import { initScrollProgress } from './scroll-progress.js?v=scroll-position-1';
import { initNavigation } from './navigation.js';
initNavigation();
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopWorlds = window.matchMedia('(min-width: 901px)');
const activeAnimations = new Set();
const animate = (element, frames, options) => {
  const animation = element.animate(frames, options);
  activeAnimations.add(animation);
  animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  return animation;
};
const revealFrames = [
  { opacity: 0, transform: 'translateY(12px)' },
  { opacity: 1, transform: 'translateY(0)' }
];
const revealOptions = { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' };

// These groups own their reveal, so they do not also run the generic reveal.
const worldCards = [...document.querySelectorAll('.world-card')];
const steps = document.querySelector('.journey .steps');
worldCards.forEach(card => card.classList.remove('reveal'));
const stageItems = [...(steps?.children || [])];
const supportsObservers = 'IntersectionObserver' in window;
if (!supportsObservers) document.documentElement.classList.remove('js-motion');
steps?.classList.remove('reveal');

const observer = supportsObservers ? new IntersectionObserver(entries => {
  let revealIndex = 0;
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (desktopWorlds.matches) {
      entry.target.style.transitionDelay = `${Math.min(revealIndex++, 2) * 200}ms`;
    }
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .14, rootMargin: '0px 0px -5% 0px' }) : null;
document.querySelectorAll('.reveal').forEach(el => observer?.observe(el));

// Base styles stay visible. Finite animations complete autonomously even if
// unrelated JavaScript fails; nothing relies on a permanent hidden class.
const manifesto = document.querySelector('.manifesto');
const manifestoWords = [...document.querySelectorAll('.manifesto-line')];
const cancelMotion = () => {
  activeAnimations.forEach(animation => animation.cancel());
  activeAnimations.clear();
};
motionPreference.addEventListener('change', event => {
  document.documentElement.classList.toggle('js-motion', !event.matches);
  if (event.matches) {
    cancelMotion();
  }
});

const groupObserver = supportsObservers ? new IntersectionObserver(entries => {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) return;
    groupObserver.unobserve(entry.target);
    if (motionPreference.matches) return;
    try {
      if (entry.target === manifesto) {
        const reveals = manifestoWords.map((word, index) =>
          animate(word, revealFrames, { ...revealOptions, delay: index * 550 }));
        await Promise.all(reveals.map(animation => animation.finished));
        if (!motionPreference.matches) animate(manifesto, [
          { transform: 'scale(1)' },
          { transform: 'scale(1.012)' },
          { transform: 'scale(1)' }
        ], { duration: 6000, iterations: Infinity, easing: 'ease-in-out' });
      }
    } catch {
      cancelMotion();
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -5% 0px' }) : null;
if (manifesto) groupObserver?.observe(manifesto);

initScrollProgress({ worldCards, stageItems, steps, motionPreference });

// Keep the approved text fallback until the original WebP is available.
const brandLogoUrl = new URL(document.body.dataset.brandLogoSrc, document.baseURI);
const brandLogo = new Image();
brandLogo.onload = () => {
  document.querySelectorAll('[data-brand-logo]:not(.has-brand-logo)').forEach(container => {
    const image = brandLogo.cloneNode();
    image.className = 'brand-logo-image';
    image.alt = container.matches('h1') ? 'XDAW' : '';
    if (container.matches('a') && !container.hasAttribute('aria-label')) {
      container.setAttribute('aria-label', 'XDAW, inicio');
    }
    container.replaceChildren(image);
    container.classList.add('has-brand-logo');
  });
};
brandLogo.src = brandLogoUrl.href;

