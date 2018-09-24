import React from 'react'
import moment from 'moment'
import styles from './CalendarHeader.scss'
import { IconArrowRight, IconArrowLeft } from 'assets/icons'
// import classnames from 'classnames'

const CalendarHeader = ({ calendar, handlePrevMonth, handleNextMonth }) => (
  <div className={styles.container}>
    <div className={styles.title}>
      {moment(new Date(calendar.year, calendar.month, 1)).format('MMMM YYYY')}
    </div>
    <div className={styles.prev} onClick={handlePrevMonth}>
      <IconArrowLeft className={styles.icon} />
    </div>
    <div className={styles.next} onClick={handleNextMonth}>
      <IconArrowRight className={styles.icon} />
    </div>
  </div>
)

export default CalendarHeader
