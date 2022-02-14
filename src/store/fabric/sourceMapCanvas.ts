import { fabric } from 'fabric';
import { createEffect, createEvent, createStore, sample } from '@store/rootDomain';
import { $atomMap, getAtomMapFx } from '@store/sourceMaps';
import { makeAtomComponent } from '../../utils/makeComponent';
import { $activePort, makeConnectionFx, mouseDownFx, moveLineFx, onWheelFx } from './handlers';
import { $arrowStyle, $connectionsMode } from './canvasModes';
import { Canvas } from 'fabric/fabric-impl';

const makeConnection = createEvent<fabric.Circle>();
const onWheel = createEvent();
const mouseDown = createEvent();

export const loadFromAtom = createEvent();
const loadFromAtomFx = createEffect(async ({ map, canvas }) => {
   try {
     Object.entries(map).forEach((element, index) => {
       canvas.add(makeAtomComponent(element as any, makeConnection, index));
     });
     canvas.renderAll();
     
  canvas.on('object:moving', moveLineFx);
  canvas.on('mouse:wheel', onWheel);
  canvas.on('mouse:down', mouseDown);
   } catch (error) {
     console.log(error)
   }
})

export const initMapCanvasFx = createEffect(async () => new fabric.Canvas('canvas-source-maps'));

export const $sourceMapCanvas = createStore<Canvas>(null).on(initMapCanvasFx.doneData, (_, canvas) => canvas);

sample({
  clock: initMapCanvasFx.doneData,
  target: getAtomMapFx,
});

sample({
  source: { atomMap: $atomMap, canvas: $sourceMapCanvas },
  clock: getAtomMapFx.doneData,
  fn: ({ atomMap, canvas }) => ({ map: atomMap.map, canvas }),
  target: loadFromAtomFx,
});

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
