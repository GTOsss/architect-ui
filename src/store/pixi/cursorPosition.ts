import { MouseEvent } from 'react';
import { createEvent, restore } from '@store/rootDomain';
// import { $canvas } from '@store/canvas';

export type Position = {
  x: number;
  y: number;
};

export const onMouseMoveHandler = createEvent<MouseEvent>();

export const setCursorPosition = onMouseMoveHandler.map<Position>(({ clientX, clientY }) => ({
  x: clientX,
  y: clientY,
}));

export const $cursorPosition = restore<Position>(setCursorPosition, { x: -1, y: -1 });
