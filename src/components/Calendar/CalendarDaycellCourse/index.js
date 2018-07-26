import React from 'react'
import s from '../../../utils/helper'
import styles from './index.scss'
import classnames from 'classnames'

const CalendarDayCellCourse = ({ course }) => (
  <div className={styles.container}>
    <div className={styles.courseDescription}>
      {course.type} | {course.time}
    </div>
    <div
      className={classnames(
        styles.courseSpace,
        course.available_spaces === 0 ? styles.full : ''
      )}>
      {course.available_spaces === 0
        ? 'FULL'
        : `${course.available_spaces} space${s(
            course.available_spaces
          )} available`}
    </div>
  </div>
)

export default CalendarDayCellCourse
