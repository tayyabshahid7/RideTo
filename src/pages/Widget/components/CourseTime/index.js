import React from 'react'
import moment from 'moment'

import styles from './CourseTime.scss'

const CourseTime = ({ time, selected, courseId, color, onClick }) => {
  const overrides = {
    backgroundColor: color,
    borderColor: color,
    color: 'white'
  }
  const displayTime = moment(time, 'h:mm:ss').format('h:mm a')

  return courseId === selected ? (
    <div className={styles.courseTime} style={overrides}>
      {displayTime}
    </div>
  ) : (
    <div className={styles.courseTime} onClick={onClick}>
      {displayTime}
    </div>
  )
}

export default CourseTime
