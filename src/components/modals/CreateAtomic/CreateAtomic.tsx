import React, { MouseEventHandler, Ref, useEffect, useState } from 'react';
import cx from 'clsx';
import axios from 'axios';
import { useEvent, useStore } from 'effector-react';
import { setModal } from '@store/modals';
import { $atomMap } from '@store/sourceMaps';
import s from './CreateAtomic.module.scss';
import { $templates } from '@store/fabric/templates';

// const atomMap = require(`${process.env.DIRNAME}/architect/source_map/source-map-atom`);

interface ICreateAtomic {
  isOpen: boolean;
  ref: Ref<HTMLFormElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const CreateAtomic: React.FC<ICreateAtomic> = React.forwardRef(({ isOpen, onClick }, ref) => {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [rPath, setRPath] = useState('');
  const [pathType, setPathType] = useState('default');
  const [componentType, setComponentType] = useState('');
  const atomMap = useStore($atomMap);
  const templates = useStore($templates);

  const events = useEvent({ setModal });

  const handleMakeTextFile = (newAtomMap, newComponent) => {
    const result = `
    const aliases = ${newAtomMap.aliases ? JSON.stringify(newAtomMap.aliases) : JSON.stringify({})}

    const extensions = ${newAtomMap.extensions ? JSON.stringify(newAtomMap.extensions) : JSON.stringify({})}

    const defaultParams = ${newAtomMap.defaultParams ? JSON.stringify(newAtomMap.defaultParams) : JSON.stringify({})}

    const map = ${
      newAtomMap.map ? JSON.stringify({ ...newAtomMap.map, ...newComponent }) : JSON.stringify({ ...newComponent })
    }

    module.exports = { map, defaultParams, aliases, extensions };
    `;
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComponent: any = {
      [name]: [],
    };
    if (pathType === 'absolute') {
      newComponent[name] = [[componentType, { path: `/${path}` }]];
    } else if (pathType === 'relative') {
      newComponent[name] = [[componentType, { rPath: `/${rPath}` }]];
    } else {
      newComponent[name] = [componentType];
    }
    const data = handleMakeTextFile(atomMap, newComponent);
    axios.post('http://localhost:9999/atom', {
      data,
    });
    events.setModal({ name: 'createAtomic' });
  };

  return (
    <div className={cx(s.root, { [s.isOpen]: isOpen })} onClick={onClick}>
      <form className={s.Form} onSubmit={handleSubmit} ref={ref}>
        <h2>Add atomic component</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Component name" />
        <div className={s.RadioGroup}>
          <span>Set the: </span>
          <input
            type="radio"
            name="path"
            id="default"
            onChange={(e) => setPathType(e.target.id)}
            checked={pathType === 'default'}
          />
          <label htmlFor="relative">default</label>
          <input type="radio" name="path" id="absolute" onChange={(e) => setPathType(e.target.id)} />
          <label htmlFor="absolute">absolute path</label>
          <input type="radio" name="path" id="relative" onChange={(e) => setPathType(e.target.id)} />
          <label htmlFor="relative">relative path</label>
        </div>
        {pathType === 'absolute' && (
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="Path to component"
            required
          />
        )}
        {pathType === 'relative' && (
          <input
            type="text"
            value={rPath}
            onChange={(e) => setRPath(e.target.value)}
            placeholder="Relative path"
            required
          />
        )}
        <input
          type="text"
          value={componentType}
          onChange={(e) => setComponentType(e.target.value)}
          placeholder="Component type"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
});

export default CreateAtomic;
