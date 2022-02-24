import { fsApi } from "@store/fsApi";
import { createEffect, createStore } from "@store/rootDomain";

export const getTemplatesFx = createEffect(async () => fsApi.get('/templates'))

export const $templates = createStore(null).on(getTemplatesFx.doneData, (_, templates) => templates);
