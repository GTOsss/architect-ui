import { combine } from 'effector';
import { $pixiElements } from '@store/pixi/pixiElements';
import { $cursorPositionPixi } from '@store/pixi/cursorPositionPixi';
import { AnyGeometryObject } from '@components/pixiElements/types';

type IsInnerComponentParams = {
  component: AnyGeometryObject;
  cursor: { x: number; y: number };
};

const isInnerComponent = ({ component, cursor }: IsInnerComponentParams) => {
  const isInnerByX = cursor.x >= component.x && cursor.x <= component.x + component.w;
  const isInnerByY = cursor.y >= component.y && cursor.y <= component.y + component.h;
  return isInnerByX && isInnerByY;
};

// todo Эта логика нуждается в опмитизации.
// На каждое изменение координат курсора, происходит проход по массиву. В добавок к этому
// остальная цепочка юнитов эффектора которая зависит от этой сторы тоже грузит процессор.
export const $hoverElements = combine($pixiElements, $cursorPositionPixi, (elements, cursor) =>
  elements.filter((component) => isInnerComponent({ component, cursor })),
);
