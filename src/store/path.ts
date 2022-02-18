import { fsApi } from './fsApi';
import { createEffect, createStore } from './rootDomain';

export const getProjectPathFx = createEffect(async () => await fsApi.get('/path'));

export const $projectPath = createStore(null).on(getProjectPathFx.doneData, (_, projectPath) => projectPath);
