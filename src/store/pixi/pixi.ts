import * as PIXI from 'pixi.js';
import { createEvent, createStore, restore, sample } from '@store/rootDomain';
import { $zoom } from '@store/pixi/zoom';
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
    this.rect.lineStyle(1, 0x333333);
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

const rects = new Array(3600).fill(null).map((el, i) => {
  const rowCount = 60;
  const size = 64;
  const x = (i % rowCount) * size;
  const y = Math.floor(i / rowCount) * size;
  return new Entry({ x, y, w: size, h: size, title: `${i % rowCount} : ${Math.floor(i / rowCount)}` });
});

$pixi.watch((p) => {
  if (!p) return null;

  p.ticker.add(tick);

  rects.forEach((el) => {
    el.render(p);
  });
});

const SCROLL_SENSITIVITY = 0.25;

sample({
  source: { pixi: $pixi, scrollX: $scrollX, scrollY: $scrollY, cursorPosition: $cursorPosition, zoom: $zoom },
  clock: tick,
  fn: ({ pixi, scrollX, scrollY, cursorPosition, zoom }, delta) => ({
    pixi,
    scrollX,
    scrollY,
    delta,
    cursorPosition,
    zoom,
  }),
}).watch(({ scrollX, scrollY, pixi, delta, cursorPosition, zoom }) => {
  // if (pixi.stage.x > scrollX * -1) {
  //   pixi.stage.x -= scrollX * -1;
  //   // pixi.stage.x -= Math.ceil(Math.max((pixi.stage.x - scrollX * -1) * delta * SCROLL_SENSITIVITY, 1));
  // } else if (pixi.stage.x < scrollX * -1) {
  //   // pixi.stage.x += Math.ceil(Math.max((scrollX * -1 - pixi.stage.x) * delta * SCROLL_SENSITIVITY, 1));
  // }
  //
  // if (pixi.stage.y > scrollY * -1) {
  //   pixi.stage.y -= scrollY * -1;
  //   // pixi.stage.y -= Math.ceil(Math.max((pixi.stage.y - scrollY * -1) * delta * SCROLL_SENSITIVITY, 1));
  // } else if (pixi.stage.y < scrollY * -1) {
  //   // pixi.stage.y += Math.ceil(Math.max((scrollY * -1 - pixi.stage.y) * delta * SCROLL_SENSITIVITY, 1));
  // }

  const cursorX = cursorPosition.x / window.innerWidth;
  const cursorY = cursorPosition.y / window.innerHeight;

  const prevZoom = pixi.stage.scale.x;

  if (zoom > pixi.stage.scale.x) {
    // pixi.stage.scale.x += (zoom - pixi.stage.scale.x) * delta * 0.2;
    // pixi.stage.scale.y += (zoom - pixi.stage.scale.y) * delta * 0.2;

    pixi.stage.scale.x = zoom;
    pixi.stage.scale.y = zoom;

    console.log('Вся нужная штука:', {
      scale: zoom,
      w: window.innerWidth,
      stageX: pixi.stage.x,
      moved: (window.innerWidth - window.innerWidth / zoom) * cursorX,
      cursorX,
      cursorXKoef: cursorPosition.x,
    });

    pixi.stage.x -= (window.innerWidth - window.innerWidth / 2) * cursorX;
    pixi.stage.y -= (window.innerHeight - window.innerHeight / 2) * cursorY;

    // console.log({
    //   cursorX,
    //   zoom,
    //   screenWidth: window.innerWidth,
    //   scale: pixi.stage.scale.x,
    //   pixiSageX: pixi.stage.x,
    //   moved: (cursorX / zoom) * window.innerWidth,
    // });
    // pixi.stage.x = (x - pixi.stage.x) / pixi.stage.scale.x;
    // pixi.stage.y = (y - pixi.stage.y) / pixi.stage.scale.y;
    // const worldPos = { x: (x - pixi.stage.x) / pixi.stage.scale.x, y: (y - pixi.stage.y) / pixi.stage.scale.y };
    // const newScale = { x: pixi.stage.scale.x + zoom, y: pixi.stage.scale.y + zoom };
    // const newScreenPos = { x: worldPos.x * newScale.x + pixi.stage.x, y: worldPos.y * newScale.y + pixi.stage.y };
    // pixi.stage.x = newScreenPos.x;
    // pixi.stage.y = newScreenPos.y;
  } else if (zoom < pixi.stage.scale.x) {
    // pixi.stage.scale.x -= (pixi.stage.scale.x - zoom) * delta * 0.2;
    // pixi.stage.scale.y -= (pixi.stage.scale.y - zoom) * delta * 0.2;

    pixi.stage.x += (window.innerWidth - window.innerWidth / zoom) * cursorX;
    pixi.stage.y += (window.innerHeight - window.innerHeight / zoom) * cursorY;

    pixi.stage.scale.x = zoom;
    pixi.stage.scale.y = zoom;
  }
});

