import React, { Component } from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import DateHeading from 'components/Calendar/DateHeading'
import { createCourse, fetchPrice, resetPrice } from 'store/course'
import { isAdmin } from 'services/auth'

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
    const { createCourse } = this.props
    createCourse({
      schoolId: data.supplier,
      data
    })
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
    let { course, location, isAdmin, ...rest } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''
    let backLink = date === '' ? '/calendar' : `/calendar/${date}`

    if (!isAdmin) {
      return <div>No access</div>
    }

    return (
      <div className={styles.addCourse}>
        <DateHeading date={date ? moment(date) : null} backLink={backLink} />

        <div className={styles.wrapper}>
          <h4 className={styles.addTitle}>Add Course</h4>
          <CourseForm
            {...rest}
            isEditable={true}
            date={date}
            onSubmit={this.onSave.bind(this)}
            onSetEditable={isEditable =>
              this.handleSetEditable(isEditable, date)
            }
          />
        </div>
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
    testCentres: state.testCentre.testCentres,
    error: state.course.single.error,
    pricing: state.course.pricing,
    info: state.info,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCourse,
      fetchPrice,
      resetPrice
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCourseComponent)
