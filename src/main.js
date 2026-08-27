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
  if (!e.target.matches('a')) return;
  toggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const worldTabs = [...document.querySelectorAll('.world-tab')];
const worldStage = document.querySelector('.world-stage');

const selectWorld = tab => {
  worldTabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.querySelector(`#panel-${item.dataset.world}`).hidden = !selected;
  });
  worldStage.className = `world-stage world-${tab.dataset.world} reveal visible`;
};

worldTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectWorld(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = worldTabs[(index + direction + worldTabs.length) % worldTabs.length];
    selectWorld(next);
    next.focus();
  });
});
