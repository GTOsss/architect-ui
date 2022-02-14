import { Event } from 'effector';
import { fabric } from 'fabric';

type Component = string | Array<string & { rPath?: string; path?: string }>;

type Element = [name: string, components: Array<Component>];

export const makeAtomComponent = (element: Element, makeConnection: Event<fabric.Circle>, index: number) => {
  const [name, components] = element;
  const boxWidth = 180;
  const boxHeight = 190 + components.length * 20;
  const rect = new fabric.Rect({
    top: 0,
    left: 0,
    width: boxWidth,
    height: boxHeight,
    fill: 'rgba(90, 90, 90)',
    rx: 10, // horizontal border radius
    ry: 10, // vertical border radius
  });

  const title = new fabric.Text(name, {
    originX: 'center',
    left: 90, // half of main rect width using for proper centering
    top: 10,
    fontSize: 20,
  });

  const port1 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: 85,
    top: -5,
    name: 'port',
  });

  port1.on('mousedown', () => makeConnection(port1));

  const port2 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: 175,
    top: boxHeight / 2 - 5,
    name: 'port',
  });

  port2.on('mousedown', () => makeConnection(port2));

  const port3 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: 85,
    top: boxHeight - 5,
    name: 'port',
  });

  port3.on('mousedown', () => makeConnection(port3));

  const port4 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: -5,
    top: boxHeight / 2 - 5,
    name: 'port',
  });

  port4.on('mousedown', () => makeConnection(port4));

  const atoms = components.map((component, index) => {
    if (typeof component === 'string') {
      const text = new fabric.Text(component, {
        originX: 'center',
        originY: 'center',
        left: 90, // half of main rect width using for proper centering
        top: boxHeight / 2 - 15 * (components.length / 2 - index), // centering for cases with several files in component
        fontSize: 10,
      });
      
      return text;
    }
    const text = new fabric.Text(component[0], {
      originX: 'center',
      originY: 'center',
      left: 90, // half of main rect width using for proper centering
      top: boxHeight / 2 - 15 * (components.length / 2 - index), // centering for cases with several files in component
      fontSize: 10,
    });
    return text;
  });

  const group = new fabric.Group([rect, title, port1, port2, port3, port4, ...atoms], {
    top: 250,
    left: 500 + (boxWidth + 20) * index,
    hasControls: false, // disable scaling and rotating corners
    subTargetCheck: true, // allows you to check events on the nested elements
  });
  return group;
};

// const atoms = components.map((component, index) => {
//     if (typeof component === 'string') {
//       const block = new fabric.Rect({
//         width: boxWidth,
//         height: 20,
//         top: 0,
//         fill: 'rgb(163, 163, 163)',
//       });
//       const text = new fabric.Text(component, {
//         originX: 'center',
//         originY: 'center',
//         left: 90, // half of main rect width using for proper centering
//         top: 15, // centering for cases with several files in component
//         fontSize: 10,
//       });

//       const group = new fabric.Group([block, text], {
//         top: boxHeight / 2 - 30 * (components.length / 2 - index),
//       });

//       return group;
//     }
//     const block = new fabric.Rect({
//       width: boxWidth,
//       height: 20,
//       top: 0,
//       fill: 'rgb(163, 163, 163)',
//     });
//     const text = new fabric.Text(component[0], {
//       originX: 'center',
//       originY: 'center',
//       left: 90, // half of main rect width using for proper centering
//       top: 15, // centering for cases with several files in component
//       fontSize: 10,
//     });

