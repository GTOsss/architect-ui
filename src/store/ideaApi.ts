import axios, { AxiosRequestConfig } from 'axios';
import { createEffect } from 'effector';

const initialConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:63342/api',
};

const axiosInstance = axios.create(initialConfig);

const openFile = (path) => `/file?file=${path}`;

export const openFileInIdeaFx = createEffect(async (path) => {
  console.log('click');
  window.open(`vscode://file/${process.env.DIRNAME}/${path}`);
  axiosInstance.get(openFile(path));
});
