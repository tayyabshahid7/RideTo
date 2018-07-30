import React from 'react'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'

const CalendarDayCellCourse = ({ course }) => {
  const availableSpaces = course.spaces - course.orders.length
  return (
    <div className={styles.container}>
      <div className={styles.courseDescription}>
        {course.course_type.name} | {course.time}
      </div>
      <div
        className={classnames(
          styles.courseSpace,
          availableSpaces === 0 && styles.full
        )}>
        {getCourseSpaceText(course)}
      </div>
    </div>
  )
}

export default CalendarDayCellCourse
