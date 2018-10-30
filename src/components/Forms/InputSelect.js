import React from 'react'

const InputSelect = ({
  name,
  valueArray,
  value,
  onChange,
  noSelectOption,
  className = '',
  titleField = 'title',
  valueField = 'value',
  ...props
}) => (
  <select
    name={name}
    className={`form-control ${className}`}
    value={value}
    onChange={onChange}
    {...props}>
    {noSelectOption && <option value="">Select</option>}
    {valueArray.map(item => (
      <option key={item[valueField]} value={item[valueField]}>
        {item[titleField]}
      </option>
    ))}
  </select>
)

export default InputSelect
