import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import styles from './CourseHeading.scss'
import classnames from 'classnames'

const CourseHeading = ({ course, onRemove, settings }) => {
  if (!course) {
    return null
  }

  const availableSpaces = course.spaces - course.orders.length

  return (
    <div
      className={classnames(
        styles.courseHeading,
        availableSpaces === 1 && styles.warning,
        availableSpaces <= 0 && styles.danger
      )}>
      <div className={styles.title}>
        <span>Edit {course.course_type.name}</span>|{' '}
        {course.time.substring(0, 5)} -{' '}
        {moment(`${course.date} ${course.time}`)
          .add(course.duration / 60, 'hours')
          .format('HH:mm')}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings
  }
}

export default connect(mapStateToProps)(CourseHeading)
