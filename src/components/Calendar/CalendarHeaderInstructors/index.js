import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './index.scss'
import UserInitial from '../UserInitial'

const CalendarHeaderInstructors = ({
  instructors,
  schoolId,
  inactiveUsers,
  isDay
}) => {
  // const allInstructors = []
  // Object.keys(instructors).forEach(schoolId =>
  //   allInstructors.push(...instructors[schoolId])
  // )
  const schoolInstructors = instructors[schoolId]
  const activeUsers = schoolInstructors.filter(
    x => !inactiveUsers.includes(x.id)
  )
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
    schoolId: state.auth.schoolId,
    instructors: state.instructor.instructors,
    inactiveUsers: state.calendar.inactiveUsers
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarHeaderInstructors)
