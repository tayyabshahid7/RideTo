import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './index.scss'
import UserInitial from '../UserInitial'
import _ from 'lodash'

const CalendarHeaderInstructors = ({
  users,
  activeSchools,
  inactiveUsers,
  isDay
}) => {
  const currUsers = users.filter(
    x => _.intersection(x.supplier, activeSchools).length
  )
  const activeUsers = currUsers.filter(x => !inactiveUsers.includes(x.id))
  if (!inactiveUsers.includes(-1)) {
    activeUsers.push({ id: -1 })
  }

  if (!activeUsers.length) {
    return null
  }

  return (
    <div className={styles.container}>
      {activeUsers.map(x => {
        return <UserInitial key={x.id} user={x} short={!isDay} wide />
      })}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeSchools: state.auth.activeSchools,
    users: state.instructor.instructors,
    inactiveUsers: state.calendar.inactiveUsers
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarHeaderInstructors)
