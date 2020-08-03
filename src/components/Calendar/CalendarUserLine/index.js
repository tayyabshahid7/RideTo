import React, { Component } from 'react'
import _ from 'lodash'
import CalendarWeekCourse from '../CalendarWeekCourse'
import CalendarWeekStaff from '../CalendarWeekStaff'
import CalendarWeekEvent from '../CalendarWeekEvent'
import styles from './index.scss'
import { secondsForDayAndDurationForEvent } from 'utils/helper'

class CalendarUserLine extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    const {
      day,
      history,
      calendar,
      match,
      settings,
      user,
      inactiveCourses
    } = this.props

    if (!day.courses) {
      return null
    }

    const courses = day.courses
      .filter(x => {
        if (user.id === -1) {
          return !x.instructor
        } else {
          return x.instructor && x.instructor.id === user.id
        }
      })
      .filter(x => x.course_type && !inactiveCourses.includes(x.course_type.id))

    const staffs = day.staff
      .filter(x => x.instructor === user.id)
      .map(x => {
        return {
          ...x,
          itemType: 'staff',
          ...secondsForDayAndDurationForEvent(x, day.date)
        }
      })
    let events = user.id === -1 ? day.events : []
    events = events.map(x => {
      return {
        ...x,
        itemType: 'event',
        ...secondsForDayAndDurationForEvent(x, day.date)
      }
    })

    const allItems = _.orderBy(
      [...courses, ...staffs, ...events],
      'secondsForDay'
    )
    const barMap = []
    const coursePositions = []
    for (let i = 0; i < allItems.length; i++) {
      const course = allItems[i]
      if (barMap.length === 0) {
        barMap.push(course)
        coursePositions.push(0)
      } else {
        let j
        for (j = barMap.length - 1; j >= 0; j--) {
          if (
            course.secondsForDay > barMap[j].secondsForDay &&
            course.secondsForDay <
              barMap[j].secondsForDay + barMap[j].duration * 60
          ) {
            barMap.push(course)
            coursePositions.push(j + 1)
            break
          }
        }
        if (j === -1) {
          barMap.push(course)
          coursePositions.push(0)
        }
      }
    }

    const barCount = Math.max(...coursePositions) + 1

    if (allItems.length) {
      console.log(
        'list',
        allItems.map(x => ({
          seconds: x.secondsForDay,
          duration: x.duration
        }))
      )
      console.log(barMap, coursePositions)
    }

    return (
      <div className={styles.container}>
        {allItems.map((item, index) => {
          if (!item.itemType) {
            return (
              <CalendarWeekCourse
                course={item}
                position={coursePositions[index]}
                barCount={barCount}
                history={history}
                calendar={calendar}
                key={index}
                match={match}
                settings={settings}
              />
            )
          } else if (item.itemType === 'staff') {
            return (
              <CalendarWeekStaff
                staff={item}
                position={coursePositions[index]}
                barCount={barCount}
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
                position={coursePositions[index]}
                barCount={barCount}
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
}

export default CalendarUserLine
