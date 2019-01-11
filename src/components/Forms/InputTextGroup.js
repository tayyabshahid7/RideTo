import React from 'react'
import Input from 'components/Forms/Input'

import styles from './InputTextGroup.scss'

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
    {label && <label className="control-label">{label}</label>}
    {children ? (
      children
    ) : (
      <Input
        type={inputType}
        name={name}
        className={`${styles.input} ${inputClass}`}
        onChange={onChange}
        value={value}
        {...rest}
      />
    )}
  </div>
)

export default InputTextGroup
