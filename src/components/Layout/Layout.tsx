import CreateAtomic from '@components/modals/CreateAtomic';
import CreateModule from '@components/modals/CreateModule';
import AddAtomItem from '@components/modals/AddAtomItem';
import { $modals, setModal } from '@store/modals';
import { useEvent, useStore } from 'effector-react';
import React, { MouseEventHandler, useRef } from 'react';
import { nextStep, prevStep } from '@store/forms/addAtomItem';
import LeftSidebar from './LeftSIdebar';
import RightSidebar from './RightSidebar';
import s from './Layout.module.scss';

interface ILayout {
  children: React.ReactNode;
  atomMap: any;
  moduleMap: any;
  canvasJSON: any;
  json: JSON;
}

const Layout: React.FC<ILayout> = ({ children, atomMap, moduleMap, canvasJSON, json }) => {
  const { createAtomic, createModule, addAtomItem } = useStore($modals);
  const moduleRef = useRef(null);
  const atomRef = useRef(null);
  const atomItemRef = useRef(null);
  const events = useEvent({ setModal, prevStep, nextStep });  
  const handleCatchClickOutside = (e: any, ref, name: string) => {
    let targetElement = e.target;
    do {
      if (targetElement === ref.current) {
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);
    events.setModal({ name });
  };

  const handleSetModal = (name: string) => {
    events.setModal({ name });
  };

  return (
    <div className={s.root}>
      <CreateAtomic
        isOpen={createAtomic.isOpen}
        ref={atomRef}
        onClick={
          createAtomic
            ? (e) => handleCatchClickOutside(e, atomRef, 'createAtomic') as unknown as MouseEventHandler<HTMLDivElement>
            : undefined
        }
      />
      <CreateModule
        isOpen={createModule.isOpen}
        ref={moduleRef}
        onClick={
          createModule
            ? (e) =>
                handleCatchClickOutside(e, moduleRef, 'createModule') as unknown as MouseEventHandler<HTMLDivElement>
            : undefined
        }
      />
      <AddAtomItem
        isOpen={addAtomItem.isOpen}
        additionalData={addAtomItem.additionalData}
        ref={atomItemRef}
        onClick={
          addAtomItem
            ? (e) =>
                handleCatchClickOutside(e, atomItemRef, 'addAtomItem') as unknown as MouseEventHandler<HTMLDivElement>
            : undefined
        }
        atomMap={atomMap}
      />
      <LeftSidebar setModal={handleSetModal} />
      <RightSidebar atomMap={atomMap} moduleMap={moduleMap} canvasJSON={canvasJSON} json={json} />
      {children}
    </div>
  );
};

export default Layout;
