import React, { Component } from 'react'
import CalendarWeekCourse from '../CalendarWeekCourse'
import CalendarWeekStaff from '../CalendarWeekStaff'
import CalendarWeekEvent from '../CalendarWeekEvent'
import styles from './index.scss'
import { calculatePosition } from '../../../utils/helper'

class CalendarUserLine extends Component {
  render() {
    const { day, history, calendar, match, user } = this.props

    if (!day.courses) {
      return null
    }

    const courses = day.courses.filter(x => {
      if (user.id === -1) {
        return !x.instructor
      } else {
        return x.instructor && x.instructor.id === user.id
      }
    })

    let dayObj = {
      courses
    }

    dayObj = calculatePosition(dayObj)
    const { barCount } = dayObj

    return (
      <div className={styles.container}>
        {dayObj.courses.map((item, index) => {
          if (!item.itemType) {
            return (
              <CalendarWeekCourse
                course={item}
                barCount={barCount}
                history={history}
                calendar={calendar}
                key={index}
                match={match}
              />
            )
          } else if (item.itemType === 'staff') {
            return (
              <CalendarWeekStaff
                staff={item}
                barCount={barCount}
                calendar={calendar}
                key={index}
                match={match}
              />
            )
          } else if (item.itemType === 'event') {
            return (
              <CalendarWeekEvent
                event={item}
                barCount={barCount}
                calendar={calendar}
                key={index}
                match={match}
              />
            )
          }
          return null
        })}
      </div>
    )
  }
}

export default CalendarUserLine
