import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import DateHeading from 'components/Calendar/DateHeading'
import { createCourse, fetchPrice, resetPrice } from 'store/course'
import { loadCourseTypes } from 'store/info'

class AddCourseComponent extends Component {
  componentDidMount() {
    const { resetPrice } = this.props
    resetPrice()

    this.handleSetEditable = this.handleSetEditable.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { saving, course, history, error, location, schoolId } = this.props

    if (schoolId !== prevProps.schoolId) {
      let parsed = queryString.parse(location.search)
      let date = parsed.date
      console.log('UPDATE', date)
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

  handleSetEditable(isEditable, date) {
    const { course } = this.props

    if (!isEditable) {
      const link =
        course && course.date ? `/calendar/${course.date}` : `/calendar/${date}`
      this.props.history.push(link)
    }
  }

  render() {
    let { course, location, ...rest } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''

    return (
      <div className={styles.addCourse}>
        <DateHeading date={moment(date)} title={date ? null : 'Add Course'} />
        <CourseForm
          {...rest}
          isEditable={true}
          date={date}
          onSubmit={this.onSave.bind(this)}
          onSetEditable={isEditable => this.handleSetEditable(isEditable, date)}
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
