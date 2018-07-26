import React from 'react'
// import classnames from 'classnames'
import CalendarDayCell from '../CalendarDayCell'
import styles from './index.scss'

const CalendarDays = ({ days, info }) => (
  <ul className={styles.container}>
    {days.map((day, index) => (
      <CalendarDayCell day={day} info={info} key={index} />
    ))}
  </ul>
)

export default CalendarDays
