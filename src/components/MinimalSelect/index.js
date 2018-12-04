import React from 'react'
import styles from './MinimalSelect.scss'

const MinimalSelect = ({
  selected,
  options,
  onChange,
  disabled = false,
  className = ``,
  labelField = 'name',
  valueField = 'id'
}) => {
  const overrideClass = `${styles.minimal} ${className}`

  return (
    <select
      className={overrideClass}
      disabled={disabled}
      value={selected}
      onChange={e =>
        onChange(
          e.target.value,
          e.target.options[e.target.selectedIndex].innerText
        )
      }>
      {options.map(opt => (
        <option
          key={opt[valueField]}
          disabled={!opt[valueField]}
          value={opt[valueField]}
          name={opt[labelField]}>
          {opt[labelField]}
        </option>
      ))}
    </select>
  )
}

export default MinimalSelect
