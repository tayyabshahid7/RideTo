import React from 'react'
import { Input } from 'reactstrap'

const InputTextGroup = ({
  name,
  value,
  onChange,
  label,
  inputClass = '',
  className = '',
  inputType = 'text',
  ...rest
}) => (
  <div className={className}>
    <label className="control-label">{label}</label>
    <Input
      type={inputType}
      name={name}
      className={`form-control ${inputClass}`}
      onChange={onChange}
      value={value}
      {...rest}
    />
  </div>
)

export default InputTextGroup
