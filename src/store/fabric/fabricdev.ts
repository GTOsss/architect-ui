
import { fsApi } from '@store/fsApi';
import { getProjectPathFx } from '@store/path';
import { $atomMap } from '@store/sourceMaps';
import { Canvas } from 'fabric/fabric-impl';
import { createStore, createEvent, sample, guard, createEffect } from '../rootDomain';
import { initCanvasJSONFx, loadFromJSONFx, $canvasJSON } from './canvasJSON';
import { $sourceMapCanvas, initMapCanvasFx, loadFromAtomFx } from './sourceMapCanvas';

export const initApp = createEvent();

sample({
  clock: initApp,
  target: [initCanvasJSONFx, initMapCanvasFx, getProjectPathFx],
});
