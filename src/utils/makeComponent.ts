import { Event } from 'effector';
import { fabric } from 'fabric';

type Component = string | Array<string & { rPath?: string; path?: string }>;

type Element = [name: string, components: Array<Component>];

export const makeAtomComponent = (element: Element, makeConnection: Event<fabric.Circle>, index: number) => {
  const [name, components] = element;
  const boxWidth = 180;
  const boxHeight = 140 + (components.length - 1) * 100 + 20;
  const rect = new fabric.Rect({
    top: 0,
    left: 0,
    width: boxWidth,
    height: boxHeight,
    fill: 'rgb(33, 38, 46)',
    // fill: 'rgb(118, 128, 142)',
    rx: 10, // horizontal border radius
    ry: 10, // vertical border radius
  });

  const title = new fabric.Text(`name: ${name}`, {
    originX: 'left',
    left: 10, // half of main rect width using for proper centering
    top: 10,
    fontSize: 14,
    fill: 'white'
  });

  const port1 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth / 2 - 5,
    top: -5,
    name: 'port',
  });

  port1.on('mousedown', () => makeConnection(port1));

  const port2 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth - 5,
    top: boxHeight / 2 - 5,
    name: 'port',
  });

  port2.on('mousedown', () => makeConnection(port2));

  const port3 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth / 2 - 5,
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

  const blocks = new fabric.Text('Blocks:', {
    top: 34,
    left: 10,
    fill: 'white',
    fontSize: 12,
  })

  const atoms = components.map((component, index) => {
      const componentType = typeof component === 'string' ? component : component[0];
      const rect = new fabric.Rect({
        width: boxWidth - 20,
        height: 80,
        fill: 'rgb(118, 128, 142)',
      });

      const typeTitle = new fabric.Text('type:', {
        top: 5,
        left: 5,
        fontSize: 10,
      });

      const type = new fabric.Text(componentType, {
        top: 15,
        left: 5,
        fontSize: 10,
      });

      const pathTitle = new fabric.Text('path:', {
        originX: 'left',
        top: 30,
        left: 5,
        fontSize: 10,
      });

      const path = new fabric.Text('src/components/button/store.ts', {
        originX: 'left',
        top: 40,
        left: 5,
        fontSize: 10,
      });

      const buttonRect = new fabric.Rect({
        width: 40,
        height: 15,
        rx: 5,
        ry: 5,
        fill: 'rgb(245, 243, 239)',
      });

      const buttonText = new fabric.Text('Open file', {
        originX: 'center',
        originY: 'center',
        top: 7.5,
        left: 20,
        fill: 'rgb(45, 45, 45)',
        fontSize: 10,
      });

      const button = new fabric.Group([buttonRect, buttonText], {
        originX: 'center',
        top: 60,
        left: (boxWidth - 20) / 2,
      });

      const group = new fabric.Group([rect, typeTitle, type, pathTitle, path, button], {
        top: 56 + index * 100,
        left: 10,
        width: boxWidth - 20,
      });

      return group;
  });

  const group = new fabric.Group([rect, title, blocks, port1, port2, port3, port4, ...atoms], {
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



// old 
//  const text = new fabric.Text(component, {
//    originX: 'center',
//    originY: 'center',
//    left: 90, // half of main rect width using for proper centering
//    top: boxHeight / 2 - 15 * (components.length / 2 - index), // centering for cases with several files in component
//    fontSize: 10,
//    fill: 'black',
//  });