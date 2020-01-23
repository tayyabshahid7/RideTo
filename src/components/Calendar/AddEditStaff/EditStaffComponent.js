import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StaffForm from './StaffForm'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { getSingleStaff, updateStaff, deleteStaff } from 'store/staff'
import { unsetSelectedCourse } from 'store/course'
import { isAdmin } from 'services/auth'

class EditStaffComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteConfirmModal: false
    }
  }

  componentDidMount() {
    const { getSingleStaff, schoolId, match } = this.props

    getSingleStaff({
      schoolId,
      ...match.params
    })
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  componentDidUpdate(prevProps) {
    const { saving, staff, history, error, schoolId } = this.props

    if (prevProps.staff && !staff) {
      const date = prevProps.staff.date
      history.push(`/calendar/${date}`)
      return
    }

    if (schoolId !== prevProps.schoolId) {
      if (staff) {
        history.push(`/calendar/${staff.date}`)
      } else {
        history.push(`/calendar`)
      }
      return
    }

    if (prevProps.saving === true && saving === false) {
      if (staff) {
        history.push(`/calendar/${staff.date}`)
      } else {
        console.log('Error', error)
      }
    }
  }

  onSave(data) {
    const { schoolId, updateStaff, match } = this.props
    updateStaff({
      schoolId,
      staffId: match.params.staffId,
      diaryId: match.params.diaryId,
      data: { ...data, supplier: schoolId.toString() },
      fullUpdate: true
    })
  }

  handleRemove() {
    const { schoolId, match } = this.props
    this.props.deleteStaff({
      schoolId,
      staffId: parseInt(match.params.staffId, 10),
      diaryId: parseInt(match.params.diaryId, 10)
    })
  }

  handleToggleDeleteModal() {
    this.setState({
      showDeleteConfirmModal: !this.state.showDeleteConfirmModal
    })
  }

  render() {
    let { loading, staff, isAdmin } = this.props
    const { showDeleteConfirmModal } = this.state

    if (!isAdmin) {
      return <div>No access</div>
    }

    if (loading) {
      return <div>Loading...</div>
    }
    if (!staff) {
      return <div>Staff Not Found</div>
    }

    return (
      <React.Fragment>
        <StaffForm
          {...this.props}
          onSubmit={this.onSave.bind(this)}
          onRemove={this.handleToggleDeleteModal.bind(this)}
        />
        {showDeleteConfirmModal && (
          <ConfirmModal
            onClose={this.handleToggleDeleteModal.bind(this)}
            showModal={true}
            onDelete={this.handleRemove.bind(this)}
            message={`Are you sure to delete the staff?`}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schools: state.auth.user.suppliers,
    loading: state.staff.single.loading,
    staff: state.staff.single.staff,
    saving: state.staff.single.saving,
    instructors: state.instructor.instructors,
    pricing: state.staff.pricing,
    info: state.info,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleStaff,
      updateStaff,
      deleteStaff,
      unsetSelectedCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStaffComponent)