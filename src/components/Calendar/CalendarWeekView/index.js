import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import classnames from 'classnames'
import styles from './index.scss'
import CalendarHeaderInstructors from '../CalendarHeaderInstructors'
import CalendarUserLine from '../CalendarUserLine'
import CalendarDetailLine from '../CalendarDetailLine'
import CurrentTimeLine from '../CurrentTimeLine'
import { WORK_HOURS, WEEK_START_HOUR, CALENDAR_VIEW } from 'common/constants'
import { secondsForDayAndDurationForEvent } from 'utils/helper'
import { Desktop, Mobile } from 'common/breakpoints'
import isEqual from 'lodash/isEqual'
import { SHIFT_TYPES } from '../../../common/constants'

// import { mapLabelColoursWithContant } from 'services/settings'

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

  getWeekDayStyle = day => {
    const { calendar } = this.props

    return classnames(
      styles.weekDaysHeader,
      calendar.selectedDate === moment(day.date).format('YYYY-MM-DD') &&
        styles.bgHighlight,

      moment(day.date).isSame(
        moment(
          `${calendar.year}-${calendar.month + 1}-${calendar.day}`,
          'YYYY-M-D'
        ),
        'day'
      ) && styles.mobileSameDate
    )
  }

  handleSelectDay = date => () => {
    const { handleChangeDate } = this.props

    handleChangeDate({
      year: parseInt(moment(date).format('YYYY')),
      month: parseInt(moment(date).format('MM')) - 1,
      day: parseInt(moment(date).format('D'))
    })
  }

  showMonth(day) {
    if (day.date.getDate() === 1) {
      return `${moment(day.date).format('MMM')} - `
    }
    return ''
  }

  getWeekDays = () => {
    let { days, users } = this.props

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
              itemType: 'event',
              ...secondsForDayAndDurationForEvent(event, dayObj.date)
            }
          }),
        ...dayObj.staff
          .filter(({ all_day }) => !all_day)
          .filter(x => x.event_type !== SHIFT_TYPES[0].id)
          .map(s => {
            return {
              ...s,
              itemType: 'staff',
              ...secondsForDayAndDurationForEvent(s, dayObj.date)
            }
          })
      ]

      if (!users.length) {
        dayObj.courses = dayObj.courses.filter(x => x.itemType !== 'staff')
      }

      dayObj.courses = _.orderBy(dayObj.courses, 'secondsForDay')

      let barMap = []
      let coursePositions = []
      for (let i = 0; i < dayObj.courses.length; i++) {
        let course = dayObj.courses[i]
        if (barMap.length === 0) {
          barMap.push(course)
          coursePositions.push(0)
        } else {
          let j
          for (j = barMap.length - 1; j >= 0; j--) {
            if (
              course.secondsForDay >= barMap[j].secondsForDay &&
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
      dayObj.barCount = Math.max(...coursePositions) + 1
      dayObj.coursePositions = coursePositions
      return dayObj
    })
    return results
  }

  getWeekHeaderDays = () => {
    let { days } = this.props
    if (days.length === 1) {
      let tmp = moment(days[0].date)
      tmp = tmp.startOf('isoWeek')
      const result = []
      for (let i = 0; i < 7; i++) {
        tmp.add(1, 'days')
        result.push({ date: tmp.toDate() })
      }
      return result
    } else {
      return days
    }
  }

  getDayViewDateStyle = currDay => {
    const { calendar } = this.props
    const { year, month, day } = calendar
    const date = new Date(year, month, day)
    return classnames(
      styles.date,
      moment(currDay.date).isSame(moment(date), 'day') && styles.highlight
    )
  }

  getDayStyle = day => {
    return classnames(
      styles.date,
      moment(day.date).isSame(moment(), 'day') && styles.highlight
    )
  }

  handleDayClick = day => event => {
    const { history } = this.props
    const { target } = event

    if (
      target.classList.contains('day-li') ||
      target.classList.contains('day-ul')
    ) {
      history.push(`/calendar/${moment(day.date).format('YYYY-MM-DD')}`)
    }
  }

  showUser = (user, day) => {
    if (user.id === -1) {
      return true
    }

    const courses = day.courses.filter(x => x.instructor === user.id)
    const staffs = day.staff.filter(
      x => x.instructor_id === user.id
      //  && x.event_type !== SHIFT_TYPES[0].id
    )
    return courses.length || staffs.length
  }

  getDaysUserCount = (users, daysInfo) => {
    return daysInfo.map(day => {
      return users.filter(user => this.showUser(user, day)).map(user => user.id)
    })
  }

  getDaysStyle = users => {
    const cols = users.map(x => (x.length || 1) + 'fr').join(' ')
    return {
      gridTemplateColumns: cols
    }
  }

  renderWeekdays() {
    const { calendar, users, filterOpen } = this.props
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    let daysInfo = isDesktop ? this.getWeekDays() : this.getWeekHeaderDays()
    const weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const daysUser = this.getDaysUserCount(users, daysInfo)

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
          )}
          style={this.getDaysStyle(daysUser)}>
          {daysInfo.map((day, index) => (
            <div className={this.getWeekDayStyle(day)} key={index}>
              <Mobile>
                <span>{weeks[index]}</span>
              </Mobile>
              <div>
                {calendar.viewMode === CALENDAR_VIEW.WEEK && (
                  <Link
                    to={`/calendar/${moment(day.date).format('YYYY-MM-DD')}`}
                    className={this.getDayStyle(day)}>
                    {moment(day.date).format(isDesktop ? 'ddd DD' : 'D')}
                  </Link>
                )}
                {calendar.viewMode === CALENDAR_VIEW.DAY && !isDesktop && (
                  <div
                    className={this.getDayViewDateStyle(day)}
                    onClick={this.handleSelectDay(day.date)}>
                    {moment(day.date).format(isDesktop ? 'ddd DD' : 'D')}
                  </div>
                )}
                <Desktop>
                  <CalendarHeaderInstructors
                    day={day}
                    users={users}
                    daysUser={daysUser[index]}
                    isDay={calendar.viewMode === CALENDAR_VIEW.DAY}
                  />
                </Desktop>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderDays() {
    const { history, calendar, match, suppliers, settings, users } = this.props
    // const { mobileDayOfWeek } = this.state
    let daysInfo = this.getWeekDays()
    const daysUser = this.getDaysUserCount(users, daysInfo)

    return (
      <div className={styles.events}>
        <div
          className={classnames(
            styles.eventsContainer,
            calendar.viewMode === CALENDAR_VIEW.DAY && styles.contentSingle
          )}
          style={this.getDaysStyle(daysUser)}>
          {daysInfo.map((day, index) => (
            <div
              onClick={this.handleDayClick(day)}
              className={classnames(
                'day-li',
                styles.eventsGroup,
                calendar.selectedDate ===
                  moment(day.date).format('YYYY-MM-DD') && styles.bgHighlight
              )}
              key={index}>
              <CurrentTimeLine day={day} />
              <div className={styles.weekDayGroup}>
                <Mobile>
                  <CalendarDetailLine
                    day={day}
                    history={history}
                    calendar={calendar}
                    match={match}
                    settings={settings}
                  />
                </Mobile>
                <Desktop>
                  {users.map(user =>
                    daysUser[index].includes(user.id) ? (
                      <CalendarUserLine
                        key={user.id}
                        day={day}
                        user={user}
                        history={history}
                        calendar={calendar}
                        match={match}
                        settings={settings}
                      />
                    ) : null
                  )}
                  {!users.length && (
                    <CalendarDetailLine
                      day={day}
                      history={history}
                      suppliers={suppliers}
                      calendar={calendar}
                      match={match}
                      settings={settings}
                    />
                  )}
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
                </Desktop>
              </div>
            </div>
          ))}
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