// sample({
//   source: { pixi: $pixi, scrollY: $scrollY },
//   clock: tick,
//   fn: ({ pixi, scrollY }, delta) => ({ pixi, scrollY, delta }),
// }).watch(({ scrollY, pixi, delta }) => {
//   if (pixi.stage.y > scrollY * -1) {
//     pixi.stage.y -= Math.ceil(Math.max((pixi.stage.y - scrollY * -1) * delta * SCROLL_SENSITIVITY, 1));
//   } else if (pixi.stage.y < scrollY * -1) {
//     pixi.stage.y += Math.ceil(Math.max((scrollY * -1 - pixi.stage.y) * delta * SCROLL_SENSITIVITY, 1));
//   }
// });

sample({
  source: { pixi: $pixi, zoom: $zoom, cursorPosition: $cursorPosition },
  clock: tick,
  fn: ({ pixi, zoom, cursorPosition }, delta) => ({ pixi, zoom, delta, cursorPosition }),
}).watch(({ pixi, zoom, delta, cursorPosition: { x, y } }) => {
  // zoom.scale.y;

  // console.log(delta);

  // pixi.render();

  // const diff = window.innerWidth / pixi.stage.scale.x;
  // console.log(diff);
  // pixi.stage.x = pixi.stage.x + x - diff;

  if (zoom > pixi.stage.scale.x) {
    // pixi.stage.scale.x += (zoom - pixi.stage.scale.x) * delta * 0.2;
    // pixi.stage.scale.y += (zoom - pixi.stage.scale.y) * delta * 0.2;
    // const cursorX = x / window.innerWidth;
    // const cursorY = y / window.innerHeight;
    // pixi.stage.x -= (cursorX / zoom) * window.innerWidth;
    // pixi.stage.y -= (cursorY / zoom) * window.innerHeight;
    // console.log({
    //   cursorX,
    //   zoom,
    //   screenWidth: window.innerWidth,
    //   scale: pixi.stage.scale.x,
    //   pixiSageX: pixi.stage.x,
    //   moved: (cursorX / zoom) * window.innerWidth,
    // });
    // pixi.stage.x = (x - pixi.stage.x) / pixi.stage.scale.x;
    // pixi.stage.y = (y - pixi.stage.y) / pixi.stage.scale.y;
    // const worldPos = { x: (x - pixi.stage.x) / pixi.stage.scale.x, y: (y - pixi.stage.y) / pixi.stage.scale.y };
    // const newScale = { x: pixi.stage.scale.x + zoom, y: pixi.stage.scale.y + zoom };
    // const newScreenPos = { x: worldPos.x * newScale.x + pixi.stage.x, y: worldPos.y * newScale.y + pixi.stage.y };
    // pixi.stage.x = newScreenPos.x;
    // pixi.stage.y = newScreenPos.y;
  } else if (zoom < pixi.stage.scale.x) {
    pixi.stage.scale.x -= (pixi.stage.scale.x - zoom) * delta * 0.2;
    pixi.stage.scale.y -= (pixi.stage.scale.y - zoom) * delta * 0.2;
  }

  if (zoom > pixi.stage.scale.x) {
    // const { stage } = pixi;
    // const s = zoom;
    // const worldPos = { x: (x - stage.x) / stage.scale.x, y: (y - stage.y) / stage.scale.y };
    // const newScale = { x: stage.scale.x + s, y: stage.scale.y + s };
    //
    // const newScreenPos = { x: worldPos.x * newScale.x + stage.x, y: worldPos.y * newScale.y + stage.y };
    //
    // stage.x -= newScreenPos.x - x;
    // stage.y -= newScreenPos.y - y;
    // stage.scale.x = newScale.x;
    // stage.scale.y = newScale.y;
  } else if (zoom < pixi.stage.scale.x) {
    // pixi.stage.scale.x -= (pixi.stage.scale.x - zoom) * delta * 0.2;
    // pixi.stage.scale.y -= (pixi.stage.scale.y - zoom) * delta * 0.2;
  }
});
