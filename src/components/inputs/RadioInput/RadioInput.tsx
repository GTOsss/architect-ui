import { Controller } from 'effector-react-form';
import React from 'react'

interface IRadioInput {
  controller: Controller;
  id: string;
  label: string;
}

const RadioInput: React.FC<IRadioInput> = ({ controller, id, label }) => {
  const { input } = controller();
  const onChange = () => {
    input.onChange(id)
  }
  return (
    <div>
      <input type="radio" {...input} id={id} onChange={onChange} checked={input.value === id} />
      <label htmlFor="relative">{label}</label>
    </div>
  )
}

export default RadioInput;