import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AvailabilityCourses from './AvailabilityCourses'
import { createBulkCourse } from 'store/course'
import { loadCourseTypes } from 'store/info'
import { getInstructors, editInstructor } from 'store/instructor'
import {
  fetchSettings,
  updateSettings,
  fetchDefaultDays,
  updateDefaultDays
} from 'store/settings'
import { updateDiaryColor } from 'store/staff'

class AvailabilityCoursesContainer extends React.Component {
  componentDidMount() {
    const {
      fetchSettings,
      settings,
      fetchDefaultDays,
      defaultDays: { days },
      schoolId
    } = this.props
    if (!settings) {
      fetchSettings()
    }
    if (!days) {
      fetchDefaultDays(schoolId)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.schoolId !== prevProps.schoolId) {
      this.props.fetchDefaultDays(this.props.schoolId)
    }
  }

  render() {
    const {
      settingsLoading,
      settings,
      defaultDays: { days }
    } = this.props
    if (settingsLoading || !settings || !days) {
      return <div>Loading...</div>
    }
    return <AvailabilityCourses {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    schoolId: state.auth.schoolId,
    saving: state.course.bulk.saving,
    error: state.course.bulk.error,
    info: state.info,
    schools: state.auth.user.suppliers,
    instructors: state.instructor.instructors,
    settingsLoading: state.settings.loading,
    settingsSaving: state.settings.saving,
    settings: state.settings.settings,
    settingsError: state.settings.error,
    defaultDays: state.settings.defaultDays
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
      editInstructor,
      updateDiaryColor,
      fetchDefaultDays,
      updateDefaultDays
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilityCoursesContainer)
