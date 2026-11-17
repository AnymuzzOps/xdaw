// Scroll-position renderer, not a clock: no delays, transitions or WAAPI.
// JS keeps a monotonic maximum, which native view timelines do not provide.
export const clamp = value => Math.max(0, Math.min(1, value));
export const phaseProgress = (progress, index, count) => clamp(progress * count - index);
export const smoothProgress = value => value * value * (3 - 2 * value);

export function initScrollProgress({ worldCards, stageItems, steps, motionPreference }) {
  const records = [...worldCards, ...stageItems].map(element => ({ element, progress: 0 }));
  if (!records.length) return;
  let frame = 0;
  let stopped = false;
  const layoutTop = element => {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  };
  const complete = () => {
    records.forEach(record => {
      record.progress = 1;
      record.element.classList.remove('scroll-item');
      ['--scroll-opacity', '--scroll-y', '--scroll-scale', '--connector-progress'].forEach(name => record.element.style.removeProperty(name));
    });
    steps?.classList.remove('scroll-position');
  };
  const failOpen = () => {
    stopped = true;
    cancelAnimationFrame(frame);
    frame = 0;
    complete();
  };
  const render = (initial = false) => {
    if (motionPreference.matches || stopped) return complete();
    const viewport = window.innerHeight;
    const scroll = window.scrollY;
    const horizontal = window.matchMedia('(min-width: 901px)').matches;
    // Read layout before writing styles; offset geometry excludes our transforms.
    const metrics = records.map(record => ({ record, top: layoutTop(record.element) - scroll, height: record.element.offsetHeight }));
    const groupProgress = elements => {
      const group = elements[0]?.parentElement;
      if (!group) return 1;
      const top = layoutTop(group) - scroll;
      const distance = Math.min(viewport * .68, group.offsetHeight + viewport * .24);
      return clamp((viewport * .92 - top) / Math.max(1, distance));
    };
    const worlds = horizontal ? groupProgress(worldCards) : 0;
    const journey = horizontal ? groupProgress(stageItems) : 0;
    metrics.forEach(({ record, top, height }) => {
      const worldIndex = worldCards.indexOf(record.element);
      const stageIndex = stageItems.indexOf(record.element);
      let progress = horizontal
        ? phaseProgress(worldIndex >= 0 ? worlds : journey, worldIndex >= 0 ? worldIndex : stageIndex, worldIndex >= 0 ? worldCards.length : stageItems.length)
        : clamp((viewport * .92 - top) / Math.min(280, Math.max(140, viewport * .42)));
      // Restored scroll positions / late modules never hide already-painted text.
      if (initial && top < viewport) progress = 1;
      record.progress = Math.max(record.progress, progress);
    });
    records.forEach(record => {
      const eased = smoothProgress(record.progress);
      record.element.style.setProperty('--scroll-opacity', String(eased));
      record.element.style.setProperty('--scroll-y', `${(1 - eased) * 14}px`);
      record.element.style.setProperty('--scroll-scale', String(worldCards.includes(record.element) ? .985 + eased * .015 : 1));
      record.element.classList.add('scroll-item');
    });
    stageItems.slice(0, -1).forEach((element, index) => {
      const from = records.find(record => record.element === element);
      const to = records.find(record => record.element === stageItems[index + 1]);
      // A segment advances with the following stage, never ahead of its nodes.
      element.style.setProperty('--connector-progress', String(smoothProgress(Math.min(from.progress, to.progress))));
    });
    steps?.classList.add('scroll-position');
  };
  const schedule = () => {
    if (frame || stopped) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      try { render(); } catch { failOpen(); }
    });
  };
  try {
    render(true);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    window.addEventListener('load', schedule, { once: true });
    window.addEventListener('error', failOpen);
    window.addEventListener('unhandledrejection', failOpen);
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) complete();
      else schedule();
    });
    document.addEventListener('focusin', event => {
      const index = records.findIndex(record => record.element.contains(event.target));
      if (index < 0) return;
      // Keyboard navigation always exposes its destination immediately.
      records.slice(0, index + 1).forEach(record => { record.progress = 1; });
      try { render(); } catch { failOpen(); }
    });
  } catch { failOpen(); }
}
