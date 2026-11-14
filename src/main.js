const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 36);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
nav.addEventListener('click', e => {
  if (!e.target.closest('a')) return;
  toggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    if (wasOpen) toggle.focus();
  }
});

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
const worlds = document.querySelector('.world-cards');
const worldCards = [...document.querySelectorAll('.world-card')];
const steps = document.querySelector('.journey .steps');
if (desktopWorlds.matches) worldCards.forEach(card => card.classList.remove('reveal'));
steps?.classList.remove('reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
  if (event.matches) cancelMotion();
});

const groupObserver = new IntersectionObserver(entries => {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) return;
    groupObserver.unobserve(entry.target);
    if (motionPreference.matches) return;
    try {
      if (entry.target === worlds && desktopWorlds.matches) {
        worldCards.forEach((card, index) => animate(card, [
          { opacity: 0, transform: 'translateY(18px) scale(.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], { ...revealOptions, delay: index * 125 }));
      } else if (entry.target === steps) {
        const vertical = window.matchMedia('(max-width: 800px)').matches;
        [...steps.children].forEach((step, index, all) => {
          animate(step, revealFrames, { ...revealOptions, delay: index * 160 });
          if (index < all.length - 1) animate(step, [
            { transform: vertical ? 'scaleY(0)' : 'scaleX(0)' },
            { transform: vertical ? 'scaleY(1)' : 'scaleX(1)' }
          ], { duration: 380, delay: index * 160 + 120, easing: 'ease-out', fill: 'backwards', pseudoElement: '::after' });
        });
      } else if (entry.target === manifesto) {
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
}, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
[manifesto, steps, ...(desktopWorlds.matches ? [worlds] : [])].filter(Boolean).forEach(el => groupObserver.observe(el));

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
