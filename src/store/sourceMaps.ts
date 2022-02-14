import { createEffect, createStore } from './rootDomain';
import { fsApi } from './fsApi';
import { sample } from 'effector';

export const getAtomMapFx = createEffect(async () => {
  const result = await fsApi.get('/source-map/atom');
  return result;
});

export const getModuleMapFx = createEffect(async () => {
  const result = await fsApi.get('/source-map/module');
  return result;
});

export const getConfigFx = createEffect(async () => {
  const result = await fsApi.get('/config');
  return result;
});

export const $atomMap = createStore(null).on(getAtomMapFx.doneData, (_, atomData) => {
  console.log('doneData')
  return atomData;
});

export const $moduleMap = createStore(null).on(getModuleMapFx.doneData, (_, moduleData) => moduleData);

export const $config = createStore(null).on(getConfigFx.doneData, (_, configData) => configData);

sample({
  clock: getAtomMapFx.doneData,
  fn: () => console.log('sdfkjsdfjksjdfsdjf')
})
