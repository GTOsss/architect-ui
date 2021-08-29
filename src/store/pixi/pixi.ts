import * as PIXI from 'pixi.js';
import { createEvent, createStore, restore, sample } from '@store/rootDomain';
import { $zoom } from '@store/pixi/zoom';
import { combine } from 'effector';
import { Cursor } from '@components/pixiElements/cursor';
import { pixiScene } from '@components/pixiScene';
import { $cursorPositionPixi } from '@store/pixi/cursorPositionPixi';
import iconPointer from '../../assets/icons/cursor-pointer.svg';
import iconDefault from '../../assets/icons/cursor.svg';
import { $cursorPosition } from './cursorPosition';
import { $scrollX, $scrollY } from './scrollPosition';

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

export const $pixiCursorElement = createStore<Cursor>(null);

sample({
  source: $pixi,
  clock: $pixiRoot.updates.filterMap((root) => root),
  fn: (pixi) => {
    const cursor = new Cursor({ pixi, iconDefault, iconPointer });
    cursor.render();
    return cursor;
  },
  target: $pixiCursorElement,
});

$pixi.watch((pixi) => pixiScene({ pixi }));

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

combine({
  pixiCursorElement: $pixiCursorElement,
  cursorPositionPixi: $cursorPositionPixi,
})
  .updates.filter({ fn: ({ pixiCursorElement }) => !!pixiCursorElement })
  .watch(({ pixiCursorElement, cursorPositionPixi: { x, y } }) => {
    pixiCursorElement.x = x;
    pixiCursorElement.y = y;
  });

// dev tools:
// add to jsx: <span style={{ position: 'fixed', right: 0, bottom: 0, backgroundColor: 'white' }} id="debug" />
//
export const $allState = combine({
  pixi: $pixi,
  scrollX: $scrollX,
  scrollY: $scrollY,
  cursorPosition: $cursorPosition,
  zoom: $zoom,
});

tick.watch(() => {
  const { pixi, cursorPosition, zoom, scrollX, scrollY } = $allState.getState();

  // window.pixi = pixi;
  const debug = document.getElementById('debug');
  if (!debug) return;
  debug.innerText = JSON.stringify({
    pixi: { x: pixi.stage.x, y: pixi.stage.y, scale: pixi.stage.scale.x },
    cursorPosition,
    scroll: { scrollX, scrollY },
    zoom,
  });
});
