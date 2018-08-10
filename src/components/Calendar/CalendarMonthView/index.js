import React from 'react'
// import classnames from 'classnames'
import CalendarWeekdays from '../CalendarWeekdays'
import CalendarDays from '../CalendarDays'
import styles from './index.scss'

const CalendarMonthView = ({ ...props }) => (
  <div className={styles.container}>
    <CalendarWeekdays />
    <div className={styles.daysContainer}>
      <CalendarDays {...props} />
    </div>
  </div>
)

export default CalendarMonthView
