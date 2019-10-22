import React, { Component } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import moment from 'moment'
import CalendarComponent from 'components/Calendar'
import RightPanel from 'components/RightPanel'
import CoursesPanel from 'components/Calendar/CoursesPanel'
import AddCourseComponent from 'components/Calendar/AddEditCourse/AddCourseComponent'
import EditCourseComponent from 'components/Calendar/AddEditCourse/EditCourseComponent'
import AddEventComponent from 'components/Calendar/AddEditEvent/AddEventComponent'
import EditEventComponent from 'components/Calendar/AddEditEvent/EditEventComponent'
import AddStaffComponent from 'components/Calendar/AddEditStaff/AddStaffComponent'
import EditStaffComponent from 'components/Calendar/AddEditStaff/EditStaffComponent'
import styles from './styles.scss'
import { getCourses, updateCalendarSetting } from 'store/course'
import { getEvents } from 'store/event'
import { getInstructors } from 'store/instructor'
import { getTestCentres } from 'store/testCentre'
import { CALENDAR_VIEW, DATE_FORMAT } from '../../common/constants'
import { fetchSettings } from 'store/settings'

class CalendarPage extends Component {
  componentDidMount() {
    this.loadData()
    this.loadInstructors()
    this.props.getTestCentres()

    if (!this.props.settings) {
      this.props.fetchSettings()
    }
  }

  componentDidUpdate(prevProps) {
    const { schoolId, calendar } = this.props
    if (
      schoolId !== prevProps.schoolId ||
      ((calendar.month !== prevProps.calendar.month ||
        calendar.year !== prevProps.calendar.year ||
        calendar.day !== prevProps.calendar.day ||
        calendar.viewMode !== prevProps.calendar.viewMode) &&
        !calendar.silent)
    ) {
      this.loadData()
    }
  }

  loadInstructors() {
    const { getInstructors, schoolId } = this.props
    getInstructors(schoolId)
  }

  loadData() {
    this.loadCourses()
    this.loadEvents()
  }

