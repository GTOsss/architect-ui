import { createEvent, restore } from '@store/rootDomain';

export const setCanvas = createEvent<HTMLCanvasElement>();

export const $canvas = restore(setCanvas, null);

setCanvas.watch((canvas) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
