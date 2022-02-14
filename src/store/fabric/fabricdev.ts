import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { fsApi } from '@store/fsApi';
import { createEffect, createStore, createEvent, sample, guard } from '../rootDomain';
import { initCanvasJSONFx } from './canvasJSON';
import { addLineArrowFx } from './extra-classes';
import { initMapCanvasFx } from './sourceMapCanvas';

export const initApp = createEvent();
export const loadFromModule = createEvent();
export const loadFromAtom = createEvent();

sample({
  clock: initApp,
  target: [initCanvasJSONFx, initMapCanvasFx],
});


