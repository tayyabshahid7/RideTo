import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import ShiftForm from './ShiftForm'
import { createStaff } from 'store/staff'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import moment from 'moment'

class AddShiftComponent extends Component {
  componentDidUpdate(prevProps) {
    const { saving, staff, error } = this.props

    if (prevProps.saving === true && saving === false) {
      if (staff) {
        this.moveBackToPage()
      } else {
        console.log('Error', error)
      }
    }
  }

  moveBackToPage = () => {
    const { history, location, isPopup, onClose } = this.props
    if (isPopup) {
      onClose && onClose()
      return
    }

    let parsed = queryString.parse(location.search)
    let date = parsed.date
    if (date) {
      history.push(`/calendar/${date}`)
    } else {
      history.push(`/calendar`)
    }
  }

  onSave = data => {
    const { createStaff } = this.props
    createStaff({ data })
  }

  render() {
    let { staff, location, match, isPopup, formData, ...rest } = this.props
    let date, staffId, eventType
    if (isPopup) {
      date = formData.date
      staffId = formData.user.id
      eventType = formData.eventType
    } else {
      date = match.params.date
      staffId = match.params.staffId
      eventType = match.params.eventType
    }

    let backLink = isPopup ? '' : '/calendar'

    return (
      <div className={styles.addCourse}>
        <DateHeading
          date={date ? moment(date) : null}
          backLink={backLink}
          onBack={isPopup && this.moveBackToPage}
        />
        <div className={styles.wrapper}>
          <ShiftForm
            {...rest}
            date={date}
            staffId={staffId}
            eventType={eventType}
            onSubmit={this.onSave}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    saving: state.staff.single.saving,
    staff: state.staff.single.staff,
    error: state.staff.single.error,
    info: state.info,
    instructors: state.instructor.instructors
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
)(AddShiftComponent)
