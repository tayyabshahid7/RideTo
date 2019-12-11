import React from 'react'
import classnames from 'classnames'
import styles from './index.scss'

const CalendarWeekdays = ({ sideBarOpen }) => (
  <ul
    className={classnames(
      styles.calendarWeekdays,
      sideBarOpen && styles.calendarWeekdaysSideBarOpen
    )}>
    <li>Mo</li>
    <li>Tu</li>
    <li>We</li>
    <li>Th</li>
    <li>Fr</li>
    <li>Sa</li>
    <li>Su</li>
  </ul>
)

export default CalendarWeekdays
