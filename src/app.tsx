import React, { useEffect } from 'react';
import { setPixiRoot } from '@store/pixi/pixi';
import { onMouseMoveHandler } from '@store/pixi/cursorPosition';
import { onWheel } from '@store/pixi/scrollPosition';
import cx from 'clsx';
import { $cursorType } from '@store/pixi/cursorType';
import { useStore } from 'effector-react';
import { onClickStart } from '@store/pixi/pixiOnClick';

import CommonScene from '@components/commonScene/commonScene';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './app.scss';
import { Space } from 'react-zoomable-ui';
import ZoomableScene from '@components/ZoomableScene/ZoomableScene';

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
      <ZoomableScene className="wrapper">
        <CommonScene />
      </ZoomableScene>
      {/* <Space className='wrapper'>
        <CommonScene />
      </Space> */}
      {/* <TransformWrapper wheel={{ step: 0.1 }} maxScale={16} minScale={0.2} centerZoomedOut={false}>
        <TransformComponent wrapperClass="wrapper">
          <CommonScene />
        </TransformComponent>
      </TransformWrapper> */}
    </div>
  );
};

export default App;
