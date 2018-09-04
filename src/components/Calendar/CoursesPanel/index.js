import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getDayCourses } from 'store/course'
import { getDayEvents } from 'store/event'
import Loading from 'components/Loading'
import DateHeading from 'components/Calendar/DateHeading'
import CoursesPanel from './CoursesPanel'

class CoursesPanelContainer extends React.Component {
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
    const { getDayCourses, getDayEvents, match, schoolId } = this.props
    const {
      params: { date }
    } = match
    getDayCourses({ schoolId, date })
    getDayEvents({ schoolId, date })
  }

  render() {
    const { courses, loading, match, events } = this.props
    const {
      params: { date }
    } = match

    return (
      <Loading loading={loading}>
        <DateHeading date={moment(date, 'YYYY-MM-DD')} />
        <CoursesPanel
          date={date}
          courses={courses.sort((a, b) => a.time > b.time)}
          events={events.sort((a, b) => a.start_time > b.start_time)}
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
    eventLoading: state.event.day.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDayCourses,
      getDayEvents
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanelContainer)
