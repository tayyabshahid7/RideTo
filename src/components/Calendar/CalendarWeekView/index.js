import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './index.scss'
import CalendarWeekCourse from '../CalendarWeekCourse'
import {
  WORK_HOURS,
  WEEK_VIEW_START_TIME,
  WEEK_VIEW_WORKING_DAY_TIME_STRING
} from 'common/constants'
import { secondsForDayAndDurationForEvent } from 'utils/helper'
import MediaQuery from 'react-responsive'
import isEqual from 'lodash/isEqual'
import { mapLabelColoursWithContant } from 'services/settings'
import personIcon from 'assets/images/person.png'

function getDayOfWeek({ day, month, year }) {
  const momentDate = moment(`${year}-${month + 1}-${day}`, 'YYYY-M-D')
  const dayOfWeek = momentDate.day() - 1

  if (dayOfWeek === -1) {
    return 6
  }

  return dayOfWeek
}

class CalendarWeekView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mobileDayOfWeek: getDayOfWeek(this.props.calendar),
      scrolled: false
    }

    this.startTime = React.createRef()
    this.firstCourse = null
  }

  componentDidMount() {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const { scrolled } = this.state

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (!isDesktop && !scrolled) {
      window.scrollTo(0, 600)
      this.setState({ scrolled: true })
    }

    if (isDesktop && !scrolled) {
      window.scrollTo(0, 385)
      this.setState({ scrolled: true })
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.calendar, prevProps.calendar)) {
      this.setState({
        mobileDayOfWeek: getDayOfWeek(this.props.calendar)
      })
    }

    if (!isEqual(this.props.days, prevProps.days)) {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches

      const { mobileDayOfWeek } = this.state
      const hasCourses = this.props.days[mobileDayOfWeek].courses.length

      if (!hasCourses && !isDesktop) {
        const { scrolled } = this.state

        if (!scrolled) {
          window.scrollTo(0, 600)
          this.setState({ scrolled: true })
        }
      }
    }
  }

  setFirstCourseRef = element => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const { scrolled } = this.state
    this.firstCourse = element

    if (element && !scrolled && !isDesktop) {
      const top = parseInt(element.style.top.replace('px', ''), 10) + 205

      window.scrollTo(0, top)
      this.setState({ scrolled: true })
    }
  }

  listenScrollEvent(event) {
    if (this.refs.timelineDiv) {
      this.refs.timelineDiv.style.top = `-${event.target.scrollTop}px`
    }
  }

  renderTimeline() {
    return (
      <div className={styles.timeline} ref="timelineDiv">
        <ul>
          <li className={styles.allDayTimelineItem}>
            <span>All day</span>
          </li>
          {Array.apply(null, { length: WORK_HOURS }).map((val, index) => {
            const time = moment(
              new Date(
                new Date('2000-01-01T00:00:00Z') -
                  (WEEK_VIEW_START_TIME + index * 60 * 60) * -1000
              )
            ).format('HH:mm')
            const isStartTime = time === WEEK_VIEW_WORKING_DAY_TIME_STRING

            return (
              <li key={index} ref={isStartTime ? this.startTime : undefined}>
                {index > 0 && <span>{time}</span>}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderWeekdays() {
    const { days, calendar, handleMobileCellClick, sideBarOpen } = this.props
    let daysInfo = this.evaluateData(days)
    return (
      <div
        className={classnames(
          styles.weekDays,
          sideBarOpen && styles.sideBarOpen
        )}>
        <ul className={styles.daysContainer}>
          {daysInfo.map((day, index) => (
            <li
              className={classnames(
                styles.weekDaysHeader,
                calendar.selectedDate ===
                  moment(day.date).format('YYYY-MM-DD') && styles.bgHighlight,
                moment(day.date).isSame(moment(), 'day') && styles.todayDate,
                moment(day.date).isSame(
                  moment(
                    `${calendar.year}-${calendar.month + 1}-${calendar.day}`,
                    'YYYY-M-D'
                  ),
                  'day'
                ) && styles.mobileSameDate
              )}
              key={index}>
              <div className={styles.topInfo}>
                <MediaQuery maxWidth={767}>
                  {matches => {
                    if (matches) {
                      return (
                        <button
                          onClick={() => {
                            handleMobileCellClick(day.date)
                          }}>
                          <span className={styles.mobileVisible}>
                            {moment(day.date).format('dd')[0]}
                            <br />
                            {moment(day.date).format('D')}
                          </span>
                        </button>
                      )
                    }

                    return (
                      <Link
                        to={`/calendar/${moment(day.date).format(
                          'YYYY-MM-DD'
                        )}`}>
                        <span className={styles.desktopVisible}>
                          {moment(day.date).format('dddd')}
                          <br />
                          {moment(day.date).format('Do')}
                        </span>
                      </Link>
                    )
                  }}
                </MediaQuery>
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
    let results = days.map(day => {
      let dayObj = { ...day }
      dayObj.courses = [
        ...dayObj.courses.map(course => {
          const time = moment(`${date} ${course.time}`)
          const startOfDay = moment(time).startOf('day')
          const secondsForDay = time.diff(startOfDay, 'seconds')

          return {
            ...course,
            secondsForDay
          }
        }),
        ...dayObj.events
          .filter(({ all_day }) => !all_day)
          .map(event => {
            return {
              ...event,
              ...secondsForDayAndDurationForEvent(event, dayObj.date)
            }
          }),
        ...dayObj.staff
          .filter(({ all_day }) => !all_day)
          .map(s => {
            return {
              ...s,
              ...secondsForDayAndDurationForEvent(s, dayObj.date)
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
    const { days, history, calendar, match, settings } = this.props
    const { mobileDayOfWeek } = this.state
    let daysInfo = this.evaluateData(days)

    return (
      <div className={styles.events}>
        <ul className={styles.eventsContainer}>
          <MediaQuery maxWidth={767}>
            {matches =>
              daysInfo.map((day, index) => {
                if (!matches || index === mobileDayOfWeek) {
                  return (
                    <li
                      onClick={event => {
                        const { target } = event

                        if (
                          target.classList.contains('day-li') ||
                          target.classList.contains('day-ul')
                        ) {
                          history.push(
                            `/calendar/${moment(day.date).format('YYYY-MM-DD')}`
                          )
                        }
                      }}
                      className={classnames(
                        'day-li',
                        styles.eventsGroup,
                        calendar.selectedDate ===
                          moment(day.date).format('YYYY-MM-DD') &&
                          styles.bgHighlight
                      )}
                      key={index}>
                      <ul className="day-ul">
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
                              match={match}
                              settings={settings}
                              ref={
                                matches && index === 0
                                  ? this.setFirstCourseRef
                                  : undefined
                              }
                            />
                          ))}
                      </ul>
                    </li>
                  )
                }

                return null
              })
            }
          </MediaQuery>
        </ul>
      </div>
    )
  }

  renderAllDay() {
    const { days, calendar, history, sideBarOpen } = this.props
    const { mobileDayOfWeek } = this.state
    let daysInfo = this.evaluateData(days)

    return (
      <div
        className={classnames(
          styles.events,
          styles.allDayEvents,
          sideBarOpen && styles.sideBarOpen
        )}>
        <ul
          className={classnames(
            'day-ul',
            styles.eventsContainer,
            styles.eventsContainerAllDay
          )}>
          <MediaQuery maxWidth={767}>
            {matches =>
              daysInfo.map((day, index) => {
                if (!matches || index === mobileDayOfWeek) {
                  return (
                    <li
                      className={classnames(
                        'day-li',
                        styles.eventsGroup,
                        calendar.selectedDate ===
                          moment(day.date).format('YYYY-MM-DD') &&
                          styles.bgHighlight
                      )}
                      key={index}
                      onClick={event => {
                        const { target } = event

                        if (
                          target.classList.contains('day-li') ||
                          target.classList.contains('day-ul')
                        ) {
                          history.push(
                            `/calendar/${moment(day.date).format('YYYY-MM-DD')}`
                          )
                        }
                      }}>
                      {day.staff
                        .filter(({ all_day }) => all_day)
                        .map((s, index) => (
                          <div
                            onClick={() =>
                              history.push(
                                `/calendar/${moment(day.date).format(
                                  'YYYY-MM-DD'
                                )}/staff/${s.id}`
                              )
                            }
                            key={index}
                            className={styles.allDayEvent}
                            style={{ background: s.colour }}>
                            <img
                              src={personIcon}
                              alt=""
                              className={styles.instructorIcon}
                            />{' '}
                            {s.instructor_name}
                          </div>
                        ))}
                      {day.events
                        .filter(({ all_day }) => all_day)
                        .map((event, index) => (
                          <div
                            onClick={() =>
                              history.push(
                                `/calendar/${moment(day.date).format(
                                  'YYYY-MM-DD'
                                )}/events/${event.id}`
                              )
                            }
                            key={index}
                            className={styles.allDayEvent}
                            style={{
                              background: mapLabelColoursWithContant(
                                {},
                                'EVENT'
                              )
                            }}>
                            {event.name}
                          </div>
                        ))}
                    </li>
                  )
                }
                return null
              })
            }
          </MediaQuery>
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
          {this.renderAllDay()}
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
