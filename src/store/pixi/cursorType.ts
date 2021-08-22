import { createStore, sample } from 'effector';
import { AnyGeometryObject, CursorType } from '@store/pixi/uiElements/types';
import { $pixiElements } from '@store/pixi/pixiElements';
import { $cursorPositionPixi } from '@store/pixi/cursorPositionPixi';

export const $cursorType = createStore<CursorType>('default');

type IsInnerComponentParams = {
  component: AnyGeometryObject;
  cursor: { x: number; y: number };
};

const isInnerComponent = ({ component, cursor }: IsInnerComponentParams) => {
  const isInnerByX = cursor.x >= component.x && cursor.x <= component.x + component.w;
  const isInnerByY = cursor.y >= component.y && cursor.y <= component.y + component.h;
  return isInnerByX && isInnerByY;
};

// При движении мыши узнаем внутри каких элементов находиться курсор.
sample({
  source: {
    elements: $pixiElements,
    cursor: $cursorPositionPixi,
  },
  fn: ({ elements, cursor }): CursorType => {
    let targetElements = elements.filter((component) => isInnerComponent({ component, cursor }));
    targetElements = targetElements.filter((component) => !component.children?.length);
    return targetElements[0]?.cursor || 'default';
  },
  target: $cursorType,
});
