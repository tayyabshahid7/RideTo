import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import styles from './index.scss'
import CalendarWeekCourse from '../CalendarWeekCourse'
import { WORK_HOURS, WEEK_VIEW_START_TIME } from '../../../common/constants'

class CalendarWeekView extends Component {
  renderTimeline() {
    return (
      <div className={styles.timeline}>
        <ul>
          {Array.apply(null, { length: WORK_HOURS * 2 }).map((val, index) => (
            <li key={index}>
              <span>
                {moment(
                  new Date(
                    new Date('2000-01-01 00:00:00') -
                      (WEEK_VIEW_START_TIME + index * 30 * 60) * -1000
                  )
                ).format('HH:mm')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  showMonth(day) {
    if (day.date.getDate() === 1) {
      return `${moment(day.date).format('MMM')} - `
    }
    return ''
  }

  evaluateData(days) {
    let date = '2000-01-01'
    let baseDate = new Date('2000-01-01 00:00:00')
    let results = days.map(day => {
      let dayObj = { ...day }
      dayObj.courses = dayObj.courses.map(course => {
        return {
          ...course,
          secondsForDay: parseInt(
            new Date(`${date} ${course.time}`) / 1000 - baseDate / 1000,
            10
          ),
          duration: 2 * 60 * 60
        } // Right now make duraton 1 hour
      })
      dayObj.courses = dayObj.courses.sort((a, b) => {
        return a.secondsForDay - b.secondsForDay
      })

      let barMap = []
      let coursePositions = []
      for (let i = 0; i < dayObj.courses.length; i++) {
        let course = dayObj.courses[i]
        if (barMap.length === 0) {
          barMap.push(course)
          coursePositions.push(0)
        } else {
          let j
          for (j = 0; j < barMap.length; j++) {
            if (
              barMap[j].secondsForDay + barMap[j].duration <
              course.secondsForDay
            ) {
              barMap.splice(j, 1, course)
              coursePositions.push(j)
              break
            }
          }
          if (j === barMap.length) {
            barMap.push(course)
            coursePositions.push(j)
          }
        }
      }
      dayObj.barCount = barMap.length
      dayObj.coursePositions = coursePositions
      return dayObj
    })
    return results
  }

  renderDays() {
    const { days, history } = this.props
    let daysInfo = this.evaluateData(days)
    return (
      <div className={styles.events}>
        <ul>
          {daysInfo.map((day, index) => (
            <li className={styles.eventsGroup} key={index}>
              <div className={styles.topInfo}>
                <Link to={`/calendar/${moment(day.date).format('YYYY-MM-DD')}`}>
                  <span>
                    {this.showMonth(day)}
                    {moment(day.date).format('ddd D')}
                  </span>
                </Link>
              </div>
              <ul>
                {day.courses &&
                  day.courses.length > 0 &&
                  day.courses.map((course, index) => (
                    <CalendarWeekCourse
                      course={course}
                      position={day.coursePositions[index]}
                      barCount={day.barCount}
                      history={history}
                    />
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderTimeline()}
        {this.renderDays()}
      </div>
    )
  }
}

export default CalendarWeekView
