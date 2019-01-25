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
import { loadCourseTypes } from 'store/info'

class EditCourseComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDeleteCourseConfirmModal: false,
      isEditable: false
    }
  }

  componentDidMount() {
    const { getSingleCourse, schoolId, match } = this.props
    getSingleCourse({ schoolId, courseId: match.params.courseId })
  }

  componentDidUpdate(prevProps) {
    const { course, history, schoolId, match, getSingleCourse } = this.props

    if (schoolId !== prevProps.schoolId) {
      if (course) {
        history.push(`/calendar/${course.date}`)
      } else {
        history.push(`/calendar`)
      }
      return
    }
    if (prevProps.match.params.courseId !== match.params.courseId) {
      getSingleCourse({ schoolId, courseId: match.params.courseId })
    }
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  onSave(data) {
    const { schoolId, updateCourse, match } = this.props
    updateCourse({
      schoolId,
      courseId: match.params.courseId,
      data: { ...data, supplier: schoolId.toString() },
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
  }

  closeDeleteCourseConfirmModal() {
    this.setState({ showDeleteCourseConfirmModal: false })
  }

  render() {
    const { loading, course } = this.props
    const { isEditable, showDeleteCourseConfirmModal } = this.state

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
        <CourseHeading
          course={course}
          onRemove={this.handleRemoveCourseClick.bind(this)}
        />

        <CourseForm
          {...this.props}
          isEditable={isEditable}
          onSetEditable={isEditable => this.setState({ isEditable })}
          onSubmit={this.onSave.bind(this)}
        />

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
    pricing: state.course.pricing,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      updateCourse,
      loadCourseTypes,
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
