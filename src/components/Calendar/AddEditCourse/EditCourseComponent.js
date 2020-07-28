import React, { Component } from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import {
  createSchoolOrder,
  updateSchoolOrder,
  getSingleCourse,
  updateCourse,
  fetchPrice,
  unsetSelectedCourse,
  deleteCourse
} from 'store/course'
import CourseHeading from 'components/Calendar/AddEditCourse/CourseHeading'
import DateHeading from 'components/Calendar/DateHeading'
import ConfirmModal from 'components/Modals/ConfirmModal'
import isEqual from 'lodash/isEqual'
import { isAdmin } from 'services/auth'

class EditCourseComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDeleteCourseConfirmModal: false
    }
  }

  componentDidMount() {
    const { getSingleCourse, schoolId, match } = this.props
    getSingleCourse({ schoolId, courseId: match.params.courseId })
  }

  componentDidUpdate(prevProps) {
    const {
      saving,
      error,
      course,
      history,
      schoolId,
      match,
      getSingleCourse
    } = this.props

    if (!isEqual(match.params, prevProps.match.params)) {
      getSingleCourse({ schoolId, courseId: match.params.courseId })
      return
    }

    if (schoolId !== prevProps.schoolId) {
      if (course) {
        history.push(`/calendar/${course.date}`)
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

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  onSave(data) {
    const { updateCourse, match } = this.props
    updateCourse({
      schoolId: data.supplier,
      courseId: match.params.courseId,
      data,
      fullUpdate: true
    })
    this.setState({ isEditable: false })
  }

  handleRemoveCourseClick() {
    this.setState({ showDeleteCourseConfirmModal: true })
  }

  handleDeleteCourse() {
    const { course, schoolId, deleteCourse } = this.props
    this.setState({ showDeleteCourseConfirmModal: false })
    deleteCourse({ schoolId, courseId: course.id })
    const link = course && `/calendar/${course.date}`
    this.props.history.push(link)
  }

  closeDeleteCourseConfirmModal() {
    this.setState({ showDeleteCourseConfirmModal: false })
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
    const { loading, course, isAdmin } = this.props
    const { showDeleteCourseConfirmModal } = this.state

    if (!isAdmin) {
      return <div>No access</div>
    }

    if (loading) {
      return <div>Loading...</div>
    }
    if (!course) {
      return <div>Course Not Found</div>
    }

    return (
      <div className={styles.addCourse}>
        <DateHeading
          date={moment(course.date)}
          backLink={`/calendar/${course.date}`}
        />

        <div className={styles.wrapper}>
          <CourseHeading
            course={course}
            onRemove={this.handleRemoveCourseClick.bind(this)}
          />

          <CourseForm
            orderCount={course.orders ? course.orders.length : 0}
            {...this.props}
            isEditable={true}
            onSetEditable={isEditable =>
              this.handleSetEditable(isEditable, course.date)
            }
            onSubmit={this.onSave.bind(this)}
            onRemove={this.handleRemoveCourseClick.bind(this)}
          />
        </div>

        {showDeleteCourseConfirmModal && (
          <ConfirmModal
            onClose={this.closeDeleteCourseConfirmModal.bind(this)}
            showModal={true}
            onDelete={this.handleDeleteCourse.bind(this)}
            message={`Are you sure to delete the course?`}
          />
        )}
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
    testCentres: state.testCentre.testCentres,
    pricing: state.course.pricing,
    info: state.info,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      updateCourse,
      createSchoolOrder,
      updateSchoolOrder,
      fetchPrice,
      deleteCourse,
      unsetSelectedCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCourseComponent)
