import React from 'react'
import { Button } from 'reactstrap'

import { getShortCourseType } from 'services/course'
import styles from './CourseHeading.scss'

const CourseHeading = ({ course, onRemove }) => {
  if (!course) {
    return null
  }
  const name = getShortCourseType(course.course_type)
  const actions =
    course.orders.length === 0 ? (
      <Button onClick={onRemove} color="danger">
        Remove Course
      </Button>
    ) : null

  return (
    <div className={styles.courseHeading}>
      <div className={styles.title}>
        {course.time.substring(0, 5)} | {name}
      </div>
      <div className={styles.actions}>{actions}</div>
    </div>
  )
}

export default CourseHeading
