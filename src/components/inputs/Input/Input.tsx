import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Controller } from 'effector-react-form';
import cx from 'clsx';
import s from './Input.module.scss';

interface IInput {
  controller: Controller;
  className?: string;
  placeholder?: string;
  startLine?: string;
  disabled?: boolean;
}

const Input: React.FC<IInput> = ({ controller, className, placeholder = '', startLine, disabled = false }) => {
  const { input, isShowError, error } = controller();
  const startLineRef = useRef(null);
  const [paddingLeft, setPaddingLeft] = useState('10px');

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      input.onChange(e);
    }
  };

  useEffect(() => {
    if (startLine) {
      const newPaddingLeft = window.getComputedStyle(startLineRef.current).width.replace('px', '');
      setPaddingLeft(`${+newPaddingLeft + 10}px`);
    }
  }, [startLine]);

  return (
    <div className={cx(s.root, className)}>
      {startLine && (
        <span ref={startLineRef} className={s.Startline}>
          {startLine}
        </span>
      )}
      <input
        {...input}
        value={input.value || ''}
        onChange={handleOnChange}
        placeholder={placeholder}
        style={{ paddingLeft }}
        autoComplete="off"
      />
      {isShowError && <span className="error">{error}</span>}
    </div>
  );
};

export default Input;
