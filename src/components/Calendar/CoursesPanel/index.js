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
    if (
      this.props.schoolId !== prevProps.schoolId ||
      prevProps.match.params.date !== this.props.match.params.date
    ) {
      this.loadData()
    }
  }

  loadData() {
    const {
      getDayCourses,
      getDayEvents,
      match,
      schoolId,
      getDayStaff
    } = this.props
    const {
      params: { date }
    } = match
    getDayCourses({ schoolId, date })
    getDayEvents({ schoolId, date })
    getDayStaff({ schoolId, date })
  }

  render() {
    const { courses, loading, match, events, staff, isAdmin } = this.props
    const {
      params: { date, courseId, eventId }
    } = match
    const { addingOrder } = this.state

    return (
      <Loading loading={loading}>
        <DateHeading date={moment(date, 'YYYY-MM-DD')} backLink={`/calendar`} />
        <CoursesPanel
          courseId={courseId}
          eventId={eventId}
          addingOrder={addingOrder}
          date={date}
          courses={courses.sort((a, b) => a.time > b.time)}
          events={events.sort((a, b) => a.start_time > b.start_time)}
          updateAdding={this.updateAdding}
          staff={staff}
          isAdmin={isAdmin}
        />
      </Loading>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    courses: state.course.day.courses,
    loading: state.course.day.loading,
    events: state.event.day.events,
    eventLoading: state.event.day.loading,
    staff: state.staff.day.staff,
    staffLoading: state.staff.day.loading,
    isAdmin: isAdmin(state.auth.user)
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
