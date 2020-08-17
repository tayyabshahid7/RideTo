import React from 'react'
import CalendarWeekCourse from '../CalendarWeekCourse'
import CalendarWeekStaff from '../CalendarWeekStaff'
import CalendarWeekEvent from '../CalendarWeekEvent'
import styles from './index.scss'

const CalendarDetailLine = ({ day, history, calendar, match, settings }) => {
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
              position={day.coursePositions[index]}
              barCount={day.barCount}
              history={history}
              calendar={calendar}
              key={index}
              match={match}
              settings={settings}
              showDetail={true}
            />
          )
        } else if (item.itemType === 'staff') {
          return (
            <CalendarWeekStaff
              staff={item}
              position={day.coursePositions[index]}
              barCount={day.barCount}
              history={history}
              calendar={calendar}
              key={index}
              match={match}
              settings={settings}
            />
          )
        } else if (item.itemType === 'event') {
          return (
            <CalendarWeekEvent
              event={item}
              position={day.coursePositions[index]}
              barCount={day.barCount}
              history={history}
              calendar={calendar}
              key={index}
              match={match}
              settings={settings}
            />
          )
        }
        return null
      })}
    </div>
  )
}

export default CalendarDetailLine
