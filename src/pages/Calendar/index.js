import React, { Component } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import classnames from 'classnames'
import moment from 'moment'
import CalendarComponent from 'components/Calendar'
import RightPanel from 'components/RightPanel'
import CoursesPanel from 'components/Calendar/CoursesPanel'
import AddCourseComponent from 'components/Calendar/AddEditCourse/AddCourseComponent'
import EditCourseComponent from 'components/Calendar/AddEditCourse/EditCourseComponent'
import AddEventComponent from 'components/Calendar/AddEditEvent/AddEventComponent'
import EditEventComponent from 'components/Calendar/AddEditEvent/EditEventComponent'
import AddShiftComponent from 'components/Calendar/StaffShift/AddShiftComponent'
import EditShiftComponent from 'components/Calendar/StaffShift/EditShiftComponent'
import AddOrderComponent from 'components/Calendar/Orders/AddOrderComponent'
import EditOrderComponent from 'components/Calendar/Orders/EditOrderComponent'

import styles from './styles.scss'
import {
  getCourses,
  updateCalendarSetting,
  unsetSelectedDate
} from 'store/course'
import { getEvents } from 'store/event'
import { getStaff } from 'store/staff'
import { toggleUser, toggleCourse } from 'store/calendar'
import { getTestCentres, getDefaultTestCentres } from 'store/testCentre'
import { CALENDAR_VIEW, DATE_FORMAT } from '../../common/constants'
import { fetchSettings } from 'store/settings'

class CalendarPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterOpen: false,
      loadedSchools: []
    }
  }

  componentDidMount() {
    const { activeSchools } = this.props
    this.loadData(activeSchools)
    this.props.getTestCentres()
    this.props.getDefaultTestCentres()

    if (!this.props.settings) {
      this.props.fetchSettings()
    }
    this.setState({ loadedSchools: activeSchools })
  }

  componentDidUpdate(prevProps) {
    const { activeSchools, calendar, match } = this.props
    const { loadedSchools } = this.state
    const diffSchools = _.difference(activeSchools, loadedSchools)

    if (diffSchools.length) {
      this.setState({ loadedSchools: [...loadedSchools, ...diffSchools] })
    }

    if (
      diffSchools.length ||
      ((calendar.month !== prevProps.calendar.month ||
        calendar.year !== prevProps.calendar.year ||
        calendar.day !== prevProps.calendar.day ||
        calendar.viewMode !== prevProps.calendar.viewMode) &&
        !calendar.silent)
    ) {
      this.loadData(activeSchools)
    }

    if (
      prevProps.match.params.date !== match.params.date &&
      !match.params.date
    ) {
      this.props.unsetSelectedDate()
    }
  }

  toggleFilter = value => {
    this.setState({ filterOpen: value })
  }

  loadData(schoolIds) {
    this.loadSchoolCourses(schoolIds)
    this.loadEvents(schoolIds)
    this.loadStaff()
  }

  loadSchoolCourses(schoolIds) {
    const { getCourses, calendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    const formatedFirstDate = moment(firstDate).format(DATE_FORMAT)
    const formatedLastDate = moment(lastDate).format(DATE_FORMAT)

    schoolIds.forEach(schoolId => {
      const month = `${formatedFirstDate}-${formatedLastDate}-${schoolId}`
      if (
        Array.isArray(calendar.loadedMonths) &&
        calendar.loadedMonths.includes(month)
      ) {
        return
      }

      getCourses({
        schoolId,
        firstDate: formatedFirstDate,
        lastDate: formatedLastDate,
        month
      })
    })
  }

  loadCourses = (reset = false) => {
    const { getCourses, activeSchools, calendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    const formatedFirstDate = moment(firstDate).format(DATE_FORMAT)
    const formatedLastDate = moment(lastDate).format(DATE_FORMAT)

    activeSchools.forEach(schoolId => {
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
    })
  }

  loadEvents(schoolIds) {
    const { getEvents, calendar, eventCalendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)

    schoolIds.forEach(schoolId => {
      let month = `${calendar.year}-${calendar.month}-${schoolId}`
      if (eventCalendar.loadedMonths.includes(month)) {
        return
      }

      if (
        calendar.viewMode === CALENDAR_VIEW.WEEK ||
        calendar.viewMode === CALENDAR_VIEW.DAY
      ) {
        month = null
      }

      getEvents({
        schoolId,
        firstDate: moment(firstDate).format(DATE_FORMAT),
        lastDate: moment(lastDate).format(DATE_FORMAT),
        month
      })
    })
  }

  loadStaff() {
    const { getStaff, calendar, staffCalendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)

    let month = `${calendar.year}-${calendar.month}`

    if (staffCalendar.loadedMonths.includes(month)) {
      return
    }

    if (
      calendar.viewMode === CALENDAR_VIEW.WEEK ||
      calendar.viewMode === CALENDAR_VIEW.DAY
    ) {
      month = null
    }

    getStaff({
      firstDate: moment(firstDate).format(DATE_FORMAT),
      lastDate: moment(lastDate).format(DATE_FORMAT),
      month
    })
  }

  getFirstAndLastDate({ year, month, day, viewMode }) {
    let oneDay = 1000 * 60 * 60 * 24
    if (viewMode === CALENDAR_VIEW.MONTH || viewMode === CALENDAR_VIEW.SHIFT) {
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

  generateDaysDataFromCalendar = (
    { courses, ...calendar },
    eventCalendar,
    staffCalendar
  ) => {
    const {
      instructors,
      suppliers,
      inactiveCourses,
      activeSchools
    } = this.props

    courses = courses
      .filter(x => activeSchools.includes(x.supplier))
      .filter(x => !inactiveCourses.includes(x.course_type.id))

    courses.forEach(course => {
      if (course.instructor && course.instructor.id) {
        const tmp = instructors.find(x => x.id === course.instructor.id)
        if (tmp) {
          course.instructor = tmp
        }
      }
      const supTmp = suppliers.find(x => x.id === course.supplier)
      if (supTmp) {
        course.supplierName = supTmp.name
      }
    })

    let { events } = eventCalendar

    events = events.filter(x => activeSchools.includes(x.supplier))
    events = events.sort((a, b) => {
      if (a.all_day) {
        return -1
      } else if (b.all_day) {
        return 1
      } else {
        return moment(a.start_time).valueOf() - moment(b.start_time).valueOf()
      }
    })
    events.forEach(event => {
      const supTmp = suppliers.find(x => x.id === event.supplier)
      if (supTmp) {
        event.supplierName = supTmp.name
      }
      if (event.all_day) {
        event.start_time = event.start_time.substr(0, 11) + '05:00:00Z'
        event.end_time = event.end_time.substr(0, 11) + '22:59:00Z'
      }
    })

    const { staff } = staffCalendar

    staff.forEach(item => {
      const tmp = instructors.find(x => x.id === item.instructor_id)
      if (tmp) {
        item.instructor = tmp
      }

      const supTmp = suppliers.find(x => x.id === item.supplier_id)
      if (supTmp) {
        item.supplierName = supTmp.name
      }
    })

    let dates = []
    if (
      calendar.viewMode === CALENDAR_VIEW.MONTH ||
      calendar.viewMode === CALENDAR_VIEW.SHIFT
    ) {
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
      let staffForDate = staff.filter(
        s =>
          moment(s.start_date, 'YYYY-MM-DD').isSameOrBefore(moment(date)) &&
          moment(s.end_date, 'YYYY-MM-DD').isSameOrAfter(moment(date))
      )

      return {
        date,
        courses: coursesForDate,
        events: eventsForDate,
        staff: staffForDate
      }
    })
  }

  generateCalendarDaysForMonth({ year, month, day, viewMode }) {
    let { firstDate } = this.getFirstAndLastDate({
      year,
      month,
      day,
      viewMode
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

  handleCustomEvent = (type, params) => {
    const { updateCalendarSetting, calendar } = this.props
    if (type === 'change-calendar-setting') {
      updateCalendarSetting(params)
      if (params.viewMode) {
        this.props.history.push(`/calendar`)
      }
    } else if (type === 'prev' || type === 'next') {
      let nextDate
      if (
        calendar.viewMode === CALENDAR_VIEW.MONTH ||
        calendar.viewMode === CALENDAR_VIEW.SHIFT
      ) {
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

  handleChangeDate = ({ day, month, year }) => {
    const { updateCalendarSetting } = this.props
    return updateCalendarSetting({ day, month, year })
  }

  handleMobileCellClick = dateStr => {
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
      instructors,
      inactiveUsers,
      inactiveCourses,
      activeSchools,
      suppliers,
      settings,
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
            suppliers={suppliers}
            eventCalendar={eventCalendar}
            staffCalendar={staffCalendar}
            handleCustomEvent={this.handleCustomEvent}
            handleChangeDate={this.handleChangeDate}
            history={history}
            calendarPath={calendarPath}
            match={match}
            handleMobileCellClick={this.handleMobileCellClick}
            toggleFilter={this.toggleFilter}
            sideBarOpen={!calendarPath}
            filterOpen={filterOpen}
            activeSchools={activeSchools}
            instructors={instructors}
            inactiveUsers={inactiveUsers}
            settings={settings}
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
              <CoursesPanel {...routeProps} loadCourses={this.loadCourses} />
            )}
          />
          <Route
            exact
            path="/calendar/:date/courses/:courseId"
            render={routeProps => (
              <CoursesPanel {...routeProps} loadCourses={this.loadCourses} />
            )}
          />
          <Route
            exact
            path="/calendar/courses/create"
            render={routeProps => (
              <AddCourseComponent
                {...routeProps}
                loadCourses={this.loadCourses}
              />
            )}
          />
          <Route
            exact
            path="/calendar/:date/courses/:courseId/edit"
            render={routeProps => (
              <EditCourseComponent
                {...routeProps}
                loadCourses={this.loadCourses}
              />
            )}
          />
          <Route
            exact
            path="/calendar/events/create"
            render={routeProps => <AddEventComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/events/:eventId"
            render={routeProps => (
              <CoursesPanel {...routeProps} loadCourses={this.loadCourses} />
            )}
          />
          <Route
            exact
            path="/calendar/:date/events/:eventId/edit"
            render={routeProps => <EditEventComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/shifts/add"
            render={routeProps => <AddShiftComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/shifts/:staffId/:diaryId/edit"
            render={routeProps => <EditShiftComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/orders/add"
            render={routeProps => <AddOrderComponent {...routeProps} />}
          />
          <Route
            exact
            path="/calendar/:date/orders/edit"
            render={routeProps => (
              <EditOrderComponent
                {...routeProps}
                loadCourses={this.loadCourses}
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

  return {
    activeSchools: auth.activeSchools,
    calendar: course.calendar,
    eventCalendar: event.calendar,
    staffCalendar: staff.calendar,
    settings: state.settings.settings,
    instructors: state.instructor.instructors,
    inactiveUsers: state.calendar.inactiveUsers,
    inactiveCourses: state.calendar.inactiveCourses,
    suppliers: state.auth.user.suppliers
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCourses,
      getEvents,
      getStaff,
      getTestCentres,
      getDefaultTestCentres,
      updateCalendarSetting,
      unsetSelectedDate,
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
