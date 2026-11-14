import assert from 'node:assert/strict';
import test from 'node:test';
import { initNavigation } from '../src/navigation.js';

function fixture(width) {
  const listeners = target => Object.assign(target, {
    events: new Map(),
    addEventListener(type, callback) { this.events.set(type, callback); },
    emit(type, event = {}) { this.events.get(type)?.(event); }
  });
  const classes = () => ({ values: new Set(), add(x) { this.values.add(x); }, toggle(x, on) { on ? this.values.add(x) : this.values.delete(x); } });
  const label = { textContent: '' };
  const toggle = listeners({ attrs: {}, classList: classes(), focusCalls: 0,
    setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k]; },
    querySelector() { return label; }, focus() { this.focusCalls++; } });
  const nav = listeners({ hidden: false, classList: classes() });
  const header = listeners({ querySelector() { return toggle; }, contains(x) { return [toggle, nav, header].includes(x); } });
  const doc = listeners({ body: { classList: classes() }, querySelector() { return header; }, getElementById() { return nav; } });
  const desktop = listeners({ matches: width >= 1024 });
  const viewport = { matchMedia(query) { assert.equal(query, '(min-width:1024px)');return desktop; } };
  initNavigation(doc, viewport);
  return { toggle, nav, header, doc, desktop, label };
}
for (const width of [375, 430, 768]) {
  test(`mobile menu at ${width}: hidden links, open, Escape and outside close`, () => {
    const f = fixture(width);
    assert.equal(f.nav.hidden, true);
    f.toggle.emit('click');
    assert.equal(f.nav.hidden, false);
    assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(f.label.textContent, 'Cerrar menú');
    f.doc.emit('keydown', { key: 'Escape' });
    assert.equal(f.nav.hidden, true);
    assert.equal(f.toggle.focusCalls, 1);
    f.toggle.emit('click');f.doc.emit('click', { target: {} });
    assert.equal(f.nav.hidden, true);
    f.toggle.emit('click');f.nav.emit('click', { target: { closest() { return {}; } } });
    assert.equal(f.nav.hidden, true);
    f.toggle.emit('click');f.header.emit('focusout', { relatedTarget: {} });
    assert.equal(f.nav.hidden, true);
  });
}
for (const width of [1024, 1440]) {
  test(`desktop at ${width}: links remain visible and resize resets open state`, () => {
    const f = fixture(width);
    assert.equal(f.nav.hidden, false);
    f.desktop.matches = false;f.desktop.emit('change');
    assert.equal(f.nav.hidden, true);
    f.toggle.emit('click');assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
    f.desktop.matches = true;f.desktop.emit('change');
    assert.equal(f.nav.hidden, false);
    assert.equal(f.toggle.getAttribute('aria-expanded'), 'false');
    f.desktop.matches = false;f.desktop.emit('change');
    assert.equal(f.nav.hidden, true);
  });
}
