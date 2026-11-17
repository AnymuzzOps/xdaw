import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, phaseProgress, smoothProgress } from '../src/scroll-progress.js';

test('desktop scroll is distributed into ordered phases, rather than simultaneous reveals', () => {
  assert.deepEqual([0, 1, 2].map(index => phaseProgress(.5, index, 3)), [1, .5, 0]);
  assert.deepEqual([0, 1, 2, 3, 4].map(index => phaseProgress(.5, index, 5)), [1, 1, .5, 0, 0]);
  assert.deepEqual([0, 1, 2, 3, 4].map(index => phaseProgress(1, index, 5)), [1, 1, 1, 1, 1]);
});

test('overscroll has stable endpoints and position easing never reverses', () => {
  assert.equal(clamp(-10), 0);
  assert.equal(clamp(10), 1);
  assert.equal(smoothProgress(0), 0);
  assert.equal(smoothProgress(1), 1);
  const samples = Array.from({ length: 101 }, (_, index) => smoothProgress(index / 100));
  assert.ok(samples.every((value, index) => index === 0 || value >= samples[index - 1]));
});
