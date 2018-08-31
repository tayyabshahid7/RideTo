import React from 'react'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import { getStarTimeForEventForDate } from 'utils/helper'

const CalendarDayCellCourse = ({ course, event, date }) => {
  if (event) {
    return (
      <div className={styles.container}>
        <div className={styles.courseDescription}>
          {event.name} | {getStarTimeForEventForDate(event, date)}
        </div>
      </div>
    )
  }
  const availableSpaces = course.spaces - course.orders.length
  return (
    <div className={styles.container}>
      <div className={styles.courseDescription}>
        {course.course_type.name} | {course.time.substring(0, 5)}
      </div>
      <div
        className={classnames(
          styles.courseSpace,
          availableSpaces === 1 && 'text-warning',
          availableSpaces === 0 && 'text-danger'
        )}>
        {getCourseSpaceText(course)}
      </div>
    </div>
  )
}

export default CalendarDayCellCourse
