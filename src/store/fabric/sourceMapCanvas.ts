import { fabric } from 'fabric';
import { createEffect, createEvent, createStore, sample } from '@store/rootDomain';
import { $atomMap, $moduleMap, getAtomMapFx, getModuleMapFx } from '@store/sourceMaps';
import { makeAtomComponent, makeModuleComponent } from '../../utils/makeComponent';
import { $activePort, makeConnectionFx, mouseDownFx, moveLineFx, onWheelFx } from './handlers';
import { $arrowStyle, $connectionsMode } from './canvasModes';
import { Canvas } from 'fabric/fabric-impl';
import { fsApi } from '@store/fsApi';

const makeConnection = createEvent<fabric.Circle>();
const onWheel = createEvent();
const mouseDown = createEvent();

export const saveCanvas = createEvent();
const sendCanvasFx = createEffect(async (canvas) => {
  const result = await fsApi.post({
    endpoint: '/canvas',
    data: canvas.toJSON(['hasControls', 'subTargetCheck', 'name', 'addChild', 'from', 'to', 'selectable']),
  });
  return result;
});

export const loadFromAtom = createEvent();
export const loadFromAtomFx = createEffect(async ({ map, canvas }) => {
   try {
     let previousBottom = 150;
     console.log(map)
     Object.entries(map).forEach((element, index) => {
       const component = makeAtomComponent(element as any, makeConnection, index, previousBottom);
      //  previousBottom = component.top + component.height;
       canvas.add(component);
     });
     canvas.renderAll();

   } catch (error) {
     console.log(error)
   }
})

export const loadFromModuleFx = createEffect(async ({ map, canvas }) => {
  try {
    let previousBottom = null;
    Object.entries(map).forEach((components, groupIndex) => {
      Object.entries(components[1]).forEach((element, index) => {
        const component = makeModuleComponent(element, makeConnection, index, groupIndex, previousBottom);
        previousBottom = component.top + component.height;
        canvas.add(component);
      })
    });
    canvas.renderAll();
  } catch (error) {
    console.log(error);
  }
});

export const initMapCanvasFx = createEffect(async () => {
  const canvas = new fabric.Canvas('canvas-source-maps');
  canvas.on('object:moving', moveLineFx);
  canvas.on('mouse:wheel', onWheel as () => void);
  canvas.on('mouse:down', mouseDown as () => void);
  return canvas;
});

export const $sourceMapCanvas = createStore<Canvas>(null).on(initMapCanvasFx.doneData, (_, canvas) => canvas);

sample({
  clock: initMapCanvasFx.doneData,
  target: getAtomMapFx,
});

sample({
  source: $sourceMapCanvas,
  clock: getAtomMapFx.doneData,
  fn: (canvas, atomMap) => ({ map: atomMap.map, canvas }),
  target: loadFromAtomFx,
});

sample({
  clock: loadFromAtomFx.doneData,
  target: getModuleMapFx,
})

// sample({
//   source: $sourceMapCanvas,
//   clock: getModuleMapFx.doneData,
//   fn: (canvas, moduleMap) => ({ map: moduleMap.map, canvas }),
//   target: loadFromModuleFx,
// });

sample({
  source: { activePort: $activePort, arrowStyle: $arrowStyle, connectionMode: $connectionsMode, canvas: $sourceMapCanvas },
  clock: makeConnection,
  fn: (source, item) => ({ ...source, item }),
  target: makeConnectionFx,
});


sample({
  source: $sourceMapCanvas,
  clock: onWheel,
  fn: (canvas, event) => ({ canvas, event }),
  target: onWheelFx,
});

sample({
  source: { activePort: $activePort, canvas: $sourceMapCanvas },
  clock: mouseDown,
  fn: ({ activePort, canvas }, event) => ({ activePort, canvas, event }),
  target: mouseDownFx,
});

sample({
  source: $sourceMapCanvas,
  clock: saveCanvas,
  target: sendCanvasFx,
});
