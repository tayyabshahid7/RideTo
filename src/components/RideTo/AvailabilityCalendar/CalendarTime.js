import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './CalendarTime.scss'

const CalendarTime = ({ calendar, times, handleTimeSelect }) => {
  return (
    <div className={styles.container}>
      {times.map((tm, index) => (
        <button
          kye={index}
          className={classnames(
            styles.btn,
            calendar.selectedTime === tm && styles.activeBtn
          )}
          onClick={() => handleTimeSelect(tm)}>
          {moment(`2000-01-01 ${tm}`).format('Ha')}
        </button>
      ))}
    </div>
  )
}

export default CalendarTime
