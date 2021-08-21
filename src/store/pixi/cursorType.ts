import { createStore } from 'effector';

type CursorType = 'default' | 'pointer';

export const $cursorType = createStore<CursorType>('default');
