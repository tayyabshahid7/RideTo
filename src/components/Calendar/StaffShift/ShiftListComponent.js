import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isAdmin } from 'services/auth'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import ShiftPanelItem from './ShiftPanelItem'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { getDayStaff } from 'store/staff'

class ShiftListComponent extends Component {
  componentDidMount() {
    const { match, schools, getDayStaff } = this.props
    const { date } = match.params
    const schoolIds = schools.map(x => x.id)
    getDayStaff({ schoolIds, date })
  }

  componentDidUpdate(prevProps) {}

  moveBackToPage() {
    const { history } = this.props
    history.push(`/calendar`)
  }

  render() {
    let { isAdmin, staff, match } = this.props
    const { date, staffId } = match.params
    let backLink = '/calendar'
    console.log(staff)

    if (!isAdmin) {
      return <div>No access</div>
    }

    return (
      <div className={styles.addCourse}>
        <DateHeading date={date ? moment(date) : null} backLink={backLink} />
        <div className={styles.wrapper}>
          <div className={styles.panel}>
            <div className={styles.title}>Shifts</div>
            <div>
              {staff.map(item => (
                <ShiftPanelItem
                  key={item.id}
                  date={date}
                  event={item}
                  eventId={item.id}
                />
              ))}
            </div>
            <Link
              className={styles.addButton}
              to={`/calendar/${date}/shifts/${staffId}/add`}>
              Add shift
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    info: state.info,
    instructors: state.instructor.instructors,
    isAdmin: isAdmin(state.auth.user),
    staff: state.staff.day.staff
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDayStaff
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShiftListComponent)
