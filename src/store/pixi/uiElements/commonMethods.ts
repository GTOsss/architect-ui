import { Text } from './text';
import { Rect } from './rect';

type AnyGeometryObject = Text | Rect;

export const yGetter = (ctx: AnyGeometryObject) => {
  if (ctx.bottom !== null) {
    return ctx.parent?.y + ctx.parent?.h - ctx.h - ctx.bottom;
  }

  if (ctx._y === null) {
    let indexOfCurrentElement = ctx.parent?.children?.findIndex(({ id }) => ctx.id === id) || 0;
    indexOfCurrentElement = indexOfCurrentElement === -1 ? 0 : indexOfCurrentElement;
    let beforeElements = ctx.parent?.children?.slice(0, indexOfCurrentElement) || [];
    beforeElements = beforeElements.filter(({ position }) => position === 'static');
    const sumOfHeightBeforeElements = beforeElements.reduce(
      (acc, { h, marginTop, marginBottom }) => acc + h + marginTop + marginBottom,
      0,
    );
    return ctx.parent?.y + ctx.parent?.paddingTop + sumOfHeightBeforeElements + ctx.marginTop;
  }

  const parentY = ctx.parent?.y || 0; // relative
  return parentY + ctx._y;
};
