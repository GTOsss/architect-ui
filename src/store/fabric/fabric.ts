import { getProjectPathFx } from '@store/path';
import { getConfigFx } from '@store/sourceMaps';
import { createEvent, sample } from '../rootDomain';
import { initCanvasJSONFx, } from './canvasJSON';
import { initExtraClasses } from './extra-classes';
import { initMapCanvasFx } from './sourceMapCanvas';
import { getTemplatesFx } from './templates';

export const initApp = createEvent();

sample({
  clock: initApp,
  target: [initCanvasJSONFx, initMapCanvasFx, getProjectPathFx, getTemplatesFx, initExtraClasses, getConfigFx],
});
