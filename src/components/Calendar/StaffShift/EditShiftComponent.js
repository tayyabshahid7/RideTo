import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ShiftForm from './ShiftForm'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { getSingleStaff, updateStaff, deleteStaff } from 'store/staff'
import { unsetSelectedCourse } from 'store/course'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import { isAdmin } from 'services/auth'
import moment from 'moment'

class EditShiftComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteConfirmModal: false
    }
  }

  componentDidMount() {
    const { getSingleStaff, match } = this.props

    getSingleStaff({
      ...match.params
    })
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  componentDidUpdate(prevProps) {
    const { saving, staff, history } = this.props
    const { date } = prevProps.match.params

    if (prevProps.staff && !staff) {
      const { id } = prevProps.staff
      history.push(`/calendar/${date}/shifts/${id}/list`)
      return
    }

    if (prevProps.saving === true && saving === false) {
      history.push(`/calendar/${date}/shifts/${prevProps.staff.id}/list`)
    }
  }

  onSave(data) {
    const { updateStaff, match } = this.props
    updateStaff({
      staffId: match.params.staffId,
      diaryId: match.params.diaryId,
      data
    })
  }

  handleRemove() {
    const { match } = this.props
    this.props.deleteStaff({
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
    let { loading, staff, isAdmin, match } = this.props
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
    const { date } = match.params
    const backLink = `/calendar/${date}/shifts/${staff.id}/list`

    return (
      <React.Fragment>
        <div className={styles.addCourse}>
          <DateHeading date={date ? moment(date) : null} backLink={backLink} />
          <ShiftForm
            {...this.props}
            staffId={staff.instructor_id}
            onSubmit={this.onSave.bind(this)}
            onRemove={this.handleToggleDeleteModal.bind(this)}
          />
        </div>
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
)(EditShiftComponent)
