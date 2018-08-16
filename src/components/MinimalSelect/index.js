import React from 'react'
import styles from './MinimalSelect.scss'

const MinimalSelect = ({
  selected,
  options,
  onChange,
  labelField = 'name',
  valueField = 'id'
}) => {
  return (
    <select
      className={styles.minimal}
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
          value={opt[valueField]}
          name={opt[labelField]}>
          {opt[labelField]}
        </option>
      ))}
    </select>
  )
}

export default MinimalSelect
