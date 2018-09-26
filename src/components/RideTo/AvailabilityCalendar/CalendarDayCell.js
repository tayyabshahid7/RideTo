import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './CalendarDayCell.scss'

const CalendarDayCell = ({ day, calendar, handleDateSelect }) => {
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const selectedDay = calendar.selectedDate === dateStr
  return (
    <li
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDate,
        day.disabled && styles.disabledDate,
        day.invisible && styles.invisibleDate
      )}
      onClick={() => {
        if (!day.disabled && !day.invisible) {
          handleDateSelect(dateStr)
        }
      }}>
      {day.date.getDate()}
    </li>
  )
}

export default CalendarDayCell
