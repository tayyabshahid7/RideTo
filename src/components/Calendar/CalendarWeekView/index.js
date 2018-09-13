import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './index.scss'
import CalendarWeekCourse from '../CalendarWeekCourse'
import { WORK_HOURS, WEEK_VIEW_START_TIME } from 'common/constants'
import { secondsForDayAndDurationForEvent } from 'utils/helper'

class CalendarWeekView extends Component {
  listenScrollEvent(event) {
    if (this.refs.timelineDiv) {
      this.refs.timelineDiv.style.top = `-${event.target.scrollTop}px`
    }
  }

  renderTimeline() {
    return (
      <div className={styles.timeline} ref="timelineDiv">
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

  renderWeekdays() {
    const { days, calendar } = this.props
    let daysInfo = this.evaluateData(days)
    return (
      <div className={styles.weekDays}>
        <ul className={styles.daysContainer}>
          {daysInfo.map((day, index) => (
            <li
              className={classnames(
                styles.weekDaysHeader,
                calendar.selectedDate ===
                  moment(day.date).format('YYYY-MM-DD') && 'bg-highlight'
              )}
              key={index}>
              <div className={styles.topInfo}>
                <Link to={`/calendar/${moment(day.date).format('YYYY-MM-DD')}`}>
                  <span className={styles.mobileVisible}>
                    {moment(day.date).format('D')}
                    <br />
                    {moment(day.date).format('ddd')}
                  </span>
                  <span className={styles.desktopVisible}>
                    {moment(day.date).format('ddd D')}
                  </span>
                </Link>
              </div>
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
      dayObj.courses = [
        ...dayObj.courses.map(course => {
          return {
            ...course,
            secondsForDay: parseInt(
              new Date(`${date} ${course.time}`) / 1000 - baseDate / 1000,
              10
            )
          }
        }),
        ...dayObj.events.map(event => {
          return {
            ...event,
            ...secondsForDayAndDurationForEvent(event, dayObj.date)
          }
        })
      ]

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
              barMap[j].secondsForDay + barMap[j].duration * 60 <
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
    const { days, history, calendar } = this.props
    let daysInfo = this.evaluateData(days)
    return (
      <div className={styles.events}>
        <ul className={styles.eventsContainer}>
          {daysInfo.map((day, index) => (
            <li
              className={classnames(
                styles.eventsGroup,
                calendar.selectedDate ===
                  moment(day.date).format('YYYY-MM-DD') && 'bg-highlight'
              )}
              key={index}>
              {/* <div className={styles.topInfo}>
                <Link to={`/calendar/${moment(day.date).format('YYYY-MM-DD')}`}>
                  <span>
                    {this.showMonth(day)}
                    {moment(day.date).format('ddd D')}
                  </span>
                </Link>
              </div> */}
              <ul>
                {day.courses &&
                  day.courses.length > 0 &&
                  day.courses.map((course, index) => (
                    <CalendarWeekCourse
                      course={course}
                      position={day.coursePositions[index]}
                      barCount={day.barCount}
                      history={history}
                      calendar={calendar}
                      key={index}
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
        <div className={styles.timelineWrapper}>{this.renderTimeline()}</div>
        <div className={styles.mainContent}>
          {this.renderWeekdays()}
          <div
            className={styles.weekviewContent}
            onScroll={this.listenScrollEvent.bind(this)}>
            {this.renderDays()}
          </div>
        </div>
      </div>
    )
  }
}

export default CalendarWeekView
