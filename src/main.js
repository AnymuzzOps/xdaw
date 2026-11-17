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
    steps?.classList.remove('scroll-progressive');
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

// Each card/stage owns its observation. Only simultaneous intersections share
// a short stagger; unseen mobile stages never inherit a container-wide timer.
const observedOnce = (items, threshold, reveal) => {
  if (!supportsObservers || !items.length) return null;
  const order = new Map(items.map((item, index) => [item, index]));
  const seen = new Set();
  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio >= threshold && !seen.has(entry.target))
      .sort((a, b) => order.get(a.target) - order.get(b.target));
    entering.forEach((entry, batchIndex) => {
      seen.add(entry.target);
      observer.unobserve(entry.target);
      try {
        reveal(entry.target, batchIndex);
      } catch {
        cancelMotion();
        steps?.classList.remove('scroll-progressive');
      }
    });
  }, { threshold, rootMargin: '0px 0px -5% 0px' });
  items.forEach(item => observer.observe(item));
  return observer;
};

observedOnce(worldCards, .25, (card, batchIndex) => {
  if (motionPreference.matches) return;
  animate(card, [
    { opacity: 0, transform: 'translateY(16px) scale(.985)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ], { ...revealOptions, duration: desktopWorlds.matches ? 1200 : 950, delay: batchIndex * (desktopWorlds.matches ? 300 : 200) });
});

const stageStarts = new Map();
const linked = new Set();
if (supportsObservers && !motionPreference.matches) steps?.classList.add('scroll-progressive');
observedOnce(stageItems, .3, (stage, batchIndex) => {
  const delay = batchIndex * 250;
  stageStarts.set(stage, performance.now() + delay);
  if (motionPreference.matches) {
    steps?.classList.remove('scroll-progressive');
    return;
  }
  animate(stage, revealFrames, { ...revealOptions, duration: 1000, delay });
  stageItems.slice(0, -1).forEach((from, index) => {
    const to = stageItems[index + 1];
    if (linked.has(from) || !stageStarts.has(from) || !stageStarts.has(to)) return;
    linked.add(from);
    // Let both neighboring stages begin before drawing their shared segment.
    const lineDelay = Math.max(0, Math.max(stageStarts.get(from), stageStarts.get(to)) - performance.now()) + 120;
    from.classList.add('line-revealed');
    const vertical = window.matchMedia('(max-width: 900px)').matches;
    animate(from, [
      { transform: vertical ? 'scaleY(0)' : 'scaleX(0)' },
      { transform: vertical ? 'scaleY(1)' : 'scaleX(1)' }
    ], { duration: 950, delay: lineDelay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards', pseudoElement: '::after' });
  });
});

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

