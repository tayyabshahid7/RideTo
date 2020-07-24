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
import { getStaff } from 'store/staff'
import { toggleUser, toggleCourse } from 'store/calendar'
import { getInstructors } from 'store/instructor'
import { getTestCentres } from 'store/testCentre'
import { CALENDAR_VIEW, DATE_FORMAT } from '../../common/constants'
import { fetchSettings } from 'store/settings'

class CalendarPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterOpen: false
    }
  }

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

  toggleFilter = value => {
    this.setState({ filterOpen: value })
  }

  loadInstructors() {
    const { getInstructors, schoolId } = this.props
    getInstructors(schoolId)
  }

  loadData() {
    this.loadCourses()
    this.loadEvents()
    this.loadStaff()
  }

  loadCourses(reset = false) {
    const { getCourses, schoolId, calendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    const formatedFirstDate = moment(firstDate).format(DATE_FORMAT)
    const formatedLastDate = moment(lastDate).format(DATE_FORMAT)
    const month = `${formatedFirstDate}-${formatedLastDate}-${schoolId}`

    if (!reset && calendar.loadedMonths.includes(month)) {
      return
    }

    getCourses({
      schoolId,
      firstDate: formatedFirstDate,
      lastDate: formatedLastDate,
      month,
      reset
    })
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

  loadStaff() {
    const { getStaff, schoolId, calendar, staffCalendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    const month = `${calendar.year}-${calendar.month}-${schoolId}`

    if (staffCalendar.loadedMonths.includes(month)) {
      return
    }

    getStaff({
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
    if (viewMode === CALENDAR_VIEW.DAY) {
      return {
        firstDate: firstDay,
        lastDate: firstDay
      }
    }

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

  generateDaysDataFromCalendar(
    { courses, ...calendar },
    eventCalendar,
    staffCalendar
  ) {
    const { events } = eventCalendar
    const { staff } = staffCalendar
    let dates = []
    if (calendar.viewMode === CALENDAR_VIEW.MONTH) {
      dates = this.generateCalendarDaysForMonth(calendar)
    } else if (calendar.viewMode === CALENDAR_VIEW.WEEK) {
      dates = this.generateCalendarDaysForWeek(calendar)
    } else {
      dates = this.generateCalendarDaysForDay(calendar)
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
      let staffForDate = staff
        .map(s => ({
          ...s,
          start_time: `${s.date}T${s.start_time}`,
          end_time: `${s.date}T${s.end_time}`
        }))
        .filter(
          s =>
            new Date(s.start_time) < oneDayLater && new Date(s.end_time) > date
        )
      return {
        date,
        courses: coursesForDate,
        events: eventsForDate,
        staff: staffForDate
      }
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

  generateCalendarDaysForDay({ year, month, day }) {
    return [new Date(year, month, day)]
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
      } else {
        nextDate = new Date(
          calendar.year,
          calendar.month,
          calendar.day + (type === 'prev' ? -1 : 1)
        )
      }
      updateCalendarSetting({
        year: nextDate.getFullYear(),
        month: nextDate.getMonth(),
        day: nextDate.getDate()
      })
    } else if (type === 'today') {
      updateCalendarSetting({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate()
      })
    }
  }

  handleChangeDate({ day, month, year }) {
    const { updateCalendarSetting } = this.props
    return updateCalendarSetting({ day, month, year })
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

  handleToggleUser = (userIds, active) => {
    this.props.toggleUser({ userIds, active })
  }

  handleToggleCourse = (courseIds, active) => {
    this.props.toggleCourse({ courseIds, active })
  }

  render() {
    const {
      calendar,
      eventCalendar,
      staffCalendar,
      history,
      location,
      schoolId,
      instructors,
      inactiveUsers,
      inactiveCourses,
      match
    } = this.props
    const { filterOpen } = this.state

    let days = this.generateDaysDataFromCalendar(
      calendar,
      eventCalendar,
      staffCalendar
    )
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
            staffCalendar={staffCalendar}
            handleCustomEvent={this.handleCustomEvent.bind(this)}
            handleChangeDate={this.handleChangeDate.bind(this)}
            history={history}
            calendarPath={calendarPath}
            match={match}
            handleMobileCellClick={this.handleMobileCellClick.bind(this)}
            toggleFilter={this.toggleFilter}
            sideBarOpen={!calendarPath}
            filterOpen={filterOpen}
            schoolId={schoolId}
            instructors={instructors}
            inactiveUsers={inactiveUsers}
            handleToggleUser={this.handleToggleUser}
            inactiveCourses={inactiveCourses}
            handleToggleCourse={this.handleToggleCourse}
          />
        </div>
        <RightPanel location={location}>
          <Route
            exact
            path="/calendar/:date"
            render={routeProps => (
              <CoursesPanel
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/courses/:courseId"
            render={routeProps => (
              <CoursesPanel
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/courses/create"
            render={routeProps => (
              <AddCourseComponent
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/courses/:courseId/edit"
            render={routeProps => (
              <EditCourseComponent
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/events/create"
            render={routeProps => (
              <AddEventComponent
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/events/:eventId"
            render={routeProps => (
              <CoursesPanel
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/events/:eventId/edit"
            render={routeProps => (
              <EditEventComponent
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/staff/create"
            render={routeProps => (
              <AddStaffComponent
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/staff/:staffId"
            render={routeProps => (
              <CoursesPanel
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/staff/:staffId/:diaryId/edit"
            render={routeProps => (
              <EditStaffComponent
                {...routeProps}
                loadCourses={this.loadCourses.bind(this)}
              />
            )}
          />
        </RightPanel>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { auth, course, event, staff } = state
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
  const staffCalendar = {
    ...staff.calendar,
    staffs: staff.calendar.staff.filter(isSupplier)
  }

  return {
    schoolId,
    calendar,
    eventCalendar,
    staffCalendar,
    settings: state.settings.settings,
    instructors: state.instructor.instructors,
    inactiveUsers: state.calendar.inactiveUsers,
    inactiveCourses: state.calendar.inactiveCourses
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCourses,
      getEvents,
      getStaff,
      getInstructors,
      getTestCentres,
      updateCalendarSetting,
      fetchSettings,
      toggleUser,
      toggleCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage)
