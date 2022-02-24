import axios from 'axios';
import { createEffect } from './rootDomain';

const host = 'http://localhost:9999';

const getFx = createEffect(async (endpoint, query) => {
  const result = await axios.get(host + endpoint, { params: query });
  return result.data;
});

const postFx = createEffect<any>(async ({ endpoint, data }) => {
  const result = await axios.post(host + endpoint, { data });
  return result.data;
});

const putFx = createEffect<any>(async ({ endpoint, data }) => {
  const result = await axios.put(host + endpoint, { data });
  return result.data;
});

export const fsApi = {
  get: getFx,
  post: postFx,
  put: putFx,
};
