import React from 'react';
import cx from 'clsx';
import { useStore } from 'effector-react';
import { $arrowStyle, $connectionsMode, setArrowStyle, setConnectionsMode } from '@store/fabric/canvasModes';
import s from './LeftSidebar.module.scss';
interface ILeftSidebar {
  setModal: (string) => void;
}

const LeftSidebar: React.FC<ILeftSidebar> = ({ setModal }) => {
  const arrowStyle = useStore($arrowStyle);
  const connectionsMode = useStore($connectionsMode);
  const events = { setArrowStyle, setConnectionsMode };

  return (
    <div className={s.root}>
      <ul className={s.Interface}>
        <li className={s.Item}>
          <button onClick={() => setModal('createAtomic')}>Add atomic component</button>
        </li>
        <li className={s.Item}>
          <button onClick={() => setModal('createModule')}>Add module component</button>
        </li>
        <li className={cx(s.Item, { [s.Selected]: arrowStyle === 'solid' })}>
          <button onClick={() => events.setArrowStyle('solid')}>Solid arrow</button>
        </li>
        <li className={cx(s.Item, { [s.Selected]: arrowStyle === 'dashed' })}>
          <button onClick={() => events.setArrowStyle('dashed')}>Dashed arrow</button>
        </li>
        <li className={cx(s.Item, { [s.Selected]: connectionsMode === 'add' })}>
          <button onClick={() => events.setConnectionsMode('add')}>Add connection</button>
        </li>
        <li className={cx(s.Item, { [s.Selected]: connectionsMode === 'delete' })}>
          <button onClick={() => events.setConnectionsMode('delete')}>Delete connection</button>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
