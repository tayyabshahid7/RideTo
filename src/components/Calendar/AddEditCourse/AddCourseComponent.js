import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import { createCourse } from 'store/course'
import { loadCourseTypes } from 'store/info'

class AddCourseComponent extends Component {
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
    const { schoolId, createCourse } = this.props
    createCourse({ schoolId, data: { ...data, supplier: schoolId.toString() } })
  }

  render() {
    let {
      schools,
      saving,
      info,
      loadCourseTypes,
      location,
      history,
      schoolId
    } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''
    return (
      <div className={styles.addCourse}>
        <CourseForm
          schools={schools}
          saving={saving}
          info={info}
          date={date}
          onSubmit={this.onSave.bind(this)}
          loadCourseTypes={loadCourseTypes}
          history={history}
          schoolId={schoolId}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schools: state.auth.user.suppliers,
    saving: state.course.single.saving,
    course: state.course.single.course,
    error: state.course.single.error,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCourse,
      loadCourseTypes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCourseComponent)