  loadEvents() {
    const { getEvents, schoolId, calendar, eventCalendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    const month = `${calendar.year}-${calendar.month}-${schoolId}`

    if (eventCalendar.loadedMonths.includes(month)) {
      return
    }

    getEvents({
      schoolId,
      firstDate: moment(firstDate).format(DATE_FORMAT),
      lastDate: moment(lastDate).format(DATE_FORMAT),
      month
    })
  }

  loadCourses() {
    const { getCourses, schoolId, calendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    const month = `${calendar.year}-${calendar.month}-${schoolId}`

    if (calendar.loadedMonths.includes(month)) {
      return
    }

    getCourses({
      schoolId,
      firstDate: moment(firstDate).format(DATE_FORMAT),
      lastDate: moment(lastDate).format(DATE_FORMAT),
      month
    })
  }

  getFirstAndLastDate({ year, month, day, viewMode }) {
    let oneDay = 1000 * 60 * 60 * 24
    if (viewMode === CALENDAR_VIEW.MONTH) {
      let firstDay = new Date(year, month, 1)
      let dayOne = firstDay.getDay()
      if (dayOne === 0) {
        dayOne = 6
      } else {
        dayOne--
      }
      let dayLast = new Date(year, month + 1, 0)
      let firstDateInMonthCalendar = new Date(firstDay - dayOne * oneDay)
      let monthViewDays = dayOne + dayLast.getDate() <= 35 ? 35 : 42
      let date = new Date(firstDateInMonthCalendar)
      date.setDate(date.getDate() + monthViewDays - 1)
      return { firstDate: firstDateInMonthCalendar, lastDate: date }
    }

    let firstDay = new Date(year, month, day)
    let dayOne = firstDay.getDay()
    if (dayOne === 0) {
      dayOne = 6
    } else {
      dayOne--
    }
    let firstDateInWeekCalendar = new Date(firstDay - dayOne * oneDay)
    let date = new Date(firstDateInWeekCalendar)
    date.setDate(date.getDate() + 6)
    return { firstDate: firstDateInWeekCalendar, lastDate: date }
  }

  generateDaysDataFromCalendar({ courses, ...calendar }, eventCalendar) {
    const { events } = eventCalendar
    let dates = []
    if (calendar.viewMode === CALENDAR_VIEW.MONTH) {
      dates = this.generateCalendarDaysForMonth(calendar)
    } else {
      dates = this.generateCalendarDaysForWeek(calendar)
    }
    return dates.map(date => {
      let dateInString = moment(date).format('YYYY-MM-DD')

      let oneDayLater = new Date(date)
      oneDayLater.setDate(oneDayLater.getDate() + 1)

      let coursesForDate = courses
        .filter(course => course.date === dateInString)
        .sort((a, b) => {
          if (a.time > b.time) {
            return 1
          } else if (a.time === b.time) {
            return 0
          }
          return -1
        })
      let eventsForDate = events.filter(
        event =>
          new Date(event.start_time) < oneDayLater &&
          new Date(event.end_time) > date
      )
      return { date, courses: coursesForDate, events: eventsForDate }
    })
  }

  generateCalendarDaysForMonth({ year, month, day }) {
    let { firstDate } = this.getFirstAndLastDate({
      year,
      month,
      day,
      viewMode: CALENDAR_VIEW.MONTH
    })

    let dayLast = new Date(year, month + 1, 0)

    let days = []
    let diffDays = moment(dayLast).diff(moment(firstDate), 'days')
    let monthViewDays = diffDays < 35 ? 35 : 42
    for (let i = 0; i < monthViewDays; i++) {
      let date = new Date(firstDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  generateCalendarDaysForWeek({ year, month, day }) {
    let { firstDate } = this.getFirstAndLastDate({
      year,
      month,
      day,
      viewMode: CALENDAR_VIEW.WEEK
    })

    let days = []

    for (let i = 0; i < 7; i++) {
      let date = new Date(firstDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }

    return days
  }
  handleCustomEvent(type, params) {
    const { updateCalendarSetting, calendar } = this.props
    if (type === 'change-calendar-setting') {
      updateCalendarSetting(params)
    } else if (type === 'prev' || type === 'next') {
      let nextDate
      if (calendar.viewMode === CALENDAR_VIEW.MONTH) {
        nextDate = new Date(
          calendar.year,
          calendar.month + (type === 'prev' ? -1 : 1),
          calendar.day
        )
        if (
          Math.abs(calendar.month - nextDate.getMonth()) !== 1 ||
          Math.abs(calendar.month - nextDate.getMonth()) !== 11
        ) {
          // That means the two months are passed
          if (type === 'prev') {
            // This is the case when July 31 and click prev
            nextDate = new Date(calendar.year, calendar.month, 0)
          } else {
            // This is when Aug 31 and click next, and it goes Oct 1
            nextDate = new Date(calendar.year, calendar.month + 2, 0)
          }
        }
      } else if (calendar.viewMode === CALENDAR_VIEW.WEEK) {
        nextDate = new Date(
          calendar.year,
          calendar.month,
          calendar.day + (type === 'prev' ? -7 : 7)
        )
      }
      updateCalendarSetting({
        year: nextDate.getFullYear(),
        month: nextDate.getMonth(),
        day: nextDate.getDate()
      })
    }
  }

  handleChangeDate({ month, year }) {
    const { calendar, updateCalendarSetting } = this.props
    let date = moment({
      year: calendar.year,
      month: calendar.month,
      day: calendar.day
    })

    const endDay = moment({
      year: year || calendar.year,
      month: month || calendar.month
    })
      .endOf('month')
      .date()

    if (calendar.day > endDay) {
      date.date(endDay)
    }

    if (month) {
      date.month(parseInt(month))
    } else if (year) {
      date.year(parseInt(year))
    }

    updateCalendarSetting({
      year: date.year(),
      month: date.month(),
      day: date.date()
    })
  }

  handleMobileCellClick(dateStr) {
    const { updateCalendarSetting } = this.props
    const date = moment(dateStr)

    updateCalendarSetting({
      year: date.year(),
      month: date.month(),
      day: date.date()
    })

    this.handleCustomEvent('change-calendar-setting', {
      viewMode: CALENDAR_VIEW.WEEK
    })
  }

  render() {
    const { calendar, eventCalendar, history, location, match } = this.props
    let days = this.generateDaysDataFromCalendar(calendar, eventCalendar)
    let calendarPath = location.pathname === '/calendar'
    return (
      <div className={styles.calendar}>
        <div
          className={classnames(
            styles.calendarColumn,
            !calendarPath && styles.noCalendarPath
          )}>
          <CalendarComponent
            days={days}
            calendar={calendar}
            eventCalendar={eventCalendar}
            handleCustomEvent={this.handleCustomEvent.bind(this)}
            handleChangeDate={this.handleChangeDate.bind(this)}
            history={history}
            calendarPath={calendarPath}
            match={match}
            handleMobileCellClick={this.handleMobileCellClick.bind(this)}
          />
        </div>
        <RightPanel location={location}>
          <Route
            exact
            path="/calendar/:date"
            render={routeProps => <CoursesPanel {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/courses/:courseId"
            render={routeProps => <CoursesPanel {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/courses/create"
            render={routeProps => <AddCourseComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/courses/:courseId/edit"
            render={routeProps => <EditCourseComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/events/create"
            render={routeProps => <AddEventComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/events/:eventId"
            render={routeProps => <CoursesPanel {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/events/:eventId/edit"
            render={routeProps => <EditEventComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/staff/create"
            render={routeProps => <AddStaffComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/staff/:staffId"
            render={routeProps => <CoursesPanel {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/staff/:staffId/edit"
            render={routeProps => <EditStaffComponent {...routeProps} />}
          />
        </RightPanel>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { auth, course, event } = state
  const schoolId = auth.schoolId || auth.user.suppliers[0].id
  const isSupplier = course => course.supplier === parseInt(schoolId)
  const calendar = {
    ...course.calendar,
    courses: course.calendar.courses.filter(isSupplier)
  }
  const eventCalendar = {
    ...event.calendar,
    events: event.calendar.events.filter(isSupplier)
  }

  return {
    schoolId,
    calendar,
    eventCalendar,
    settings: state.settings.settings
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCourses,
      getEvents,
      getInstructors,
      getTestCentres,
      updateCalendarSetting,
      fetchSettings
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage)
