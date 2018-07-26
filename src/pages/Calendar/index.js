import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CalendarComponent from '../../components/Calendar/CalendarComponent'
import CoursesPanel from '../../components/Calendar/CoursesPanel'

class CalendarPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: {
        year: 2018,
        month: 5
      }
    }
  }

  generateCalendarInfo(info) {
    let firstDay = new Date(info.year, info.month, 1)
    let dayOne = firstDay.getDay()
    let oneDay = 1000 * 60 * 60 * 24

    let days = []

    let firstDateInMonthCalendar = new Date(firstDay - dayOne * oneDay)
    for (let i = 0; i < 35; i++) {
      let date = new Date(firstDateInMonthCalendar)
      date.setDate(date.getDate() + i)
      days.push({ date })
    }
    console.log('HALA days', days)
    return days
  }
  render() {
    const { info } = this.state
    let days = this.generateCalendarInfo(info)
    return (
      <div className="page calendar-page">
        <div className="calendar-wrap col-md-8">
          <CalendarComponent days={days} info={info} />
        </div>
        <div className="courses-panel-wrapper col-md-4">
          <CoursesPanel />
        </div>
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
    loading: state.orders.loading
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage)
