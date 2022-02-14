import { createEvent, createStore } from './rootDomain';

const initialState = {
  createAtomic: false,
  createModule: false,
};

export const setModal = createEvent<string>();

export const $modals = createStore(initialState).on(setModal, (state, modal: string) => ({
  ...state,
  [modal]: !state[modal],
}));
