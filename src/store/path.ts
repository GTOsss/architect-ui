import { fsApi } from './fsApi';
import { createEffect, createStore } from './rootDomain';

export const getProjectPathFx = createEffect(async () => {
  const result = await fsApi.get('/path');
  return result;
});

export const $projectPath = createStore(null).on(getProjectPathFx.doneData, (_, projectPath) => projectPath);
