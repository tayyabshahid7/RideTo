import React from 'react'
import moment from 'moment'
import { mapLabelColoursWithContant } from 'services/settings'
import { connect } from 'react-redux'
import styles from './CourseHeading.scss'

const CourseHeading = ({ course, onRemove, settings }) => {
  if (!course) {
    return null
  }

  return (
    <div
      className={styles.courseHeading}
      style={{
        background: mapLabelColoursWithContant(
          settings,
          course.course_type.constant
        )
      }}>
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
