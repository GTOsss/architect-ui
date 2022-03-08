import { fabric } from 'fabric';
import { fsApi } from '@store/fsApi';
import { Canvas, IEvent } from 'fabric/fabric-impl';
import { createEffect, createStore, createEvent, sample, guard } from '../rootDomain';
import { $arrowStyle, $connectionsMode } from './canvasModes';
import { $activePort, makeConnectionFx, mouseDownFx, moveLineFx, onWheelFx, setActivePort } from './handlers';

// events

export const loadFromJSON = createEvent();
const onWheel = createEvent<IEvent>();
const mouseDown = createEvent<IEvent>();
const makeConnection = createEvent();

// effects

export const initCanvasJSONFx = createEffect(async () => {
  const canvas = new fabric.Canvas('canvas');
  canvas.on('object:moving', moveLineFx);
  canvas.on('mouse:wheel', onWheel);
  canvas.on('mouse:down', mouseDown);

  return canvas;
});

export const $canvasJSON = createStore<Canvas>(null).on(initCanvasJSONFx.doneData, (_, data) => data);

export const loadFromJSONFx = createEffect(async ({ json, canvas }: { json: any; canvas: Canvas }) => {
  try {
    canvas.loadFromJSON(
      json,
      () => {
        // function that fires after canvas was deserialized
        canvas.getObjects().forEach((object) => {
          if (object.type === 'group') {
            object.getObjects().forEach((item) => {
              if (item.name === 'port') {
                const groupCenter = object.getCenterPoint();
                const portCenter = item.getCenterPoint();
                if (item.addChild) {
                  if (item.addChild.from && item.addChild.from[0]) {
                    item.addChild.from = item.addChild.from.map((ob) => {
                      const line = canvas.getObjects().find((canvasItem) => {
                        if (canvasItem.isSetTo) {
                          return (
                            ob.x1 === canvasItem.x1 &&
                            ob.x2 === canvasItem.startX2 &&
                            ob.y1 === canvasItem.y1 &&
                            ob.y2 === canvasItem.startY2 &&
                            !canvasItem.isSetFrom
                          );
                        }
                        return (
                          ob.x1 === canvasItem.x1 &&
                          ob.x2 === canvasItem.x2 &&
                          ob.y1 === canvasItem.y1 &&
                          ob.y2 === canvasItem.y2 &&
                          !canvasItem.isSetFrom
                        );
                      });
                      line?.set({
                        isSetFrom: true,
                        x1: groupCenter.x + portCenter.x,
                        y1: groupCenter.y + portCenter.y,
                        startX1: line.x1, // set start values to compare in the "to" block
                        startY1: line.y1,
                      });
                      return line;
                    });
                  }
                  if (item.addChild.to && item.addChild.to[0]) {
                    item.addChild.to = item.addChild.to.map((ob) => {
                      const line = canvas.getObjects().find((canvasItem) => {
                        if (canvasItem.isSetFrom) {
                          // if line already ahs been modified
                          return (
                            ob.x1 === canvasItem.startX1 &&
                            ob.x2 === canvasItem.x2 &&
                            ob.y1 === canvasItem.startY1 &&
                            ob.y2 === canvasItem.y2 &&
                            !canvasItem.isSetTo
                          );
                        }
                        return (
                          ob.x1 === canvasItem.x1 &&
                          ob.x2 === canvasItem.x2 &&
                          ob.y1 === canvasItem.y1 &&
                          ob.y2 === canvasItem.y2 &&
                          !canvasItem.isSetTo
                        );
                      });
                      line?.set({
                        isSetTo: true,
                        x2: groupCenter.x + portCenter.x,
                        y2: groupCenter.y + portCenter.y,
                        startX2: line.x2, // set start values to compare in the "to" block
                        startY2: line.y2,
                      });
                      return line;
                    });
                  }
                }
              }
            });
          }
        });
      },
      (o, object) => {
        // function that fires during canvas deserialization for each object
        if (object.type === 'group') {
          object.getObjects().forEach((item) => {
            if (item.name?.startsWith('port')) {
              item.on('mousedown', () => makeConnection(item));
            }
          });
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
});

export const getJSONFx = createEffect(async () => fsApi.get('/canvas'));

// stores

export const $JSON = createStore(null).on(getJSONFx.doneData, (_, json) => json);

// samples and etc.

sample({
  source: $canvasJSON,
  clock: onWheel,
  fn: (canvas, event) => ({ canvas, event }),
  target: onWheelFx,
});

sample({
  source: { activePort: $activePort, canvas: $canvasJSON },
  clock: mouseDown,
  fn: ({ activePort, canvas }, event) => ({ activePort, canvas, event }),
  target: mouseDownFx,
});

sample({
  clock: initCanvasJSONFx.doneData,
  target: getJSONFx,
});

guard({
  source: { json: $JSON, canvas: $canvasJSON },
  clock: getJSONFx.doneData,
  filter: ({ json, canvas }) => Boolean(json) && Boolean(canvas),
  target: loadFromJSONFx,
});

sample({
  source: { activePort: $activePort, arrowStyle: $arrowStyle, connectionMode: $connectionsMode, canvas: $canvasJSON },
  clock: makeConnection,
  fn: (source, item) => ({ ...source, item }),
  target: makeConnectionFx,
});
