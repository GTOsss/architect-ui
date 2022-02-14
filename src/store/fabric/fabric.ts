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

// const loadFromJson = createEvent();
// const loadFromJsonFx = createEffect<{ json: JSON; canvas: Canvas }, any, any>(async ({ json, canvas }) =>
//   canvas.loadFromJSON(
//     json,
//     () => {
//       // function that fires after canvas was deserialized
//       canvas._objects.forEach((object) => {
//         if (object.type === 'group') {
//           object._objects.forEach((item) => {
//             if (item.name === 'port') {
//               const groupCenter = object.getCenterPoint();
//               const portCenter = item.getCenterPoint();
//               if (item.addChild) {
//                 if (item.addChild.from && item.addChild.from[0]) {
//                   item.addChild.from = item.addChild.from.map((ob) => {
//                     const line = canvas._objects.find((canvasItem) => {
//                       if (canvasItem.isSetTo) {
//                         return (
//                           ob.x1 === canvasItem.x1 &&
//                           ob.x2 === canvasItem.startX2 &&
//                           ob.y1 === canvasItem.y1 &&
//                           ob.y2 === canvasItem.startY2 &&
//                           !canvasItem.isSetFrom
//                         );
//                       }
//                       return (
//                         ob.x1 === canvasItem.x1 &&
//                         ob.x2 === canvasItem.x2 &&
//                         ob.y1 === canvasItem.y1 &&
//                         ob.y2 === canvasItem.y2 &&
//                         !canvasItem.isSetFrom
//                       );
//                     });
//                     line?.set({
//                       isSetFrom: true,
//                       x1: groupCenter.x + portCenter.x,
//                       y1: groupCenter.y + portCenter.y,
//                       startX1: line.x1, // set start values to compare in the "to" block
//                       startY1: line.y1,
//                     });
//                     return line;
//                   });
//                 }
//                 if (item.addChild.to && item.addChild.to[0]) {
//                   item.addChild.to = item.addChild.to.map((ob) => {
//                     const line = canvas._objects.find((canvasItem) => {
//                       if (canvasItem.isSetFrom) {
//                         // if line already ahs been modified
//                         return (
//                           ob.x1 === canvasItem.startX1 &&
//                           ob.x2 === canvasItem.x2 &&
//                           ob.y1 === canvasItem.startY1 &&
//                           ob.y2 === canvasItem.y2 &&
//                           !canvasItem.isSetTo
//                         );
//                       }
//                       return (
//                         ob.x1 === canvasItem.x1 &&
//                         ob.x2 === canvasItem.x2 &&
//                         ob.y1 === canvasItem.y1 &&
//                         ob.y2 === canvasItem.y2 &&
//                         !canvasItem.isSetTo
//                       );
//                     });
//                     line?.set({
//                       isSetTo: true,
//                       x2: groupCenter.x + portCenter.x,
//                       y2: groupCenter.y + portCenter.y,
//                       startX2: line.x2, // set start values to compare in the "to" block
//                       startY2: line.y2,
//                     });
//                     return line;
//                   });
//                 }
//               }
//             }
//           });
//         }
//       });
//     },
//     (o, object) => {
//       // function that fires during canvas deserialization for each object
//       if (object.type === 'group') {
//         object._objects.forEach((item) => {
//           if (item.name === 'port') {
//             item.on('mousedown', () => connectCallback(item));
//           }
//         });
//       }
//     },
//   ),
// );

// sample({
//   source: { json: $canvasJSON, canvas: $canvas },
//   clock: loadFromJson,
//   target: loadFromJsonFx,
// });

// sample({
//   clock: $fabric,
//   source: $canvas,
// // })

// $fabric.watch(() => $canvas.getState().renderAll()); // template

export const fabricEffector = {
  createRect,
};
