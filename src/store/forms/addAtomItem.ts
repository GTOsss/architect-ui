import { $sourceMapCanvas } from '@store/fabric/sourceMapCanvas';
import { fsApi } from '@store/fsApi';
import { openFileInIdeaFx } from '@store/ideaApi';
import { $modals, setModal } from '@store/modals';
import { createEvent, createStore, combine, sample } from '@store/rootDomain';
import { $atomMap, $config } from '@store/sourceMaps';
import { createEffect } from 'effector';
import { createForm } from 'effector-react-form';
import { fabric } from 'fabric';

const initialOptions = { path: 'default', template: '' };

const initialValues = {
  absolute_path: '',
  relative_path: '',
  name: '',
};

export const prevStep = createEvent();
export const nextStep = createEvent();
const sendData = createEvent();

export const putAtomItemFx = createEffect(async ({ options, values, valuesMeta }) => {
  const { path, template } = options;

  let data;

  if (path === 'default') {
    if (values.name) {
      data = [template, { name: values.name }];
    } else {
      data = template;
    }
  } else {
    if (path === 'absolute') {
      data = [template, { path: values.absolute_path }];
    } else {
      data = [template, { rPath: values.relative_path }];
    }
    data[1].name = values.name;
  }
  const result = await fsApi.put({ endpoint: `/source-map/atom/${valuesMeta?.elementName}`, data });
  return result;
});

export const form = createForm({ initialValues });

export const optionsForm = createForm({
  initialValues: initialOptions,
  onSubmit: () => nextStep(),
});

export const valuesForm = createForm({
  initialValues,
  onSubmit: () => {
    sendData();
  },
});

export const $step = createStore(0)
  .on(nextStep, (state) => ++state)
  .on(prevStep, (state) => --state);

export const $addAtomState = combine({
  options: optionsForm.$values,
  values: valuesForm.$values,
  step: $step,
});

sample({
  source: { options: optionsForm.$values, values: valuesForm.$values, valuesMeta: valuesForm.$meta },
  clock: sendData,
  target: putAtomItemFx,
});

const addToGroupFx = createEffect(async ({ defaultParams, options, values, meta, blocks, output, canvas }) => {
  console.log(
    'defaultParams: ',
    defaultParams,
    '\n',
    'options: ',
    options,
    '\n',
    'meta: ',
    meta,
    '\n',
    'blocks: ',
    blocks,
    '\n',
    'output: ',
    output,
    'values: ',
    values,
  );
  const rectHeigh = 82 + 19 * blocks.length + 5;
  const boxWidth = 300;

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

  const text3 = new fabric.Text(values.name || meta.elementName, {
    top: 15,
    left: 4,
    fill: 'black',
    fontSize: 16,
  });

  const text4 = new fabric.Text(options.template, {
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
    let url = '';
    if (output && options.path !== 'absolute') {
      url +=
        options.path === 'default'
          ? `${output}/${defaultParams[options.template].path}`
          : `${output}/${defaultParams[options.template].path}/${values.relative_path}`;
    } else if (options.path === 'relative') {
      url += `${defaultParams[options.template]}/${values.relative_path}`;
    } else if (options.path === 'absolute') {
      url += values.absolute_path;
    } else {
      url += defaultParams[options.template].path;
    }
    url += el.slice(0);
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

  const pathText = new fabric.Text(`${defaultParams[options.template].path}`, {
    originY: 'bottom',
    top: rectHeigh - 4,
    left: 4,
    fontSize: 14,
    fill: 'white',
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

  const { group } = meta;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const objects = group.getObjects();

  const rootRect = objects.find((item) => item.name === 'rootRect');
  const addItem = objects.find((item) => item.name === 'addItem');
  const port2 = objects.find((item) => item.name === 'port2');
  const port3 = objects.find((item) => item.name === 'port3');
  const port4 = objects.find((item) => item.name === 'port4');

  const atomGroup = new fabric.Group(
    [rect1, text1, text2, text3, text4, rect2, ...blocksTexts, pathTitle, pathText, openFolder],
    {
      top: group.top + group.height - addItem.height - 10,
      left: group.left + 15, // 10 is group padding and 5 is left port`s offset
      subTargetCheck: true,
    },
  );

  if (values.absolute_path) {
    const absPath = new fabric.Text(`${values.absolute_path}`, {
      originY: 'bottom',
      top: atomGroup.top + atomGroup.height - 5,
      left: atomGroup.left + 4,
      fontSize: 14,
      fill: 'black',
    });

    atomGroup.remove(pathText);
    atomGroup.addWithUpdate(absPath);
  }

  if (values.relative_path) {
    const rPathText = new fabric.Text(`/${values.relative_path}`, {
      originY: 'bottom',
      top: atomGroup.top + atomGroup.height - 5,
      left: atomGroup.left + pathText.width + 4,
      fontSize: 14,
      fill: 'black',
    });

    atomGroup.addWithUpdate(rPathText);
  }
  addItem.top += atomGroup.height + 20;
  rootRect.height += atomGroup.height + 20;

  port2.top += atomGroup.height / 2 + 10;
  port3.top += atomGroup.height + 20;
  port4.top += atomGroup.height / 2 + 10;

  group.addWithUpdate(atomGroup);
  canvas.renderAll();
  return {};
});

sample({
  source: { atomMap: $atomMap, canvas: $sourceMapCanvas, config: $config },
  clock: putAtomItemFx.done,
  fn: ({ atomMap: { defaultParams }, config: { output }, canvas }, { params, result }) => ({
    defaultParams,
    options: params.options,
    values: params.values,
    meta: params.valuesMeta,
    blocks: result,
    output,
    canvas,
  }),
  target: addToGroupFx,
});

sample({
  clock: addToGroupFx.done,
  fn: () => ({
    name: 'addAtomItem',
    additionalData: null,
  }),
  target: setModal,
});

sample({
  clock: addToGroupFx.doneData,
  fn: () => initialValues,
  target: valuesForm.$values,
});

sample({
  clock: addToGroupFx.doneData,
  fn: () => initialOptions,
  target: optionsForm.$values,
});
