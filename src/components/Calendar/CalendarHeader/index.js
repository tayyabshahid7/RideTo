import React from 'react'
import moment from 'moment'
import styles from './index.scss'
// import classnames from 'classnames'

const CalendarHeader = ({ calendar, handleCustomEvent }) => (
  <div className={styles.container}>
    <div className={styles.prev} onClick={() => handleCustomEvent('prev')}>
      <i className="fa fa-angle-left" />
    </div>
    <div className={styles.title}>
      {moment(new Date(calendar.year, calendar.month, 1)).format('MMMM YYYY')}
    </div>
    <div className={styles.next} onClick={() => handleCustomEvent('next')}>
      <i className="fa fa-angle-right" />
    </div>
  </div>
)

export default CalendarHeader
