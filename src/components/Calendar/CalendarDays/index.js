import React from 'react'
// import classnames from 'classnames'
import CalendarDayCell from '../CalendarDayCell'
import styles from './index.scss'

const CalendarDays = ({ days, calendar, history }) => (
  <ul className={styles.container}>
    {days.map((day, index) => (
      <CalendarDayCell
        day={day}
        calendar={calendar}
        key={index}
        history={history}
      />
    ))}
  </ul>
)

export default CalendarDays
