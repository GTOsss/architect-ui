import { combine } from 'effector';
import { $zoom } from '@store/pixi/zoom';
import { $cursorPosition } from '@store/pixi/cursorPosition';
import { $scrollX, $scrollY } from './scrollPosition';

export const $cursorPositionPixi = combine(
  $zoom,
  $cursorPosition,
  $scrollX,
  $scrollY,
  (zoom, { x, y }, scrollX, scrollY) => ({
    x: (x + scrollX) * (1 / zoom),
    y: (y + scrollY) * (1 / zoom),
  }),
);
