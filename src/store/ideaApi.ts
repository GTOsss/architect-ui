import axios, { AxiosRequestConfig } from 'axios';
import { createEffect } from 'effector';

const initialConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:63342/api',
};

const axiosInstance = axios.create(initialConfig);

const openFile = (path) => `/file?file=${path}`;

export const openFileInIdeaFx = createEffect(async (path) => axiosInstance.get(openFile(path)));
