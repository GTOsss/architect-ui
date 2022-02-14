import { createEvent, createStore, sample } from '@store/rootDomain';
import { Tab } from 'src/ts';
import { $canvasJSON } from './canvasJSON';
import { removeActivePort } from './handlers';
import { $sourceMapCanvas } from './sourceMapCanvas';

export const setTab = createEvent<Tab>();

export const $tab = createStore<Tab>('source-maps').on(setTab, (_, tab) => tab);

sample({
  source: { sourceMapCanvas: $sourceMapCanvas, canvasJSON: $canvasJSON },
  clock: $tab,
  fn: ({ sourceMapCanvas, canvasJSON }, tab) => ({ sourceMapCanvas, canvasJSON, tab }),
  target: removeActivePort,
});
