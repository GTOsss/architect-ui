import { createEvent, createStore, restore, sample } from '@store/rootDomain';

const SCROLL_STEP = 80;

export const onWheel = createEvent<WheelEvent>();

onWheel.watch((e) => {
  e.preventDefault();
});

export const setScrollX = createEvent<number>();
export const $scrollX = restore(setScrollX, 0);
export const $scrollMinX = createStore(-50000);
export const $scrollMaxX = createStore(50000);

export const setScrollY = createEvent<number>();
export const $scrollY = restore(setScrollY, 0);
export const $scrollMinY = createStore(-50000);
export const $scrollMaxY = createStore(50000);

sample({
  source: { scrollX: $scrollX, scrollMaxX: $scrollMaxX, scrollMinX: $scrollMinX },
  clock: onWheel.filter({ fn: (e) => !e.ctrlKey && e.shiftKey }),
  fn: ({ scrollX, scrollMaxX, scrollMinX }, e) => {
    let result = scrollX;
    if (e.deltaY > 0) {
      result = Math.min(scrollMaxX, scrollX + SCROLL_STEP);
    }
    if (e.deltaY < 0) {
      result = Math.max(scrollMinX, scrollX - SCROLL_STEP);
    }

    return result;
  },
  target: $scrollX,
});

sample({
  source: { scrollY: $scrollY, scrollMaxY: $scrollMaxY },
  clock: onWheel.filter({ fn: (e) => !e.ctrlKey && !e.shiftKey && e.deltaY > 0 }),
  fn: ({ scrollY, scrollMaxY }) => Math.min(scrollMaxY, scrollY + SCROLL_STEP),
  target: $scrollY,
});

sample({
  source: { scrollY: $scrollY, scrollMinY: $scrollMinY },
  clock: onWheel.filter({ fn: (e) => !e.ctrlKey && !e.shiftKey && e.deltaY < 0 }),
  fn: ({ scrollY, scrollMinY }) => Math.max(scrollMinY, scrollY - SCROLL_STEP),
  target: $scrollY,
});
