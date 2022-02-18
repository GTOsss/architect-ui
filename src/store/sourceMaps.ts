import { createEffect, createStore } from './rootDomain';
import { fsApi } from './fsApi';

// effects

export const getAtomMapFx = createEffect(async () => await fsApi.get('/source-map/atom'));
export const getModuleMapFx = createEffect(async () => await fsApi.get('/source-map/module'));
export const getConfigFx = createEffect(async () => await fsApi.get('/config'));

// stores

export const $atomMap = createStore(null).on(getAtomMapFx.doneData, (_, atomData) => atomData);
export const $moduleMap = createStore(null).on(getModuleMapFx.doneData, (_, moduleData) => moduleData);
export const $config = createStore(null).on(getConfigFx.doneData, (_, configData) => configData);
