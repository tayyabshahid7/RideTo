import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AvailabilityCourses from './AvailabilityCourses'
import { createBulkCourse } from 'store/course'
import { loadCourseTypes } from 'store/info'
import { getInstructors, editInstructor } from 'store/instructor'
import { fetchSettings, updateSettings } from 'store/settings'

class AvailabilityCoursesContainer extends React.Component {
  componentDidMount() {
    const { fetchSettings, settings } = this.props
    if (!settings) {
      fetchSettings()
    }
  }

  render() {
    const { settingsLoading, settings } = this.props
    if (settingsLoading || !settings) {
      return <div>Loading...</div>
    }
    return <AvailabilityCourses {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    saving: state.course.bulk.saving,
    error: state.course.bulk.error,
    info: state.info,
    schools: state.auth.user.suppliers,
    instructors: state.instructor.instructors,
    settingsLoading: state.settings.loading,
    settingsSaving: state.settings.saving,
    settings: state.settings.settings,
    settingsError: state.settings.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createBulkCourse,
      loadCourseTypes,
      getInstructors,
      fetchSettings,
      updateSettings,
      editInstructor
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilityCoursesContainer)
