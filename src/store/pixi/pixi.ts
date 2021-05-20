import * as PIXI from 'pixi.js';
import { createEvent, createStore, restore, sample } from '@store/rootDomain';
import { $zoom } from '@store/pixi/zoom';
import { combine } from 'effector';
import { $cursorPosition } from './cursorPosition';
import { $scrollX, $scrollY } from './scrollPosition';

export const setPixiRoot = createEvent<HTMLDivElement>();

export const $pixiRoot = restore<HTMLDivElement>(setPixiRoot, null);

export const $pixi = createStore(
  new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
  }),
);

sample({
  source: $pixi,
  clock: $pixiRoot.updates.filterMap((root) => root),
  fn: (pixi, root) => ({ pixi, root }),
}).watch(({ pixi, root }) => root.appendChild(pixi.view));

export const tick = createEvent<number>();

/// tests

class Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  paddingRight: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingTop: number;
  rect: PIXI.Graphics;

  constructor({ x, y, w, h, paddingRight = 10, paddingLeft = 10, paddingBottom = 10, paddingTop = 10 }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.paddingLeft = paddingLeft;
    this.paddingRight = paddingRight;
    this.paddingBottom = paddingBottom;
    this.paddingTop = paddingTop;
    this.rect = new PIXI.Graphics();
  }

  render(pixi: PIXI.Application) {
    this.rect.lineStyle(0, 0x333333);
    this.rect.beginFill(
      `0x${[
        parseInt(Math.floor(Math.random() * 255), 16),
        parseInt(Math.floor(Math.random() * 255), 16),
        parseInt(Math.floor(Math.random() * 255), 16),
      ].join('')}`,
    );
    this.rect.drawRect(this.x, this.y, this.w, this.h);
    this.rect.endFill();
    pixi.stage.addChild(this.rect);
  }
}

class Entry extends Rect {
  title: PIXI.Text;

  constructor({ x, y, w, h, paddingRight = 10, paddingLeft = 10, paddingBottom = 10, paddingTop = 10, title }) {
    super({ x, y, w, h, paddingRight, paddingLeft, paddingBottom, paddingTop });
    this.title = new PIXI.Text(title, { fontSize: 60 });
    this.title.x = x + paddingLeft;
    this.title.y = y + paddingTop;
    this.title.scale.x = 0.25;
    this.title.scale.y = 0.25;
  }

  render(pixi: PIXI.Application) {
    super.render(pixi);
    pixi.stage.addChild(this.title);
  }
}

const i = 0;

const rects = new Array(5000).fill(null).map((el, i) => {
  const rowCount = 60;
  const size = 100;
  const x = (i % rowCount) * size;
  const y = Math.floor(i / rowCount) * size;
  return new Entry({ x, y, w: size, h: size, title: `${i % rowCount} : ${Math.floor(i / rowCount)}` });
});

$pixi.watch((p) => {
  if (!p) return null;

  p.stage.x = -0;

  p.ticker.add(tick);

  rects.forEach((el) => {
    el.render(p);
  });
});

const WHEEL_ANIMATION_SPEED = 0.5;

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
// const $allState = combine({
//   pixi: $pixi,
//   scrollX: $scrollX,
//   scrollY: $scrollY,
//   cursorPosition: $cursorPosition,
//   zoom: $zoom,
// });
//
// tick.watch(() => {
//   const { pixi, cursorPosition, zoom, scrollX, scrollY } = $allState.getState();
//
//   window.pixi = pixi;
//   const debug = document.getElementById('debug');
//   if (!debug) return;
//   debug.innerText = JSON.stringify({
//     pixi: { x: pixi.stage.x, y: pixi.stage.y, scale: pixi.stage.scale.x },
//     cursorPosition,
//     scroll: { scrollX, scrollY },
//     zoom,
//   });
// });
//
