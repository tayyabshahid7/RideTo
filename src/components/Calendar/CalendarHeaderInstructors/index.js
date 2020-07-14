import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './index.scss'

const CalendarHeaderInstructors = ({ instructors }) => {
  console.log(instructors)
  const getInitial = instructor => {
    return (
      instructor.first_name.substr(0, 1) + instructor.last_name.substr(0, 1)
    )
  }

  return (
    <div className={styles.container}>
      {instructors.map(x => {
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
    instructors: state.instructor.instructors
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarHeaderInstructors)
