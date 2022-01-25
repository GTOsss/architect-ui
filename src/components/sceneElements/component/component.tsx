import { openFileInIdeaFx } from '@store/ideaApi';
import React from 'react';
import s from './component.module.scss';

type Props = {
  name: string;
  type: string;
  path: string;
};

const Component = ({ name, type, path }: Props) => {
  return (
    <div className={s.root}>
      <h2>{name}</h2>
      <span>type: {type}</span>
      <button onClick={() => openFileInIdeaFx(path)}>openFile</button>
    </div>
  );
};

export default Component;
