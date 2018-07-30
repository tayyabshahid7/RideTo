import React, { Component } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import CalendarComponent from 'components/Calendar'
import CoursesPanel from 'components/Calendar/CoursesPanel'
import OrdersPanel from 'components/Calendar/OrdersPanel'
import styles from './styles.scss'
import { Col, Row } from 'reactstrap'
import { getCourses, updateCalendarSetting } from 'actions/calendar'
import { CALENDAR_VIEW } from '../../common/constants'

class CalendarPage extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     info: {
  //       year: 2018,
  //       month: 5
  //     }
  //   }
  // }
  componentDidMount() {
    const { getCourses } = this.props
    getCourses({})
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
      let coursesForDate = courses.filter(
        course => course.date === dateInString
      )
      return { date, courses: coursesForDate }
    })
  }

  generateCalendarDaysForMonth({ year, month }) {
    let firstDay = new Date(year, month, 1)
    let dayOne = firstDay.getDay()
    let oneDay = 1000 * 60 * 60 * 24
    let dayLast = new Date(year, month + 1, 0)

    let days = []

    let firstDateInMonthCalendar = new Date(firstDay - dayOne * oneDay)
    let monthViewDays = dayOne + dayLast.getDate() <= 35 ? 35 : 42
    for (let i = 0; i < monthViewDays; i++) {
      let date = new Date(firstDateInMonthCalendar)
      date.setDate(date.getDate() + i)
      days.push(date)
      // let dateInString = moment(date).format('YYYY-MM-DD')
      // let coursesForDate = courses.filter(
      //   course => course.date === dateInString
      // )
      // days.push({ date, courses: coursesForDate })
    }
    return days
  }

  generateCalendarDaysForWeek({ year, month, day }) {
    let firstDay = new Date(year, month, day)
    let dayOne = firstDay.getDay()
    let oneDay = 1000 * 60 * 60 * 24

    let days = []

    let firstDateInWeekCalendar = new Date(firstDay - dayOne * oneDay)
    console.log(firstDateInWeekCalendar)
    for (let i = 0; i < 7; i++) {
      let date = new Date(firstDateInWeekCalendar)
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
    const { schoolName, calendar } = this.props
    let days = this.generateDaysDataFromCalendar(calendar)
    return (
      <div className={styles.container}>
        <h2>{schoolName}</h2>
        <Row>
          <Col xs="8">
            <CalendarComponent
              days={days}
              calendar={calendar}
              handleCustomEvent={this.handleCustomEvent.bind(this)}
            />
          </Col>
          <Col xs="4">
            <Route
              exact
              path="/calendar/:date"
              render={routeProps => (
                <CoursesPanel {...routeProps} days={days} />
              )}
            />
            <Route
              exact
              path="/calendar/:date/orders/:courseId"
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
    schoolName: state.auth.schoolName,
    confirmedOrders: state.orders.confirmedOrders,
    page: state.orders.page,
    loading: state.orders.loading,
    calendar: state.calendar
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
