// Same independent implementation in XDAW and Academy; no cross-site runtime dependency.
export function initNavigation(doc = document, viewport = window) {
  const header = doc.querySelector('.site-header');
  const toggle = header?.querySelector('[aria-controls="nav"]');
  const nav = doc.getElementById('nav');
  if (!header || !toggle || !nav) return;
  doc.body.classList.add('js');
  const desktop = viewport.matchMedia('(min-width:1024px)');
  const setOpen = open => {
    const expanded = Boolean(open && !desktop.matches);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
    const label = toggle.querySelector('.sr-only');
    if (label) label.textContent = expanded ? 'Cerrar menú' : 'Abrir menú';
    nav.classList.toggle('open', expanded);
    nav.hidden = !desktop.matches && !expanded;
  };
  const close = (restoreFocus = false) => {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(false);
    if (restoreFocus && wasOpen) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  doc.addEventListener('keydown', event => { if (event.key === 'Escape') close(true); });
  doc.addEventListener('click', event => { if (!header.contains(event.target)) close(); });
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) close();
  });
  desktop.addEventListener('change', () => close());
  setOpen(false);
  return { close };
}
