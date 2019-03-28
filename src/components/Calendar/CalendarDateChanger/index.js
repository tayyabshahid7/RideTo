import React from 'react'
import styles from './styles.scss'

function CalendarDateChanger({ calendar, handleChangeDate }) {
  const date = new Date()
  const year = date.getFullYear()
  const yearsBefore = [4, 3, 2, 1].map(diff => year - diff)
  const yearsAfter = [1, 2, 3, 4].map(diff => year + diff)
  const years = [...yearsBefore, year, ...yearsAfter]

  return (
    <div className={styles.container}>
      <select
        value={calendar.month}
        className={styles.select}
        onChange={({ target: { value } }) => {
          handleChangeDate({ month: value })
        }}>
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
        <option value="5">June</option>
        <option value="6">July</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>
      </select>
      <select
        value={calendar.year}
        className={styles.select}
        onChange={({ target: { value } }) => {
          handleChangeDate({ year: value })
        }}>
        {years.map(year => (
          <option key={year}>{year}</option>
        ))}
      </select>
    </div>
  )
}

export default CalendarDateChanger
