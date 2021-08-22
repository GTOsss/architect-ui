import { createEvent, createStore } from 'effector';
import { AnyGeometryObject } from '@store/pixi/uiElements/types';

export const pushElement = createEvent<AnyGeometryObject>();
export const $pixiElements = createStore<AnyGeometryObject[]>([]).on(pushElement, (elements, element) => [
  ...elements,
  element,
]);
