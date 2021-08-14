import * as PIXI from 'pixi.js';
import { createEvent, createStore, restore, sample } from '@store/rootDomain';
import { $zoom } from '@store/pixi/zoom';
import { combine } from 'effector';
import { $cursorPosition } from './cursorPosition';
import { $scrollX, $scrollY } from './scrollPosition';
import { Rect, Text } from './uiElements';

export const setPixiRoot = createEvent<HTMLDivElement>();

export const $pixiRoot = restore<HTMLDivElement>(setPixiRoot, null);

export const $pixi = createStore(
  new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    antialias: true,
  }),
);

sample({
  source: $pixi,
  clock: $pixiRoot.updates.filterMap((root) => root),
  fn: (pixi, root) => ({ pixi, root }),
}).watch(({ pixi, root }) => root.appendChild(pixi.view));

export const tick = createEvent<number>();

/// tests

const sourceMap = {
  stadiums: [
    'page',
    ['component', { rPath: '/pages' }],
    ['component', { rPath: '/pages/stadiums', name: 'stadiumItem' }],
    'store',
  ],
  stadium: [
    //
    ['page', { rPath: '/stadiums', name: '[code]' }],
    ['component', { rPath: '/pages' }],
    'store',
  ],
};

// const rects = new Array(5000).fill(null).map((el, i) => {
//   const rowCount = 60;
//   const size = 100;
//   const x = (i % rowCount) * size;
//   const y = Math.floor(i / rowCount) * size;
//   return new Entry({ x, y, w: size, h: size, title: `${i % rowCount} : ${Math.floor(i / rowCount)}` });
// });

const getComponentName = (component, name: string): string => {
  if (typeof component === 'string') {
    return name;
  }

  if (component[1]) {
    return component[1].name || name;
  }

  return name;
};

const getTemplateName = (component): string => {
  if (Array.isArray(component)) {
    return component[0];
  }

  return component;
};

$pixi.watch((pixi) => {
  if (!pixi) return null;

  pixi.stage.x = -0;

  pixi.ticker.add(tick);

  Object.entries(sourceMap).forEach(([name, components], i) => {
    const rectComponents = components.map((component, i) => {
      return new Rect({
        bgColor: 0x76808e,
        marginBottom: 10,
        children: [
          new Rect({
            bgColor: 0x8b9aae,
            padding: 4,
            paddingBottom: 10,
            children: [
              new Text({ text: 'name', style: { fill: 'black', fontSize: 12 } }),
              new Text({
                y: 4,
                text: 'template',
                style: { fill: 'black', fontSize: 12 },
                right: 20,
                align: 'right',
                position: 'absolute',
              }),
              new Text({
                text: getComponentName(component, name),
                marginTop: 4,
                style: { fill: 'black', fontSize: 16 },
              }),
              new Text({
                text: getTemplateName(component),
                style: { fill: 'black', fontSize: 16 },
                y: 18,
                align: 'right',
                position: 'absolute',
              }),
            ],
          }),
          new Text({ text: `test ${i}`, style: { fill: 'black', fontSize: 18 } }),
          new Rect({
            padding: 5,
            h: 20,
            bgColor: 0x8b9aae,
            children: [new Text({ text: 'path', style: { fill: 'black', fontSize: 12 } })],
          }),
        ],
      });
    });

    const rect = new Rect({
      pixi,
      x: i * 300 + i * 20 + 10,
      y: 10,
      w: 300,
      paddingTop: 12,
      paddingLeft: 10,
      paddingRight: 10,
      bgColor: 0x21262e,
      borderRadius: 10,
      children: [
        new Text({ text: name, style: { fill: 'white', fontSize: 18 }, y: 6, align: 'center' }),
        ...rectComponents,
        new Rect({
          bgColor: 0xa7b7cd,
          marginBottom: 10,
          marginTop: 10,
          w: 100,
          h: 26,
          borderRadius: 5,
          children: [new Text({ text: 'add item', style: { fill: 'black', fontSize: 16 }, y: 4, align: 'center' })],
        }),
      ],
    });

    // const text = new Text({ pixi, text: name, style: { fill: 'black', fontSize: 14 }, x: 0, y: 0 });
    // text.render();

    window.r = rect;
    rect.render();

    // const children = components.map((el) => {
    //   const component = new Component({ pixi: p, x, y, w, name });
    //   return component;
    // });
    // const entry = new Entry({ pixi: p, x, y: 50, w: entryWidth, title: name, children });
  });
});

