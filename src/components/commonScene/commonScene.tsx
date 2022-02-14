/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useState } from 'react';
import { useEvent, useStore } from 'effector-react';
import { $atomMap, $config } from '@store/sourceMaps';
import cx from 'clsx';
import s from './commonScene.module.scss';
import { loadFromAtom } from '@store/fabric/sourceMapCanvas';
import { $tab, setTab } from '@store/fabric/tab';

const CommonScene = () => {
  const atomMap: any = useStore($atomMap);

  const events = { setTab };
  const tab = useStore($tab);
  
  const config = useStore($config);

  const createAtomPath = (item, name) => {
    const output = config?.output;
    if (typeof item === 'string') {
      const type = atomMap.aliases?.[item] || item;
      if (atomMap?.defaultParams?.[type]?.path) {
        return `${output}/${atomMap.defaultParams[type].path}/${name}.${atomMap.extensions[type]}`;
      }
      return `${output}/${name}.${atomMap.extensions[type]}`;
    }
    if (item[1].path) {
      const type = atomMap.aliases?.[item[0]] || item[0];
      return `${output}/${item[1].path}/${name}.${atomMap.extensions[type]}`;
    }
    if (item[1].rPath && atomMap.defaultParams[item[0]]?.path) {
      return `${output}/${atomMap.defaultParams[item[0]].path}/${item[1].rPath}/${name}.${atomMap.extensions[item[0]]}`;
    }
    return `${output}/${item[1].rPath}//${name}.${atomMap.extensions[item[0]]}`;
  };

  // const renderMap = (map, type) => {
  //   if (type === 'atom') {
  //     Object.entries(map).forEach((element) => {
  //       canvas.add(makeAtomComponent(element as any, handleConnectPorts));
  //     });
  //   }
  // };

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
