import React, { useState } from 'react';
import cx from 'clsx';
import Arrow from '@assets/arrow.svg';
import { Controller, SetValueParams } from 'effector-react-form';
import s from './InputSelect.module.scss';
import Input from '../Input';

interface IInputSelect {
  options: string[];
  className: string;
  controller: Controller;
  setValue: (params: SetValueParams) => void;
}

const InputSelect: React.FC<IInputSelect> = ({ options, className, controller, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { input } = controller();

  const handleSetCurrent = (template: string, e) => {
    e.preventDefault();
    input.onChange(template);
  };

  return (
    <div className={cx(s.root, className)} onClick={() => setIsOpen(!isOpen)}>
      <Input controller={controller} disabled />
      <div className={cx(s.Trigger, { [s.isOpen]: isOpen })}>
        <Arrow />
      </div>
      <ul className={cx(s.OptionsList, { [s.isOpen]: isOpen })}>
        {options?.map((item) => (
          <li key={item}>
            <button onClick={(e) => handleSetCurrent(item, e)}>{item}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InputSelect;