const WHEEL_ANIMATION_SPEED = 0.4;

sample({
  source: { pixi: $pixi, scrollX: $scrollX, scrollY: $scrollY },
  clock: tick,
  fn: ({ pixi, scrollX, scrollY }, delta) => ({
    pixi,
    scrollX,
    scrollY,
    delta,
  }),
}).watch(({ scrollX, scrollY, pixi, delta }) => {
  if (pixi.stage.x > scrollX * -1) {
    pixi.stage.x -= Math.ceil(Math.max((pixi.stage.x - scrollX * -1) * delta * WHEEL_ANIMATION_SPEED, 1));
  } else if (pixi.stage.x < scrollX * -1) {
    pixi.stage.x += Math.ceil(Math.max((scrollX * -1 - pixi.stage.x) * delta * WHEEL_ANIMATION_SPEED, 1));
  }

  if (pixi.stage.y > scrollY * -1) {
    pixi.stage.y -= Math.ceil(Math.max((pixi.stage.y - scrollY * -1) * delta * WHEEL_ANIMATION_SPEED, 1));
  } else if (pixi.stage.y < scrollY * -1) {
    pixi.stage.y += Math.ceil(Math.max((scrollY * -1 - pixi.stage.y) * delta * WHEEL_ANIMATION_SPEED, 1));
  }
});

const calcZoom = ({ cursorPosition, stagePosition, stageScale, zoom }) => {
  const worldPos = (cursorPosition - stagePosition) / stageScale;
  const newScreenPos = worldPos * zoom + stagePosition;
  return Math.round((stagePosition - (newScreenPos - cursorPosition)) * -1);
};

sample({
  source: { pixi: $pixi, scrollX: $scrollX, scrollY: $scrollY, cursorPosition: $cursorPosition, zoom: $zoom },
  clock: combine({ $zoom }),
  fn: ({ pixi, cursorPosition, zoom }) =>
    calcZoom({
      cursorPosition: cursorPosition.x,
      stagePosition: pixi.stage.x,
      stageScale: pixi.stage.scale.x,
      zoom,
    }),
  target: $scrollX,
});

sample({
  source: { pixi: $pixi, scrollX: $scrollX, scrollY: $scrollY, cursorPosition: $cursorPosition, zoom: $zoom },
  clock: combine({ $zoom }),
  fn: ({ pixi, cursorPosition, zoom }) =>
    calcZoom({
      cursorPosition: cursorPosition.y,
      stagePosition: pixi.stage.y,
      stageScale: pixi.stage.scale.y,
      zoom,
    }),
  target: $scrollY,
});

sample({
  source: { pixi: $pixi, scrollX: $scrollX, scrollY: $scrollY, cursorPosition: $cursorPosition, zoom: $zoom },
  // clock: combine({ $zoom }),
  clock: tick,
  fn: ({ pixi, zoom }, delta) => ({ pixi, zoom, delta }),
}).watch(({ pixi, zoom, delta }) => {
  const diff = Math.abs(zoom - pixi.stage.scale.x);

  if (pixi.stage.scale.x < zoom) {
    const result = pixi.stage.scale.x + diff * delta * WHEEL_ANIMATION_SPEED;
    // result = Math.round()
    pixi.stage.scale.x = result;
    pixi.stage.scale.y = result;
  } else if (pixi.stage.scale.x > zoom) {
    const result = pixi.stage.scale.x - diff * delta * WHEEL_ANIMATION_SPEED;
    pixi.stage.scale.x = result;
    pixi.stage.scale.y = result;
  }
});

// dev tools:
// add to jsx: <span style={{ position: 'fixed', right: 0, bottom: 0, backgroundColor: 'white' }} id="debug" />
//
const $allState = combine({
  pixi: $pixi,
  scrollX: $scrollX,
  scrollY: $scrollY,
  cursorPosition: $cursorPosition,
  zoom: $zoom,
});

tick.watch(() => {
  const { pixi, cursorPosition, zoom, scrollX, scrollY } = $allState.getState();

  window.pixi = pixi;
  const debug = document.getElementById('debug');
  if (!debug) return;
  debug.innerText = JSON.stringify({
    pixi: { x: pixi.stage.x, y: pixi.stage.y, scale: pixi.stage.scale.x },
    cursorPosition,
    scroll: { scrollX, scrollY },
    zoom,
  });
});
