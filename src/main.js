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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Text is visible by default. Once in view, autonomous animations finish even
// if unrelated JavaScript subsequently fails; no persistent hidden CSS state.
const manifesto = document.querySelector('.manifesto');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const manifestoWords = [...document.querySelectorAll('.manifesto-line')];
const revealManifestoImmediately = () => {
  manifestoWords.forEach(word => word.getAnimations().forEach(animation => animation.cancel()));
};
motionPreference.addEventListener('change', event => {
  document.documentElement.classList.toggle('js-motion', !event.matches);
  if (event.matches) revealManifestoImmediately();
});
if (manifesto && 'IntersectionObserver' in window) {
  const manifestoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      manifestoObserver.unobserve(entry.target);
      if (motionPreference.matches) return;
      try {
        manifestoWords.forEach((word, index) => {
          word.animate([
            { opacity: 0, transform: 'translateY(12px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 550,
            delay: index * 550,
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'backwards'
          });
        });
      } catch {
        revealManifestoImmediately();
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  manifestoObserver.observe(manifesto);
}

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
