
import { fsApi } from '@store/fsApi';
import { $atomMap } from '@store/sourceMaps';
import { Canvas } from 'fabric/fabric-impl';
import { createStore, createEvent, sample, guard, createEffect } from '../rootDomain';
import { initCanvasJSONFx, loadFromJSONFx, $canvasJSON } from './canvasJSON';
import { $sourceMapCanvas, initMapCanvasFx, loadFromAtomFx } from './sourceMapCanvas';

export const initApp = createEvent();

sample({
  clock: initApp,
  target: [initCanvasJSONFx, initMapCanvasFx],
});

// код ниже особо ничего не делает

// const $fabric = createStore({
//   canvasJSON: {

//   },
//   sourceMapCanvas: {

//   }
// });

// sample({
//   source: { canvasJSON: $canvasJSON, fabric: $fabric },
//   clock: loadFromJSONFx.doneData,
//   fn: ({ canvasJSON, fabric }) => ({ ...fabric, canvasJSON: canvasJSON._objects }),
//   target: $fabric,
// });

// sample({
//   source: { sourceMapCanvas: $sourceMapCanvas, fabric: $fabric },
//   clock: loadFromAtomFx.doneData,
//   fn: ({ sourceMapCanvas, fabric }) => ({ ...fabric, sourceMapCanvas: sourceMapCanvas._objects }),
//   target: $fabric,
// });

// const makeAtomComponent = (data) => {};

// const createComponentFx = createEffect(async ( type: string, canvas: Canvas, data ) => {
//   if (type === 'atom') {
//     const newComp = makeAtomComponent(data);
//     canvas.add(newComp);
//     canvas.renderAll();
//     return newComp;
//   }
// })

// const sendFileFx = createEffect(async ({ atomMap, params }) => {
//   const file = generateAtomMapFile(params.data, atomMap);
//   return await fsApi.post({ url: 'source-map/atom', data: file });
// })

// sample({
//   source: $atomMap,
//   clock: createComponentFx.done,
//   fn: (atomMap, { params }) => ({ atomMap, params }),
//   target: 
// })
