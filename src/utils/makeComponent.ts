import { openFileInIdeaFx } from '@store/ideaApi';
import { setModal } from '@store/modals';
import { Event } from 'effector';
import { fabric } from 'fabric';

type Component = Array<
  string & {
    rPath?: string;
    path?: string;
    blocks?: string[];
    configOutput?: string;
    defaultPath?: string;
    name?: string;
  }
>;

type Element = [name: string, components: Array<Component>];

export const makeAtomComponent = (
  element: Element,
  makeConnection: Event<fabric.Circle>,
  index: number,
  previousBottom: null | number,
) => {
  const [name, components] = element;
  const boxWidth = 300;
  // const boxHeight = 140 + (components.length - 1) * 100 + 20;
  let boxHeight = 68;

  components.forEach((item) => {
    boxHeight += 82 + 20;
    boxHeight += item[1].blocks?.length * 19 + 5;
  });

  const rect = new fabric.Rect({
    height: boxHeight,
    width: boxWidth,
    fill: 'rgb(33, 38, 46)',
    rx: 10, // horizontal border radius
    ry: 10, // vertical border radius
    name: 'rootRect',
  });

  const nameTitle = new fabric.Text(name, {
    originX: 'center',
    top: 10,
    left: 150,
    fontSize: 18,
    fill: 'white',
    fontWeight: 600,
  });

  let prevBottom = 38;

  const atoms = components.map((item) => {
    const { blocks } = item[1];

    const rectHeigh = 82 + 19 * blocks.length + 5;

    const rect1 = new fabric.Rect({
      top: 0,
      left: 0,
      fill: 'rgb(139, 154, 174)',
      width: boxWidth - 20,
      height: rectHeigh,
      rx: 10,
      ry: 10,
    });

    const text1 = new fabric.Text('name', {
      top: 4,
      left: 4,
      fill: 'black',
      fontSize: 11,
    });

    const text2 = new fabric.Text('template', {
      originX: 'right',
      top: 4,
      left: boxWidth - 20 - 4,
      fill: 'black',
      fontSize: 11,
    });

    const text3 = new fabric.Text(item[1].name || name, {
      top: 15,
      left: 4,
      fill: 'black',
      fontSize: 16,
    });

    const text4 = new fabric.Text(item[0], {
      originX: 'right',
      top: 15,
      left: boxWidth - 20 - 4,
      fill: 'black',
      fontSize: 16,
    });

    const rect2 = new fabric.Rect({
      top: 41,
      width: boxWidth - 20,
      height: 19 * blocks.length + 5,
      fill: 'rgb(118, 128, 142)',
    });

    const blocksTexts = blocks.map((el, i) => {
      let url = `${item[1].configOutput}/`;
      if (item[1].defaultPath) {
        url += item[1].defaultPath;
      }
      if (item[1].rPath) {
        url += item[1].rPath;
      }
      url += el;
      const blockText = new fabric.Text(el.slice(1), {
        top: 46 + 19 * i,
        left: 4,
        fill: 'rgb(0, 71, 177)',
        fontSize: 14,
        hoverCursor: 'pointer',
        underline: true,
        name: `link?${url}`,
      });

      blockText.on('mousedown', () => openFileInIdeaFx(url));

      return blockText;
    });

    const pathTitle = new fabric.Text('path', {
      originY: 'bottom',
      top: rectHeigh - 20,
      left: 4,
      fontSize: 10,
      fill: 'black',
    });

    const pathText = new fabric.Text(`${item[1].defaultPath}`, {
      originY: 'bottom',
      top: rectHeigh - 4,
      left: 4,
      fontSize: 14,
      fill: 'white',
    });

    const rPathText = new fabric.Text(item[1].rPath ? `${item[1].rPath}` : '', {
      originY: 'bottom',
      top: rectHeigh - 4,
      left: 4 + pathText.width,
      fontSize: 14,
      fill: 'black',
    });

    const openFolder = new fabric.Text('Open folder', {
      originY: 'bottom',
      originX: 'right',
      top: rectHeigh - 4,
      left: boxWidth - 20 - 4,
      fontSize: 10,
      fill: 'rgb(0, 71, 177)',
      underline: true,
      hoverCursor: 'pointer',
    });

    openFolder.on('mousedown', () => openFileInIdeaFx('src/store/fabric/fabric.ts'));

    const atomGroup = new fabric.Group(
      [rect1, text1, text2, text3, text4, rect2, ...blocksTexts, pathTitle, pathText, rPathText, openFolder],
      {
        top: prevBottom,
        left: 10,
        subTargetCheck: true,
      },
    );

    prevBottom += atomGroup.height + 20;

    return atomGroup;
  });

  const port1 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth / 2 - 5,
    top: -5,
    name: 'port1',
    hoverCursor: 'pointer',
  });

  port1.on('mousedown', () => makeConnection(port1));

  const port2 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth - 5,
    top: boxHeight / 2 - 5,
    name: 'port2',
    hoverCursor: 'pointer',
  });

  port2.on('mousedown', () => makeConnection(port2));

  const port3 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth / 2 - 5,
    top: boxHeight - 5,
    name: 'port3',
    hoverCursor: 'pointer',
  });

  port3.on('mousedown', () => makeConnection(port3));

  const port4 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: -5,
    top: boxHeight / 2 - 5,
    name: 'port4',
    hoverCursor: 'pointer',
  });

  port4.on('mousedown', () => makeConnection(port4));

  const addItemRect = new fabric.Rect({
    top: 0,
    left: 0,
    height: 20,
    width: 70,
    rx: 5,
    ry: 5,
    fill: 'rgb(167, 183, 205)',
  });

  const addItemText = new fabric.Text('add item', {
    originX: 'center',
    originY: 'center',
    top: 10,
    left: 35,
    fontSize: 12,
    fill: 'black',
  });

  const addItem = new fabric.Group([addItemRect, addItemText], {
    originY: 'bottom',
    top: boxHeight - 10,
    left: 10,
    hoverCursor: 'pointer',
    name: 'addItem',
  });

  const group = new fabric.Group([rect, nameTitle, ...atoms, port1, port2, port3, port4, addItem], {
    top: previousBottom + 20,
    left: 200 + boxWidth * index + 20 * index,
    hasControls: false,
    subTargetCheck: true,
  });

  addItem.on('mousedown', () => setModal({ name: 'addAtomItem', additionalData: { elementName: name, group } }));

  return group;
};

