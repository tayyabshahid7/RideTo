import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isAdmin } from 'services/auth'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import ShiftPanelItem from './ShiftPanelItem'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'

import { getDayStaff } from 'store/staff'

class ShiftListComponent extends Component {
  componentDidMount() {
    const { match, schools, getDayStaff } = this.props
    const { date } = match.params
    const schoolIds = schools.map(x => x.id)
    getDayStaff({ schoolIds, date })
  }

  componentDidUpdate(prevProps) {
    const { schools, getDayStaff, match } = this.props
    const { date } = match.params

    const schoolIds = schools.map(x => x.id)
    if (prevProps.match.params.date !== this.props.match.params.date) {
      getDayStaff({ schoolIds, date })
    }
  }

  moveBackToPage() {
    const { history } = this.props
    history.push(`/calendar`)
  }

  render() {
    let { isAdmin, staff, match, staffLoading } = this.props
    const { date, staffId } = match.params
    let backLink = '/calendar'
    console.log(staff)

    staff = staff.filter(x => x.instructor === parseInt(staffId))

    if (!isAdmin) {
      return <div>No access</div>
    }

    return (
      <Loading loading={staffLoading}>
        <div className={styles.addCourse}>
          <DateHeading date={date ? moment(date) : null} backLink={backLink} />
          <div className={styles.wrapper}>
            <div className={styles.panel}>
              <div className={styles.title}>Shifts</div>
              <div>
                {staff.map(item => (
                  <ShiftPanelItem key={item.id} date={date} staff={item} />
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
      </Loading>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    staffLoading: state.staff.day.loading,
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
