import { createEvent, createStore } from '@store/rootDomain';

export const setShift = createEvent<{ X: number; Y: number }>();

export const setSelfZoom = createEvent<number>();

export const $shift = createStore({ X: 0, Y: 0 }).on(setShift, (_, shift) => shift);

export const $selfZoom = createStore(1).on(setSelfZoom, (_, zoom) => zoom);
