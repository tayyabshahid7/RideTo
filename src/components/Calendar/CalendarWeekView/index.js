import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import styles from './index.scss'
import CalendarHeaderInstructors from '../CalendarHeaderInstructors'
import CalendarUserLine from '../CalendarUserLine'
import CurrentTimeLine from '../CurrentTimeLine'
import { WORK_HOURS, WEEK_START_HOUR, CALENDAR_VIEW } from 'common/constants'
import { secondsForDayAndDurationForEvent } from 'utils/helper'
import MediaQuery from 'react-responsive'
import isEqual from 'lodash/isEqual'
// import { mapLabelColoursWithContant } from 'services/settings'
// import personIcon from 'assets/images/person.png'

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

    this.firstCourse = null
  }

  componentDidMount() {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const { scrolled, mobileDayOfWeek } = this.state
    const { calendar } = this.props

    const hasCourses =
      calendar.viewMode === CALENDAR_VIEW.WEEK
        ? this.props.days[mobileDayOfWeek].courses.length
        : this.props.days[0].courses.length

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (!hasCourses) {
      if (!isDesktop && !scrolled) {
        window.scrollTo(0, 350)
        this.setState({ scrolled: true })
      }

      if (isDesktop && !scrolled) {
        window.scrollTo(0, 390)
        this.setState({ scrolled: true })
      }
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
      const { calendar } = this.props

      const hasCourses =
        calendar.viewMode === CALENDAR_VIEW.WEEK
          ? this.props.days[mobileDayOfWeek].courses.length
          : this.props.days[0].courses.length

      if (!hasCourses && !isDesktop) {
        const { scrolled } = this.state

        if (!scrolled) {
          window.scrollTo(0, 350)
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
      const top = parseInt(element.style.top.replace('px', ''), 10) - 100

      window.scrollTo(0, top)
      this.setState({ scrolled: true })
    }
  }

  renderTimeline() {
    return (
      <div className={styles.timeline} ref="timelineDiv">
        {Array.apply(null, { length: WORK_HOURS }).map((val, index) => {
          const time = ('00' + (index + WEEK_START_HOUR)).substr(-2)
          return (
            <div key={index} style={{ top: index * 56 + 'px' }}>
              <span>{time}:00</span>
            </div>
          )
        })}
      </div>
    )
  }

  renderWeekdays() {
    const { calendar, handleMobileCellClick, filterOpen } = this.props
    let daysInfo = this.getWeekDays()

    return (
      <div
        className={classnames(
          styles.weekDays,
          filterOpen && styles.filterOpen
        )}>
        <div
          className={classnames(
            styles.daysContainer,
            calendar.viewMode === CALENDAR_VIEW.DAY && styles.daysSingle
          )}>
          {daysInfo.map((day, index) => (
            <div
              className={classnames(
                styles.weekDaysHeader,
                calendar.selectedDate ===
                  moment(day.date).format('YYYY-MM-DD') && styles.bgHighlight,

                moment(day.date).isSame(
                  moment(
                    `${calendar.year}-${calendar.month + 1}-${calendar.day}`,
                    'YYYY-M-D'
                  ),
                  'day'
                ) && styles.mobileSameDate
              )}
              key={index}>
              <div className={styles.headerItem}>
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
                      <div>
                        {calendar.viewMode === CALENDAR_VIEW.WEEK && (
                          <Link
                            to={`/calendar/${moment(day.date).format(
                              'YYYY-MM-DD'
                            )}`}
                            className={classnames(
                              styles.date,
                              moment(day.date).isSame(moment(), 'day') &&
                                styles.highlight
                            )}>
                            {moment(day.date).format('ddd DD')}
                          </Link>
                        )}
                        <CalendarHeaderInstructors
                          isDay={calendar.viewMode === CALENDAR_VIEW.DAY}
                        />
                      </div>
                    )
                  }}
                </MediaQuery>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  showMonth(day) {
    if (day.date.getDate() === 1) {
      return `${moment(day.date).format('MMM')} - `
    }
    return ''
  }

  getWeekDays = () => {
    let { days } = this.props

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
    const { history, calendar, match, settings, users } = this.props
    const { mobileDayOfWeek } = this.state
    let daysInfo = this.getWeekDays()

    return (
      <div className={styles.events}>
        <div
          className={classnames(
            styles.eventsContainer,
            calendar.viewMode === CALENDAR_VIEW.DAY && styles.daysSingle
          )}>
          <MediaQuery maxWidth={767}>
            {matches =>
              daysInfo.map((day, index) => {
                if (!matches || index === mobileDayOfWeek) {
                  return (
                    <div
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
                      <CurrentTimeLine day={day} />
                      <div className={styles.weekDayGroup}>
                        {users.map(user => (
                          <CalendarUserLine
                            key={user.id}
                            day={day}
                            user={user}
                            history={history}
                            calendar={calendar}
                            match={match}
                            settings={settings}
                          />
                        ))}
                        {/* {day.courses &&
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
                          ))} */}
                      </div>
                    </div>
                  )
                }

                return null
              })
            }
          </MediaQuery>
        </div>
      </div>
    )
  }

  // renderAllDay() {
  //   const { days, calendar, history, sideBarOpen } = this.props
  //   const { mobileDayOfWeek } = this.state
  //   let daysInfo = this.getWeekDays()

  //   return (
  //     <div
  //       className={classnames(
  //         styles.events,
  //         styles.allDayEvents,
  //         sideBarOpen && styles.sideBarOpen
  //       )}>
  //       <div
  //         className={classnames(
  //           'day-ul',
  //           styles.eventsContainer,
  //           styles.eventsContainerAllDay
  //         )}>
  //         <MediaQuery maxWidth={767}>
  //           {matches =>
  //             daysInfo.map((day, index) => {
  //               if (!matches || index === mobileDayOfWeek) {
  //                 return (
  //                   <div
  //                     className={classnames(
  //                       'day-li',
  //                       styles.eventsGroup,
  //                       calendar.selectedDate ===
  //                         moment(day.date).format('YYYY-MM-DD') &&
  //                         styles.bgHighlight
  //                     )}
  //                     key={index}
  //                     onClick={event => {
  //                       const { target } = event

  //                       if (
  //                         target.classList.contains('day-li') ||
  //                         target.classList.contains('day-ul')
  //                       ) {
  //                         history.push(
  //                           `/calendar/${moment(day.date).format('YYYY-MM-DD')}`
  //                         )
  //                       }
  //                     }}>
  //                     {day.staff
  //                       .filter(({ all_day }) => all_day)
  //                       .map((s, index) => (
  //                         <div
  //                           onClick={() =>
  //                             history.push(
  //                               `/calendar/${moment(day.date).format(
  //                                 'YYYY-MM-DD'
  //                               )}/staff/${s.id}`
  //                             )
  //                           }
  //                           key={index}
  //                           className={styles.allDayEvent}
  //                           style={{ background: s.colour }}>
  //                           <img
  //                             src={personIcon}
  //                             alt=""
  //                             className={styles.instructorIcon}
  //                           />{' '}
  //                           {s.instructor_name}
  //                         </div>
  //                       ))}
  //                     {day.events
  //                       .filter(({ all_day }) => all_day)
  //                       .map((event, index) => (
  //                         <div
  //                           onClick={() =>
  //                             history.push(
  //                               `/calendar/${moment(day.date).format(
  //                                 'YYYY-MM-DD'
  //                               )}/events/${event.id}`
  //                             )
  //                           }
  //                           key={index}
  //                           className={styles.allDayEvent}
  //                           style={{
  //                             background: mapLabelColoursWithContant(
  //                               {},
  //                               'EVENT'
  //                             )
  //                           }}>
  //                           {event.name}
  //                         </div>
  //                       ))}
  //                   </div>
  //                 )
  //               }
  //               return null
  //             })
  //           }
  //         </MediaQuery>
  //       </div>
  //     </div>
  //   )
  // }

  render() {
    const { sideBarOpen } = this.props

    return (
      <div
        className={classnames(
          styles.container,
          sideBarOpen && styles.containerSidebar
        )}>
        <div className={styles.mainContent}>
          {this.renderWeekdays()}
          {/* {this.renderAllDay()} */}
          <div className={styles.weekviewContent}>
            {this.renderTimeline()}
            {this.renderDays()}
          </div>
        </div>
      </div>
    )
  }
}

export default CalendarWeekView
