import { Text } from '@components/pixiElements/text';
import { Rect } from '@components/pixiElements/rect';

export type AnyGeometryObject = Text | Rect;

export type CursorType = 'default' | 'pointer';

export type Event<Element> = {
  target: Element;
};
