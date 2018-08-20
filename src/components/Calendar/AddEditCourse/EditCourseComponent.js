import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import { getSingleCourse, updateCourse } from 'store/course'
import { loadCourseTypes } from 'store/info'

class EditCourseComponent extends Component {
  componentDidMount() {
    const { getSingleCourse, schoolId, match } = this.props
    getSingleCourse({ schoolId, courseId: match.params.courseId })
  }

  componentDidUpdate(prevProps) {
    const { saving, course, history, error } = this.props
    if (prevProps.saving === true && saving === false) {
      if (course) {
        history.push(`/calendar/${course.date}`)
      } else {
        console.log('Error', error)
      }
    }
  }

  onSave(data) {
    const { schoolId, updateCourse, match } = this.props
    updateCourse({ schoolId, courseId: match.params.courseId, data })
  }

  render() {
    let {
      schools,
      saving,
      info,
      loadCourseTypes,
      history,
      loading,
      course,
      schoolId,
      instructors
    } = this.props

    if (loading) {
      return <div>Loading...</div>
    }
    if (!course) {
      return <div>Course Not Found</div>
    }

    return (
      <div className={styles.addCourse}>
        <CourseForm
          schools={schools}
          course={course}
          saving={saving}
          info={info}
          onSubmit={this.onSave.bind(this)}
          loadCourseTypes={loadCourseTypes}
          history={history}
          schoolId={schoolId}
          instructors={instructors}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schools: state.auth.user.suppliers,
    loading: state.course.single.loading,
    course: state.course.single.course,
    saving: state.course.single.saving,
    instructors: state.instructor.instructors,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      updateCourse,
      loadCourseTypes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCourseComponent)
