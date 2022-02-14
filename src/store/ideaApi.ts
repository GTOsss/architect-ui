import axios, { AxiosRequestConfig } from 'axios';
import { createEffect } from 'effector';
import { $projectPath } from './path';

const initialConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:63342/api',
};

const axiosInstance = axios.create(initialConfig);

const openFile = (path) => `/file?file=${path}`;

export const openFileInIdeaFx = createEffect(async (path) => {
  window.open(`vscode://file/${$projectPath.getState()}/${path}`);
  axiosInstance.get(openFile(path));
});
