import Component from '@components/sceneElements/component/component';
import React from 'react';
import s from './commonScene.module.scss';

const sourceMap = {
  stadiums: [
    'page',
    ['component', { rPath: '/pages' }],
    ['component', { rPath: '/pages/stadiums', name: 'stadiumItem' }],
    'store',
  ],
  stadium: [
    //
    ['page', { rPath: '/stadiums', name: '[code]' }],
    ['component', { rPath: '/pages' }],
    'store',
  ],
  user: [
    //
    ['page', { rPath: '/users', name: 'user' }],
    ['component', { rPath: '/user' }],
    ['component', { rPath: '/userAddition' }],
    'store',
  ],
};

const CommonScene = () => {
  return (
    <div className={s.root}>
      {Object.entries(sourceMap).map(([name, components]) => (
        <div>
          <h2>{name}</h2>
          {components.map((component, j) => (
            <Component
              name={(component[1] as any)?.name || name}
              type={component[0] as string}
              path={(component[1] as any).rPath}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CommonScene;
