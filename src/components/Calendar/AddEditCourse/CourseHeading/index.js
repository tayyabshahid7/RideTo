import React from 'react'
import moment from 'moment'
import { CALENDAR_COLOURS } from 'common/constants'

import styles from './CourseHeading.scss'

const CourseHeading = ({ course, onRemove }) => {
  if (!course) {
    return null
  }

  // const actions =
  //   course.orders.length === 0 ? (
  //     <Button onClick={onRemove} color="danger">
  //       Delete
  //     </Button>
  //   ) : null

  return (
    <div
      className={styles.courseHeading}
      style={{
        background: CALENDAR_COLOURS[course.course_type.constant]
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

export default CourseHeading
