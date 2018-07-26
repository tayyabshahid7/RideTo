import React from 'react'
// import classnames from 'classnames'
import CalendarWeekdays from '../CalendarWeekdays'
import CalendarDays from '../CalendarDays'
import styles from './index.scss'

const CalendarMonthView = ({ ...props }) => (
  <div className={styles.container}>
    <CalendarWeekdays />
    <CalendarDays {...props} />
  </div>
)

export default CalendarMonthView
