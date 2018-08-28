import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import { createCourse, fetchPrice, resetPrice } from 'store/course'
import { loadCourseTypes } from 'store/info'

class AddCourseComponent extends Component {
  componentDidMount() {
    const { resetPrice } = this.props
    resetPrice()
  }

  componentDidUpdate(prevProps) {
    const { saving, course, history, error, location, schoolId } = this.props

    if (schoolId !== prevProps.schoolId) {
      let parsed = queryString.parse(location.search)
      let date = parsed.date
      if (date) {
        history.push(`/calendar/${date}`)
      } else {
        history.push(`/calendar`)
      }
      return
    }

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
    let { course, location, ...rest } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''
    return (
      <div className={styles.addCourse}>
        <CourseForm {...rest} date={date} onSubmit={this.onSave.bind(this)} />
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
    instructors: state.instructor.instructors,
    error: state.course.single.error,
    pricing: state.course.pricing,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCourse,
      loadCourseTypes,
      fetchPrice,
      resetPrice
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCourseComponent)
