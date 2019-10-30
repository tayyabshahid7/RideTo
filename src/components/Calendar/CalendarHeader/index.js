import React from 'react'
import moment from 'moment'
import styles from './index.scss'

const CalendarHeader = ({ calendar, handleCustomEvent }) => (
  <div className={styles.container}>
    <div className={styles.title}>
      {moment(new Date(calendar.year, calendar.month, 1)).format('MMMM YYYY')}
    </div>
  </div>
)

export default CalendarHeader
