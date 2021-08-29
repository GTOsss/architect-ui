import { createStore, sample } from 'effector';
import { CursorType } from '@components/pixiElements/types';
import { $hoverElements } from '@store/pixi/pixiHover';

export const $cursorType = createStore<CursorType>('default');

// При движении мыши узнаем внутри каких элементов находиться курсор.
sample({
  source: $hoverElements,
  fn: (elements): CursorType => {
    const targetElements = elements.filter((component) => !component.children?.length);
    return targetElements[0]?.cursor || 'default';
  },
  target: $cursorType,
});
