import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { fsApi } from '@store/fsApi';
import { createEffect, createStore, createEvent, sample } from '../rootDomain';

export const initCanvasFx = createEffect(async () => new fabric.Canvas('canvas'));

const sendCanvasFx = createEffect(async (canvas) => {
  const result = await fsApi.post({
    endpoint: '/canvas',
    data: canvas.toJSON(['hasControls', 'subTargetCheck', 'name', 'addChild', 'from', 'to', 'selectable']),
  });
  return result;
});

export const getCanvasFx = createEffect(async () => {
  const result = await fsApi.get('/canvas');
  return result;
});

export const saveCanvas = createEvent();

export const $canvas = createStore<Canvas>(null).on(initCanvasFx.doneData, (_, canvas) => canvas);
export const $canvasJSON = createStore(null).on(getCanvasFx.doneData, (_, canvasJSON) => canvasJSON);

sample({
  source: $canvas,
  clock: saveCanvas,
  target: sendCanvasFx,
});

const createRect = (params) => {
  const set = createEvent<any>();

  const $fabricElement = createStore(
    new fabric.Rect(params || { width: 100, height: 100, top: 100, left: 100, fill: 'black' }),
  ).on(set, (rect, newParams) => rect.set(newParams));

  return { set, $fabricElement };
};

const rect = createRect({ width: 100, height: 100, top: 100, left: 100, fill: 'black' });
const rect1 = createRect({ width: 100, height: 100, top: 100, left: 100, fill: 'black' });

const addElement = createEvent<any>();

const $fabric = createStore({});

sample({
  source: $fabric,
  clock: addElement,
  fn: (store, newElement) => {
    const newEL = new fabric[newElement.type](newElement.options);
    return {
      ...fabric,
      newEL,
    };
  },
  target: $fabric,
});


// sample({
//   clock: $fabric,
//   source: $canvas,
// // })

// $fabric.watch(() => $canvas.getState().renderAll()); // template

export const fabricEffector = {
  createRect,
};
