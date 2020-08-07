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
    const { createStaff } = this.props
    createStaff({ data })
  }

  render() {
    let { staff, location, match, ...rest } = this.props
    const { date, staffId } = match.params
    let backLink = '/calendar'

    return (
      <div className={styles.addCourse}>
        <DateHeading date={date ? moment(date) : null} backLink={backLink} />
        <div className={styles.wrapper}>
          <ShiftForm
            {...rest}
            date={date}
            staffId={staffId}
            onSubmit={this.onSave.bind(this)}
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
