import React, { useEffect } from 'react';
import { setPixiRoot } from '@store/pixi/pixi';
import { onMouseMoveHandler } from '@store/pixi/cursorPosition';
import { onWheel } from '@store/pixi/scrollPosition';
import cx from 'clsx';
import { $cursorType } from '@store/pixi/cursorType';
import { useStore } from 'effector-react';
import { onClickStart } from '@store/pixi/pixiOnClick';
import styles from './app.scss';

const App = () => {
  const cursorType = useStore($cursorType);

  useEffect(() => {
    document.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.addEventListener('wheel', onWheel, { passive: false });
    };
  }, []);

  return (
    <div>
      <div
        className={cx(styles[`pixiRoot__cursor_${cursorType}`])}
        ref={setPixiRoot}
        onMouseMove={onMouseMoveHandler}
        onClick={onClickStart}
      />
      <span style={{ position: 'fixed', right: 0, bottom: 0, backgroundColor: 'white' }} id="debug" />
    </div>
  );
};

export default App;
