import React from 'react';
import { fabric } from 'fabric';
import cx from 'clsx';
import s from './RightSidebar.module.scss';
import { loadFromJSON } from '@store/fabric/canvasJSON';
import { loadFromAtom } from '@store/fabric/sourceMapCanvas';

interface IRightSidebar {
  atomMap: any;
  moduleMap: any;
  canvasJSON: any;
  json: JSON;
}

const RightSidebar = ({ atomMap, moduleMap, canvasJSON, json }) => {
  const events = { loadFromJSON, loadFromAtom };
  const handleLoadFromJSON = () => {
    canvasJSON.clear();
  };

  const handleClearCanvas = () => {
    canvasJSON.clear();
  };

  return (
    <div className={s.root}>
      <ul>
        <li className={cx(s.Item, { [s.Disabled]: !json })}>
          <button onClick={events.loadFromJSON} disabled={!json}>
            Load from JSON
          </button>
        </li>
        <li className={cx(s.Item, { [s.Disabled]: !atomMap?.map })}>
          <button onClick={() => events.loadFromAtom()} disabled={!json}>
            Load from atom source
          </button>
        </li>
        <li className={cx(s.Item, { [s.Disabled]: !moduleMap?.map })}>
          <button onClick={handleLoadFromJSON} disabled={!json}>
            Load from module source
          </button>
        </li>
        <li className={cx(s.Item, { [s.Disabled]: !canvasJSON })}>
          <button onClick={handleClearCanvas} disabled={!canvasJSON}>
            Clear canvasJSON
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RightSidebar;
