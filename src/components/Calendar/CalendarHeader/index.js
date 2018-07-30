import React from 'react'
import moment from 'moment'
import styles from './index.scss'
// import classnames from 'classnames'

const CalendarHeader = ({ calendar, handleCustomEvent }) => (
  <div className={styles.container}>
    <div className={styles.prev} onClick={() => handleCustomEvent('prev')}>
      <i class="fas fa-angle-left" />
    </div>
    <div className={styles.title}>
      <h1>
        {moment(new Date(calendar.year, calendar.month, 1)).format('MMMM YYYY')}
      </h1>
    </div>
    <div className={styles.next} onClick={() => handleCustomEvent('next')}>
      <i class="fas fa-angle-right" />
    </div>
  </div>
)

export default CalendarHeader
