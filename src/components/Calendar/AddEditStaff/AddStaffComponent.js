import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { createStaff } from 'store/staff'
import StaffForm from './StaffForm'
import { isAdmin } from 'services/auth'

class AddStaffComponent extends Component {
  componentDidUpdate(prevProps) {
    const { saving, staff, error, schoolId } = this.props

    if (schoolId !== prevProps.schoolId) {
      this.moveBackToPage()
      return
    }

    if (prevProps.saving === true && saving === false) {
      if (staff) {
        this.moveBackToPage()
      } else {
        console.log('Error', error)
      }
    }
  }

  moveBackToPage() {
    const { history, location } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date
    if (date) {
      history.push(`/calendar/${date}`)
    } else {
      history.push(`/calendar`)
    }
  }

  onSave(data) {
    const { schoolId, createStaff } = this.props
    createStaff({ schoolId, data: { ...data, supplier: schoolId.toString() } })
  }

  render() {
    let { staff, location, isAdmin, ...rest } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''

    if (!isAdmin) {
      return <div>No access</div>
    }

    return <StaffForm {...rest} date={date} onSubmit={this.onSave.bind(this)} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schools: state.auth.user.suppliers,
    saving: state.staff.single.saving,
    staff: state.staff.single.staff,
    error: state.staff.single.error,
    pricing: state.staff.pricing,
    info: state.info,
    instructors: state.instructor.instructors,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createStaff
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddStaffComponent)
