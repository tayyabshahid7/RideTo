import React from 'react'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './index.scss'

const UserInitial = ({ user, short }) => {
  let initial

  if (short) {
    if (user.id === -1) {
      initial = 'Unassigned'
    } else {
      initial = user.first_name + ' ' + user.last_name
    }
  } else {
    if (user.id === -1) {
      initial = 'N/A'
    } else {
      initial = user.first_name.substr(0, 1) + user.last_name.substr(0, 1)
    }
  }

  return (
    <div
      key={user.id}
      className={classnames(styles.user, short && styles.short)}>
      <img src="https://via.placeholder.com/150" alt="user" />
      <span>{initial}</span>
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
)(UserInitial)
