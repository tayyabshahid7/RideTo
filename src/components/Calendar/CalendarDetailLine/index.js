import React from 'react'
import CalendarWeekCourse from '../CalendarWeekCourse'
import CalendarWeekStaff from '../CalendarWeekStaff'
import CalendarWeekEvent from '../CalendarWeekEvent'
import styles from './index.scss'

const CalendarDetailLine = ({ day, calendar, match }) => {
  if (!day.courses) {
    return null
  }

  return (
    <div className={styles.container}>
      {day.courses.map((item, index) => {
        if (!item.itemType) {
          return (
            <CalendarWeekCourse
              course={item}
              barCount={day.barCount}
              calendar={calendar}
              key={index}
              match={match}
              showDetail={true}
            />
          )
        } else if (item.itemType === 'staff') {
          return (
            <CalendarWeekStaff
              staff={item}
              barCount={day.barCount}
              calendar={calendar}
              key={index}
              match={match}
              showDetail={true}
            />
          )
        } else if (item.itemType === 'event') {
          return (
            <CalendarWeekEvent
              event={item}
              barCount={day.barCount}
              calendar={calendar}
              key={index}
              match={match}
              showDetail={true}
            />
          )
        }
        return null
      })}
    </div>
  )
}

export default CalendarDetailLine
