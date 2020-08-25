import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getDayCourses } from 'store/course'
import { getDayEvents } from 'store/event'
import { getDayStaff } from 'store/staff'
import Loading from 'components/Loading'
import DateHeading from 'components/Calendar/DateHeading'
import CoursesPanel from './CoursesPanel'
import { isAdmin } from 'services/auth'

class CoursesPanelContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addingOrder: null
    }

    this.updateAdding = this.updateAdding.bind(this)
  }

  updateAdding(id) {
    this.setState({
      addingOrder: id
    })
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      this.loadData()
    }
  }

  loadData() {
    const {
      getDayCourses,
      getDayEvents,
      match,
      schools,
      getDayStaff
    } = this.props

    const {
      params: { date }
    } = match

    const schoolIds = schools.map(x => x.id)

    getDayCourses({ schoolIds, date })
    getDayEvents({ schoolIds, date })
    getDayStaff({ schoolIds, date })
  }

  render() {
    const {
      courses,
      loading,
      match,
      events,
      staff,
      isAdmin,
      schools,
      instructors,
      loadCourses
    } = this.props
    const {
      params: { date, courseId, eventId, staffId }
    } = match
    const { addingOrder } = this.state

    return (
      <Loading loading={loading}>
        <DateHeading date={moment(date, 'YYYY-MM-DD')} backLink={`/calendar`} />
        <CoursesPanel
          courseId={courseId}
          eventId={eventId}
          staffId={staffId}
          addingOrder={addingOrder}
          date={date}
          courses={courses.sort((a, b) => a.time > b.time)}
          events={events}
          updateAdding={this.updateAdding}
          staff={staff}
          isAdmin={isAdmin}
          loadCourses={loadCourses}
          schools={schools}
          instructors={instructors}
        />
      </Loading>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    courses: state.course.day.courses,
    loading: state.course.day.loading,
    events: state.event.day.events,
    eventLoading: state.event.day.loading,
    staff: state.staff.day.staff,
    staffLoading: state.staff.day.loading,
    isAdmin: isAdmin(state.auth.user),
    instructors: state.instructor.instructors
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDayCourses,
      getDayEvents,
      getDayStaff
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanelContainer)
