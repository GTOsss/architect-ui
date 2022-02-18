import { createEffect, createEvent, createStore, sample } from '@store/rootDomain';
import { Circle } from 'fabric/fabric-impl';
import { RemoveActivePort } from 'src/ts';

export const setActivePort = createEvent<Circle>();
export const removeActivePort = createEvent<RemoveActivePort>();
export const $activePort = createStore<Circle | null>(null).on(setActivePort, (_, port) => port).on(removeActivePort, (port, data) => {
  if (port) {
    port.set({
      strokeWidth: 1,
      stroke: 'gray',
    });
    if (data.tab === 'JSON') {
      data.sourceMapCanvas.renderAll()
    } else {
      data.canvasJSON.renderAll();
    }
  }
  return null;
});

export const onWheelFx = createEffect(async ({ canvas, event }) => {
  const { e } = event;
  if (e.ctrlKey) {
    const delta = e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom);
    event.e.preventDefault();
    event.e.stopPropagation();
  } else if (e.shiftKey) {
    const { viewportTransform } = canvas;
    const newViewportTransform = viewportTransform;
    newViewportTransform[4] -= e.deltaY / 10;
    canvas.setViewportTransform(newViewportTransform);
  } else {
    const { viewportTransform } = canvas;
    const newViewportTransform = viewportTransform;
    newViewportTransform[5] -= e.deltaY / 10;
    canvas.setViewportTransform(newViewportTransform);
  }
});
 
export const mouseDownFx = createEffect(async ({ activePort, canvas, event }) => {
  if (!event.subTargets.length) {
    // disable active port
    if (activePort) {
      activePort.set({
        stroke: 'gray',
        strokeWidth: 1,
      });
      setActivePort(null);
      canvas.renderAll();
    }
  }
});


export const moveLineFx = createEffect(async (event) => {
  const object = event.target;
  const objectCenter = object.getCenterPoint();

  if (object?.type === 'group') {
    const ports = object._objects.filter((item) => item.name === 'port');
    ports.forEach((port) => {
      if (port.addChild) {
        const portCenter = port.getCenterPoint();
        if (port.addChild.from && port.addChild.from[0]) {
          port.addChild.from.forEach((line) => {
            line.set({ x1: objectCenter.x + portCenter.x, y1: objectCenter.y + portCenter.y });
          });
        }
        if (port.addChild.to && port.addChild.to[0]) {
          port.addChild.to.forEach((line) => {
            line.set({ x2: objectCenter.x + portCenter.x, y2: objectCenter.y + portCenter.y });
          });
        }
      }
    });
  }
});

export const makeConnectionFx = createEffect(async ({ activePort, item, arrowStyle, connectionMode, canvas }) => {
  canvas.discardActiveObject();
  if (activePort) {
    if (item.group === activePort.group) {
      activePort.set({
        strokeWidth: 1,
        stroke: 'gray',
      });
      item.set({ strokeWidth: 2, stroke: 'black' });
      setActivePort(item);

      return;
    }
    const fromObject = activePort;
    const toObject = item;
    if (connectionMode === 'add') {
      const fromGroupObject = activePort.group;
      const toGroupObject = item.group;

      const from = fromObject.getCenterPoint();
      const to = toObject.getCenterPoint();

      const fromGroup = fromGroupObject.getCenterPoint();
      const toGroup = toGroupObject.getCenterPoint();
      const line = new fabric.LineArrow(
        [fromGroup.x + from.x, fromGroup.y + from.y, toGroup.x + to.x, toGroup.y + to.y],
        {
          fill: 'gray',
          stroke: 'gray',
          strokeWidth: 1,
          strokeDashArray: arrowStyle === 'dashed' ? [5, 5] : undefined,
          selectable: false,
        },
      );
      // so that the line is behind the connected shapes
      canvas.add(line);
      line.sendToBack();
      fromObject.addChild = {
        // this retains the existing arrays (if there were any)
        from: (fromObject.addChild && fromObject.addChild.from) || [],
        to: fromObject.addChild && fromObject.addChild.to,
      };
      fromObject.addChild.from.push(line);

      toObject.addChild = {
        from: toObject.addChild && toObject.addChild.from,
        to: (toObject.addChild && toObject.addChild.to) || [],
      };
      toObject.addChild.to.push(line);
      activePort.set({
        strokeWidth: 1,
        stroke: 'gray',
      });
      setActivePort(null);
      canvas.renderAll();
      return;
    }
    fromObject?.addChild?.from?.forEach((fromLine, fromIndex) => {
      toObject?.addChild.to.forEach((toLine, toIndex) => {
        if (fromLine === toLine) {
          fromObject.addChild.from.splice(fromIndex, 1);
          toObject.addChild.to.splice(toIndex, 1);
          canvas.remove(fromLine);
        }
      });
    });
    toObject?.addChild?.from?.forEach((fromLine, fromIndex) => {
      fromObject?.addChild.to.forEach((toLine, toIndex) => {
        if (fromLine === toLine) {
          toObject.addChild.from.splice(fromIndex, 1);
          fromObject.addChild.to.splice(toIndex, 1);
          canvas.remove(fromLine);
        }
      });
    });
    activePort.set({
      strokeWidth: 1,
      stroke: 'gray',
    });
    setActivePort(null);
    canvas.renderAll();
  } else {
    setActivePort(item);
    item.set({ strokeWidth: 2, stroke: 'black' });
  }
});
