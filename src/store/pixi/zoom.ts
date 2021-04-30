import { createEvent, restore, sample } from '@store/rootDomain';
import { onWheel } from './scrollPosition';

export const setZoom = createEvent<number>();
export const $zoom = restore(setZoom, 1);

sample({
  source: $zoom,
  clock: onWheel.filter({ fn: (e) => e.ctrlKey }),
  fn: (zoom, e) => (e.deltaY > 0 ? Math.max((zoom * 10 - 1) / 10, 0.2) : Math.min((zoom * 10 + 1) / 10, 3)),
  target: $zoom,
});
