import React from 'react'
// import classnames from 'classnames'
import CalendarDayCell from '../CalendarDayCell'
import styles from './index.scss'

const CalendarDays = ({ days, calendar, history, handleMobileCellClick }) => (
  <ul className={styles.calendarDays}>
    {days.map((day, index) => (
      <CalendarDayCell
        day={day}
        calendar={calendar}
        key={index}
        history={history}
        handleMobileCellClick={handleMobileCellClick}
      />
    ))}
  </ul>
)

export default CalendarDays
