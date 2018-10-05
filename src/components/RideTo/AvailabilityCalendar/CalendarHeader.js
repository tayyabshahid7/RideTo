import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './CalendarHeader.scss'
import { IconArrowSlideLeft, IconArrowSlideRight } from 'assets/icons'
// import classnames from 'classnames'

const CalendarHeader = ({
  calendar,
  handlePrevMonth,
  handleNextMonth,
  disablePreviousDates
}) => {
  let todate = new Date()
  let currentMonth = todate.getMonth()
  let currentYear = todate.getFullYear()
  let prevDisabled =
    disablePreviousDates &&
    calendar.year === currentYear &&
    calendar.month === currentMonth
  return (
    <div className={styles.container}>
      <div className={styles.title}>Choose a date</div>
      <div
        className={classnames(styles.prev, prevDisabled && styles.disabled)}
        onClick={() => !prevDisabled && handlePrevMonth()}>
        <IconArrowSlideLeft
          className={classnames(
            styles.icon,
            prevDisabled && styles.disabledIcon
          )}
        />
      </div>
      {moment(new Date(calendar.year, calendar.month, 1)).format('MMMM YYYY')}
      <div className={styles.next} onClick={handleNextMonth}>
        <IconArrowSlideRight className={styles.icon} />
      </div>
    </div>
  )
}

export default CalendarHeader
