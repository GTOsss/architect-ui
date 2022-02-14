import { createStore, createEvent } from '@store/rootDomain';

type ArrowStyle = 'solid' | 'dashed';
type ConnectionsMode = 'add' | 'delete';

export const setArrowStyle = createEvent<ArrowStyle>();
export const setConnectionsMode = createEvent<ConnectionsMode>();

export const $arrowStyle = createStore<ArrowStyle>('solid').on(setArrowStyle, (_, style) => style);
export const $connectionsMode = createStore('add').on(setConnectionsMode, (_, mode) => mode);
