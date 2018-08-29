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
  children = null,
  ...rest
}) => (
  <div className={className}>
    <label className="control-label">{label}</label>
    {children ? (
      children
    ) : (
      <Input
        type={inputType}
        name={name}
        className={`form-control ${inputClass}`}
        onChange={onChange}
        value={value}
        {...rest}
      />
    )}
  </div>
)

export default InputTextGroup
