import React from 'react'
import CalendarShiftDayCell from '../CalendarShiftDayCell'
import UserInitial from '../UserInitial'
import styles from './index.scss'
import classnames from 'classnames'
import moment from 'moment'

const CalendarShiftDays = ({ days, calendar, history, activeUsers }) => {
  const daysByWeek = []
  for (let i = 0; i < days.length / 7; i++) {
    daysByWeek.push(days.slice(i * 7, (i + 1) * 7))
  }

  const getDayText = day => {
    return moment(day.date).format('ddd DD')
  }

  const isOtherMonth = day => {
    return day.date.getMonth() !== calendar.month
  }

  const isToday = day => {
    const now = new Date()

    return (
      now.getFullYear() === day.date.getFullYear() &&
      now.getMonth() === day.date.getMonth() &&
      now.getDate() === day.date.getDate()
    )
  }

  return (
    <div className={classnames(styles.calendarDays)}>
      {daysByWeek.map((weekDays, wIndex) => (
        <React.Fragment>
          <div key={`empty-${wIndex}`}></div>
          {weekDays.map((day, dIndex) => (
            <div key={wIndex * 7 + dIndex} className={styles.cellHeader}>
              <div
                className={classnames(
                  isOtherMonth(day) && styles.otherMonthDate,
                  styles.date,
                  isToday(day) && styles.highlight
                )}>
                {getDayText(day)}
              </div>
            </div>
          ))}
          {activeUsers.map((user, uIndex) => (
            <React.Fragment>
              <div className={styles.userCell}>
                <UserInitial user={user} short />
              </div>
              {weekDays.map((day, dIndex) => (
                <CalendarShiftDayCell
                  key={`${wIndex * 7 + dIndex}-${uIndex}`}
                  day={day}
                  user={user}
                  calendar={calendar}
                  history={history}
                />
              ))}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CalendarShiftDays
