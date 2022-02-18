import React from 'react';
import { useStore } from 'effector-react';
import cx from 'clsx';
import s from './commonScene.module.scss';
import { $tab, setTab } from '@store/fabric/tab';

const CommonScene = () => {
  const events = { setTab };
  const tab = useStore($tab);
  
  return (
    <div className={s.root}>
      <div className={s.Tabs}>
        <button className={cx({ [s.ActiveButton]: tab === 'JSON' })} onClick={() => events.setTab('JSON')}>JSON</button>
        <button className={cx({ [s.ActiveButton]: tab === 'source-maps' })} onClick={() => events.setTab('source-maps')}>source-maps</button>
      </div>
      <div className={cx(s.CanvasWrapper, { [s.ActiveCanvas]: tab === 'JSON' })}>
        <canvas width={window.innerWidth} height={window.innerHeight} id="canvas" />
      </div>
      <div className={cx(s.CanvasWrapper, { [s.ActiveCanvas]: tab === 'source-maps' })}>
       <canvas width={window.innerWidth} height={window.innerHeight} id="canvas-source-maps" />
      </div>
    </div>
  );
};

export default CommonScene;
