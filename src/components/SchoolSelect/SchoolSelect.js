import React from 'react'
import styles from './styles.scss'

const SchoolSelect = ({ selected, schools, onChange, valueField = 'id' }) => {
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
      {schools.map(school => (
        <option
          key={school[valueField]}
          value={school[valueField]}
          name={school.name}>
          {school.name}
        </option>
      ))}
    </select>
  )
}

export default SchoolSelect