export const makeModuleComponent = (
  element,
  makeConnection: Event<fabric.Circle>,
  index: number,
  groupIndex: number,
  previousBottom: null | number,
) => {
  const [name, type] = element;
  const boxWidth = 180;
  const boxHeight = 124;
  const rect = new fabric.Rect({
    top: 0,
    left: 0,
    width: boxWidth,
    height: boxHeight,
    fill: 'rgb(33, 38, 46)',
    rx: 10, // horizontal border radius
    ry: 10, // vertical border radius
  });

  const title = new fabric.Text(`name: ${name}`, {
    originX: 'left',
    left: 10, // half of main rect width using for proper centering
    top: 10,
    fontSize: 14,
    fill: 'white',
  });

  const port1 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth / 2 - 5,
    top: -5,
    name: 'port',
    hoverCursor: 'pointer',
  });

  port1.on('mousedown', () => makeConnection(port1));

  const port2 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth - 5,
    top: boxHeight / 2 - 5,
    name: 'port',
    hoverCursor: 'pointer',
  });

  port2.on('mousedown', () => makeConnection(port2));

  const port3 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: boxWidth / 2 - 5,
    top: boxHeight - 5,
    name: 'port',
    hoverCursor: 'pointer',
  });

  port3.on('mousedown', () => makeConnection(port3));

  const port4 = new fabric.Circle({
    radius: 5,
    fill: 'white',
    stroke: 'gray',
    left: -5,
    top: boxHeight / 2 - 5,
    name: 'port',
    hoverCursor: 'pointer',
  });

  port4.on('mousedown', () => makeConnection(port4));

  const rectData = new fabric.Rect({
    width: boxWidth - 20,
    height: 80,
    fill: 'rgb(118, 128, 142)',
  });

  const typeTitle = new fabric.Text('type:', {
    top: 5,
    left: 5,
    fontSize: 10,
  });

  const typeText = new fabric.Text(type, {
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
    hoverCursor: 'pointer',
  });

  button.on('mousedown', () => console.log('Add module item handler doesn`t defined'));

  const groupData = new fabric.Group([rectData, typeTitle, typeText, pathTitle, path, button], {
    top: 34,
    left: 10,
    width: boxWidth - 20,
    subTargetCheck: true,
  });

  const group = new fabric.Group([rect, title, port1, port2, port3, port4, groupData], {
    top: previousBottom ? previousBottom + 10 : 150,
    left: 580,
    subTargetCheck: true,
    hasControls: false,
  });

  return group;
};
;
