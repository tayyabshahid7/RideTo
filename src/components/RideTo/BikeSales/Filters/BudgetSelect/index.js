import React from 'react'
import rangeInclusive from 'range-inclusive'
import styles from './styles.scss'

const VALUES = rangeInclusive(1000, 20000, 1000)

function BudgetSelect({ value, onChange, placeholder }) {
  return (
    <select className={styles.select} value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {VALUES.map(value => (
        <option value={value} key={value}>
          {value.toLocaleString()}
        </option>
      ))}
    </select>
  )
}

export default BudgetSelect
