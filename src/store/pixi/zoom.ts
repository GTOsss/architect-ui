import { createEvent, restore, sample } from '@store/rootDomain';
import { onWheel } from './scrollPosition';

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

export const setZoom = createEvent<number>();
export const $zoom = restore(setZoom, 1);

sample({
  source: $zoom,
  clock: onWheel.filter({ fn: (e) => e.ctrlKey }),
  fn: (zoom, e) => (e.deltaY > 0 ? Math.max((zoom * 10 - 1) / 10, ZOOM_MIN) : Math.min((zoom * 10 + 1) / 10, ZOOM_MAX)),
  target: $zoom,
});
