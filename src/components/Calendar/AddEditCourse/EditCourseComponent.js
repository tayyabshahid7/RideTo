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
import { actions as notifyActions } from 'store/notification'

class EditCourseComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDeleteCourseConfirmModal: false
    }
  }

  componentDidMount() {
    const { getSingleCourse, match } = this.props
    getSingleCourse({ courseId: match.params.courseId })
  }

  componentDidUpdate(prevProps) {
    const {
      saving,
      error,
      course,
      history,
      match,
      getSingleCourse
    } = this.props

    if (prevProps.course && !course) {
      const date = prevProps.course.date
      history.push(`/calendar/${date}`)
      return
    }

    if (!isEqual(match.params, prevProps.match.params)) {
      getSingleCourse({ courseId: match.params.courseId })
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
    const { course, deleteCourse } = this.props
    this.setState({ showDeleteCourseConfirmModal: false })
    deleteCourse({ courseId: course.id })
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
    const {
      loading,
      course,
      isAdmin,
      testCentres,
      defaultTestCentres
    } = this.props
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

    const filteredCentres = testCentres.filter(x =>
      defaultTestCentres.includes(x.id)
    )

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
            testCentres={filteredCentres}
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
    schools: state.auth.user.suppliers,
    loading: state.course.single.loading,
    course: state.course.single.course,
    saving: state.course.single.saving,
    instructors: state.instructor.instructors,
    testCentres: state.testCentre.testCentres,
    defaultTestCentres: state.testCentre.defaultTestCentres,
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
      unsetSelectedCourse,
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCourseComponent)
