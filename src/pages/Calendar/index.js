import React, { Component } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import CalendarComponent from 'components/Calendar'
import CoursesPanel from 'components/Calendar/CoursesPanel'
import styles from './styles.scss'
import { Col, Row } from 'reactstrap'
import { getCourses } from 'actions/calendar'

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

  generateCalendarInfo({ year, month, courses }) {
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
      let dateInString = moment(date).format('YYYY-MM-DD')
      let coursesForDate = courses.filter(
        course => course.date === dateInString
      )
      days.push({ date, courses: coursesForDate })
    }
    return days
  }
  render() {
    const { schoolName, calendar } = this.props
    let info = { year: calendar.year, month: calendar.month }
    let days = this.generateCalendarInfo(calendar)

    return (
      <div className={styles.container}>
        <h2>{schoolName}</h2>
        <Row>
          <Col xs="8">
            <CalendarComponent days={days} info={info} ca />
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
              render={routeProps => <h3>Orders</h3>}
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
      getCourses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage)
