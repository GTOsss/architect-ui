import { AnyGeometryObject } from '@store/pixi/uiElements/types';

const getStaticBeforeElements = (ctx: AnyGeometryObject) => {
  let indexOfCurrentElement = ctx.parent?.children?.findIndex(({ id }) => ctx.id === id) || 0;
  indexOfCurrentElement = indexOfCurrentElement === -1 ? 0 : indexOfCurrentElement;
  const beforeElements = ctx.parent?.children?.slice(0, indexOfCurrentElement) || [];
  return beforeElements.filter(({ position }) => position === 'static');
};

export const yGetter = (ctx: AnyGeometryObject) => {
  if (ctx.bottom !== null) {
    return ctx.parent?.y + ctx.parent?.h - ctx.h - ctx.bottom;
  }

  if (ctx.parent && ctx.parent.display === 'flex') {
    return ctx.parent.y + ctx.parent.paddingTop;
  }

  if (ctx._y === null) {
    const sumOfHeightBeforeElements = getStaticBeforeElements(ctx).reduce(
      (acc, { h, marginTop, marginBottom }) => acc + h + marginTop + marginBottom,
      0,
    );
    return ctx.parent?.y + ctx.parent?.paddingTop + sumOfHeightBeforeElements + ctx.marginTop;
  }

  const parentY = ctx.parent?.y || 0; // relative
  return parentY + ctx._y;
};

export const xGetterForFlex = (ctx: AnyGeometryObject) => {
  const sumOfWidthBeforeElements = getStaticBeforeElements(ctx).reduce(
    (acc, { w, marginLeft, marginRight }) => acc + w + marginLeft + marginRight,
    0,
  );

  return ctx.parent.x + ctx.paddingLeft + sumOfWidthBeforeElements + ctx.marginLeft;
};
