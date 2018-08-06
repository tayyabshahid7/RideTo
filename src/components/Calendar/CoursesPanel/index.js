import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDayCourses } from 'actions/course'
import CoursesPanel from './CoursesPanel'
// import { getCoursesOnDay } from 'services/course'

class CoursesPanelContainer extends React.Component {
  componentDidMount() {
    this.loadCourses()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      this.loadCourses()
    }
  }

  loadCourses() {
    const { getDayCourses, match, schoolId } = this.props
    const {
      params: { date }
    } = match
    // console.log('Courses Panel componentDidMount', date)
    getDayCourses({ schoolId, date })
  }

  render() {
    const { courses, loading, match } = this.props
    const {
      params: { date }
    } = match
    if (loading) {
      return <div>Loading...</div>
    }
    return <CoursesPanel date={date} courses={courses} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    courses: state.course.day.courses,
    loading: state.course.day.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDayCourses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanelContainer)
