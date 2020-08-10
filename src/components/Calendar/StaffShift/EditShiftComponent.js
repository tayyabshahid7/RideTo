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

  getParams = () => {
    const { isPopup, formData, match } = this.props
    let params

    if (isPopup) {
      params = {
        staffId: formData.diary.instructor_id,
        diaryId: formData.diary.id
      }
    } else {
      params = {
        staffId: match.params.staffId,
        diaryId: match.params.diaryId
      }
    }

    return params
  }

  componentDidMount() {
    const { getSingleStaff } = this.props
    const params = this.getParams()
    getSingleStaff(params)
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  componentDidUpdate(prevProps) {
    const { saving, staff, history, isPopup, onClose } = this.props

    if (prevProps.staff && !staff) {
      if (isPopup) {
        onClose && onClose()
        return
      }

      const { date } = prevProps.match.params
      history.push(`/calendar/${date}`)
      return
    }

    if (prevProps.saving === true && saving === false) {
      if (isPopup) {
        onClose && onClose()
        return
      }

      const { date } = prevProps.match.params
      history.push(`/calendar/${date}`)
    }
  }

  onSave(data) {
    const { updateStaff } = this.props
    const params = this.getParams()
    updateStaff({
      ...params,
      data
    })
  }

  handleRemove() {
    const params = this.getParams()
    this.props.deleteStaff(params)
  }

  handleToggleDeleteModal() {
    this.setState({
      showDeleteConfirmModal: !this.state.showDeleteConfirmModal
    })
  }

  render() {
    let {
      loading,
      staff,
      isAdmin,
      match,
      isPopup,
      onClose,
      formData
    } = this.props
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

    const date = isPopup ? formData.date : match.params.date
    let backLink = isPopup ? null : `/calendar/${date}`

    return (
      <React.Fragment>
        <div className={styles.addCourse}>
          <DateHeading
            date={date ? moment(date) : null}
            backLink={backLink}
            onBack={isPopup && onClose}
          />
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
