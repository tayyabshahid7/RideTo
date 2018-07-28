import React from 'react'
import { Link } from 'react-router-dom'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'

const CalendarDayCellCourse = ({ course }) => {
  const availableSpaces = course.spaces - course.orders.length
  return (
    <Link to={`/calendar/${course.date}`}>
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
    </Link>
  )
}

export default CalendarDayCellCourse
