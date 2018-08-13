import React, { Component } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import CalendarComponent from 'components/Calendar'
import CoursesPanel from 'components/Calendar/CoursesPanel'
// import { changeSchool } from 'actions/authActions'
import OrdersPanel from 'components/Calendar/OrdersPanel'
import styles from './styles.scss'
import { Col, Row } from 'reactstrap'
import { getCourses, updateCalendarSetting } from 'actions/course'
import { CALENDAR_VIEW, DATE_FORMAT } from '../../common/constants'
import SchoolSelect from 'components/SchoolSelect'

class CalendarPage extends Component {
  componentDidMount() {
    this.loadCourses()
  }

  componentDidUpdate(prevProps) {
    const { schoolId, calendar } = this.props
    if (
      schoolId !== prevProps.schoolId ||
      calendar.month !== prevProps.calendar.month ||
      calendar.year !== prevProps.calendar.year ||
      calendar.day !== prevProps.calendar.day ||
      calendar.viewMode !== prevProps.calendar.viewMode
    ) {
      this.loadCourses()
    }
  }

  loadCourses() {
    const { getCourses, schoolId, calendar } = this.props
    const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)

    getCourses({
      schoolId,
      firstDate: moment(firstDate).format(DATE_FORMAT),
      lastDate: moment(lastDate).format(DATE_FORMAT)
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

  generateDaysDataFromCalendar({ courses, ...calendar }) {
    let dates = []
    if (calendar.viewMode === CALENDAR_VIEW.MONTH) {
      dates = this.generateCalendarDaysForMonth(calendar)
    } else {
      dates = this.generateCalendarDaysForWeek(calendar)
    }
    return dates.map(date => {
      let dateInString = moment(date).format('YYYY-MM-DD')
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
      return { date, courses: coursesForDate }
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

  render() {
    const { calendar, history } = this.props
    let days = this.generateDaysDataFromCalendar(calendar)
    return (
      <div className={styles.container}>
        <Row className="h-100">
          <Col xs="8" className={styles.calendarColumn}>
            <div className={styles.schoolWrapper}>
              <SchoolSelect />
            </div>
            <CalendarComponent
              days={days}
              calendar={calendar}
              handleCustomEvent={this.handleCustomEvent.bind(this)}
              history={history}
            />
          </Col>
          <Col xs="4" className={styles.rightPanel}>
            <Route
              exact
              path="/calendar/:date"
              render={routeProps => (
                <CoursesPanel {...routeProps} days={days} />
              )}
            />
            <Route
              exact
              path="/calendar/:date/courses/:courseId"
              render={routeProps => <OrdersPanel {...routeProps} days={days} />}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    calendar: state.course.calendar
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCourses,
      updateCalendarSetting
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage)
