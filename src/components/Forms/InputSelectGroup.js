import React from 'react'

const InputSelectGroup = ({
  name,
  valueArray,
  value,
  onChange,
  label,
  noSelectOption,
  selectClass = '',
  className = '',
  titleField = 'title',
  valueField = 'value',
  ...props
}) => (
  <div className={className}>
    <label className="control-label">{label}</label>
    <select
      name={name}
      className={`form-control ${selectClass}`}
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
  </div>
)

export default InputSelectGroup
