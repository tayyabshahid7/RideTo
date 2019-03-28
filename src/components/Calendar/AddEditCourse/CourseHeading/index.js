import React from 'react'
import { Button } from 'components/ConnectForm'

import styles from './CourseHeading.scss'

const CourseHeading = ({ course, onRemove }) => {
  if (!course) {
    return null
  }

  const actions =
    course.orders.length === 0 ? (
      <Button onClick={onRemove} color="danger">
        Delete
      </Button>
    ) : null

  return (
    <div className={styles.courseHeading}>
      <div className={styles.title}>Edit Course</div>
      <div className={styles.actions}>{actions}</div>
    </div>
  )
}

export default CourseHeading
