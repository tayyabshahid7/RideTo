import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getDayCourses } from 'store/course'
import { getDayEvents } from 'store/event'
import { getDayStaff } from 'store/staff'
import LoadingMask from 'components/LoadingMask'
import DateHeading from 'components/Calendar/DateHeading'
import CoursesPanel from './CoursesPanel'
import { isAdmin } from 'services/auth'

class CoursesPanelContainer extends React.Component {
  componentDidMount() {
    // if (this.props.courseDate !== this.props.match.params.date) {
    this.loadData()
    // }
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
      loadCourses,
      history
    } = this.props
    const {
      params: { date, courseId, eventId, staffId }
    } = match

    let title = ''
    let subtitle = ''

    return (
      <div>
        <DateHeading
          title={title}
          subtitle={subtitle}
          noClose={!!subtitle}
          date={moment(date, 'YYYY-MM-DD')}
          backLink={`/calendar`}
        />
        <CoursesPanel
          courseId={courseId}
          eventId={eventId}
          staffId={staffId}
          date={date}
          courses={courses.sort((a, b) => a.time > b.time)}
          events={events}
          staff={staff}
          isAdmin={isAdmin}
          loadCourses={loadCourses}
          schools={schools}
          instructors={instructors}
          history={history}
        />
        <LoadingMask loading={loading} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    courses: state.course.day.courses,
    courseDate: state.course.day.date,
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
