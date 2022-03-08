import { createEvent, createStore } from './rootDomain';

type SetModal = {
  name: string;
  additionalData?: any;
};

const initialState = {
  createAtomic: {
    isOpen: false,
  },
  createModule: {
    isOpen: false,
  },
  addAtomItem: {
    isOpen: false,
    additionalData: null,
  },
};

export const setModal = createEvent<SetModal>();

export const $modals = createStore(initialState).on(setModal, (state, modal) => {
  const { name, ...rest } = modal;
  return {
    ...state,
    [name]: {
      ...state[name],
      isOpen: !state[name].isOpen,
      ...rest,
    },
  };
});

$modals.watch((value) => console.log(value));
