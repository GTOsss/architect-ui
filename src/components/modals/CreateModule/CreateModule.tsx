import React, { MouseEventHandler, Ref, useState } from 'react';
import cx from 'clsx';
import axios from 'axios';
import { useEvent, useStore } from 'effector-react';
import { setModal } from '@store/modals';
import { $moduleMap } from '@store/sourceMaps';
import s from './CreateModule.module.scss';

interface ICreateModule {
  isOpen: boolean;
  ref: Ref<HTMLFormElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const CreateModule: React.FC<ICreateModule> = React.forwardRef(({ isOpen, onClick }, ref) => {
  const [name, setName] = useState('name');
  const [componentType, setComponentType] = useState('component');
  const [path, setPath] = useState('components');
  const moduleMap = useStore($moduleMap);
  const events = useEvent({ setModal });

  const handleMakeTextFile = (newModuleMap, newComponent) => {
    const result = `
    const aliases = ${newModuleMap.aliases ? JSON.stringify(newModuleMap.aliases) : JSON.stringify({})}

    const extensions = ${newModuleMap.extensions ? JSON.stringify(newModuleMap.extensions) : JSON.stringify({})}

    const map = ${
      newModuleMap.map[newComponent.path]
        ? JSON.stringify({
            ...newModuleMap.map,
            [newComponent.path]: {
              ...newModuleMap.map[newComponent.path],
              ...newComponent[newComponent.path],
            },
          })
        : JSON.stringify({
            ...newModuleMap.map,
            [newComponent.path]: { ...newComponent[newComponent.path] },
          })
    }

    module.exports = { map, aliases, extensions };
    `;
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComponent = {
      [path]: {
        [name]: componentType,
      },
      path,
    };

    const data = handleMakeTextFile(moduleMap, newComponent);
    axios.post('http://localhost:9999/module', {
      data,
    });
    events.setModal({ name: 'createModule' });
  };

  return (
    <div className={cx(s.root, { [s.isOpen]: isOpen })} onClick={onClick}>
      <form className={s.Form} ref={ref} onSubmit={handleSubmit}>
        <h2>Add module component</h2>
        <input type="text" value={name} placeholder="Component name" onChange={(e) => setName(e.target.value)} />
        <input
          type="text"
          value={componentType}
          placeholder="Component type"
          onChange={(e) => setComponentType(e.target.value)}
        />
        <input type="text" value={path} placeholder="Component path" onChange={(e) => setPath(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
});

export default CreateModule;
