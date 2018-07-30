import React from 'react'
import styles from './styles.scss'

const SchoolSelect = ({ selected, schools, onChange }) => {
  return (
    <select
      className={styles.schoolSelect}
      value={selected}
      onChange={e =>
        onChange(
          e.target.value,
          e.target.options[e.target.selectedIndex].innerText
        )
      }>
      {schools.map(school => (
        <option key={school.id} value={school.id} name={school.name}>
          {school.name}
        </option>
      ))}
    </select>
  )
}

export default SchoolSelect
