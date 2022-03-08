import React, { MouseEventHandler, Ref } from 'react';
import cx from 'clsx';
import { useForm } from 'effector-react-form';
import RadioInput from '@components/inputs/RadioInput';
import Input from '@components/inputs/Input';
import InputSelect from '@components/inputs/InputSelect';
import { useEvent, useStore } from 'effector-react';
import { $addAtomState, nextStep, optionsForm, prevStep, valuesForm } from '@store/forms/addAtomItem';
import { $templates } from '@store/fabric/templates';
import { validateRequired } from '../../../utils/validation';
import s from './AddAtomItem.module.scss';

interface IAddAtomItem {
  isOpen: boolean;
  ref: Ref<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  additionalData: any;
  atomMap: any;
}

const AddAtomItem: React.FC<IAddAtomItem> = React.forwardRef(({ isOpen, onClick, atomMap, additionalData }, ref) => {
  const { options, step } = useStore($addAtomState);
  const { path } = options;

  const templates = useStore($templates);

  const events = useEvent({ prevStep, nextStep });

  const {
    controller: optionsController,
    setValue: setOptionsValue,
    submit: submitOptions,
    handleSubmit: handleSubmitOptions,
  } = useForm({ form: optionsForm });
  const {
    controller: valuesController,
    handleSubmit: handleValuesSubmit,
    submit: submitValues,
  } = useForm({ form: valuesForm, meta: { elementName: additionalData?.elementName, group: additionalData?.group } });

  return (
    <div className={cx(s.root, { [s.isOpen]: isOpen })} onClick={onClick}>
      <div className={s.Wrapper} ref={ref}>
        <h2>Add atom item</h2>
        {step === 0 && (
          <form onSubmit={handleSubmitOptions}>
            <InputSelect
              className={s.Input}
              options={templates}
              controller={optionsController({ name: 'template', validate: validateRequired })}
              setValue={setOptionsValue}
            />
            <div className={s.RadioGroup}>
              <span>Path: </span>
              <RadioInput id="default" controller={optionsController({ name: 'path' })} label="default" />
              <RadioInput id="absolute" controller={optionsController({ name: 'path' })} label="absolute path" />
              <RadioInput id="relative" controller={optionsController({ name: 'path' })} label="relative path" />
            </div>
            <button onClick={submitOptions} type="submit" className={s.FormButton}>
              Next step
            </button>
          </form>
        )}
        {step === 1 && (
          <form onSubmit={handleValuesSubmit}>
            <Input controller={valuesController({ name: 'name' })} className={s.Input} placeholder="Component name" />
            {path === 'absolute' && (
              <Input
                controller={valuesController({ name: 'absolute_path', validate: validateRequired })}
                className={s.Input}
                placeholder="Absolute path"
              />
            )}
            {path === 'relative' && (
              <Input
                controller={valuesController({ name: 'relative_path', validate: validateRequired })}
                className={cx(s.Input, s.RelativeInput)}
                placeholder="Relative path"
                startLine={`${atomMap?.defaultParams?.[options.template]?.path}/`}
              />
            )}
            <div className={s.StepsWrapper}>
              <button onClick={() => events.prevStep()} className={s.FormButton}>
                Prev step
              </button>
              <button type="submit" className={s.FormButton}>
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

export default AddAtomItem;
