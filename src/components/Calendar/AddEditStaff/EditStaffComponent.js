import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import StaffForm from './StaffForm'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { getSingleStaff, updateStaff, deleteStaff } from 'store/staff'
import { unsetSelectedCourse } from 'store/course'
import { DATE_FORMAT } from '../../../common/constants'

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
      staffId: match.params.staffId,
      date: match.params.date
    })
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  componentDidUpdate(prevProps) {
    const { saving, staff, history, error, schoolId } = this.props

    if (prevProps.staff && !staff) {
      const date = moment(new Date(prevProps.staff.start_time)).format(
        DATE_FORMAT
      )

      history.push(`/calendar/${date}`)
      return
    }

    if (schoolId !== prevProps.schoolId) {
      if (staff) {
        history.push(
          `/calendar/${moment(new Date(staff.start_time)).format(DATE_FORMAT)}`
        )
      } else {
        history.push(`/calendar`)
      }
      return
    }

    if (prevProps.saving === true && saving === false) {
      if (staff) {
        history.push(
          `/calendar/${moment(new Date(staff.start_time)).format(DATE_FORMAT)}`
        )
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
      data: { ...data, supplier: schoolId.toString() },
      fullUpdate: true
    })
  }

  handleRemove() {
    const { schoolId, match } = this.props
    this.props.deleteStaff({
      schoolId,
      staffId: parseInt(match.params.staffId, 10)
    })
  }

  handleToggleDeleteModal() {
    this.setState({
      showDeleteConfirmModal: !this.state.showDeleteConfirmModal
    })
  }

  render() {
    let { loading, staff } = this.props
    const { showDeleteConfirmModal } = this.state

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
    info: state.info
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
