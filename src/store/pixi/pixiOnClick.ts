import { createEvent, sample } from 'effector';
import { AnyGeometryObject } from '@components/pixiElements/types';
import { $hoverElements } from '@store/pixi/pixiHover';

export const onClickStart = createEvent<unknown>();

// Событие клика со всеми ховер элементами
export const onClick = createEvent<{ targets: AnyGeometryObject[] }>();

// Когда сработает основное событие onClick, возьмем $hoverElements и передадим в onClick
sample({
  source: $hoverElements,
  clock: onClickStart,
  fn: (hoverElements) => ({
    targets: hoverElements,
  }),
  target: onClick,
});

onClick.watch(({ targets }) =>
  targets.forEach((target) => {
    if (target.onClick) {
      target.onClick({ target: target as any });
    }
  }),
);
