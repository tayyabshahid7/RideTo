import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AvailabilityCourses from './AvailabilityCourses'
import { createBulkCourse } from 'store/course'
import { loadCourseTypes } from 'store/info'
import { getInstructors } from 'store/instructor'

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    saving: state.course.bulk.saving,
    error: state.course.bulk.error,
    info: state.info,
    schools: state.auth.user.suppliers,
    instructors: state.instructor.instructors
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createBulkCourse,
      loadCourseTypes,
      getInstructors
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilityCourses)
