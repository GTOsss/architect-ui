import { createEvent, createStore } from './rootDomain';

export const setActivePort = createEvent();
export const $activePort = createStore(null).on(setActivePort, (_, port) => port);
