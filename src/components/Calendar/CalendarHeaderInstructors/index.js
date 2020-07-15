import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './index.scss'

const CalendarHeaderInstructors = ({ instructors, inactiveUsers }) => {
  const activeUsers = instructors.filter(x => !inactiveUsers.includes(x.id))

  const getInitial = instructor => {
    return (
      instructor.first_name.substr(0, 1) + instructor.last_name.substr(0, 1)
    )
  }

  if (!activeUsers.length) {
    return null
  }

  return (
    <div className={styles.container}>
      {activeUsers.map(x => {
        return (
          <div key={x.id} className={styles.instructor}>
            <img src="https://via.placeholder.com/150" alt="instructor" />
            <span>{getInitial(x)}</span>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    instructors: state.instructor.instructors,
    inactiveUsers: state.calendar.inactiveUsers
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarHeaderInstructors)
