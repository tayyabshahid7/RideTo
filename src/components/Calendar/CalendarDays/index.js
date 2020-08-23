import React from 'react'
import CalendarDayCell from '../CalendarDayCell'
import styles from './index.scss'
import classnames from 'classnames'

const CalendarDays = ({
  days,
  calendar,
  users,
  history,
  handleMobileCellClick
}) => {
  const rowsCount = Math.ceil(days.length / 7)

  return (
    <div
      className={classnames(
        styles.calendarDays,
        rowsCount === 5 && styles.calendarDaysFiveRows,
        rowsCount === 6 && styles.calendarDaysSixRows
      )}>
      {days.map((day, index) => (
        <CalendarDayCell
          day={day}
          calendar={calendar}
          key={index}
          history={history}
          handleMobileCellClick={handleMobileCellClick}
          rowsCount={rowsCount}
          lastRow={Math.floor(index / 7) === rowsCount - 1}
          users={users}
        />
      ))}
    </div>
  )
}

export default CalendarDays
