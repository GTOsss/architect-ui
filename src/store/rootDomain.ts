import { createDomain, attach, forward, combine, sample, restore, guard, createApi } from 'effector';

const rootDomain = createDomain();

const { createStore, createEffect, createEvent } = rootDomain;

export default rootDomain;
export { createStore, createEffect, createEvent, attach, forward, combine, sample, restore, guard, createApi };
