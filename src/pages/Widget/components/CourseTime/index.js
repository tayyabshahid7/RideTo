import React from 'react'

import styles from './CourseTime.scss'

const CourseTime = ({ time, selected, color, onClick }) => {
  const overrides = {
    backgroundColor: color,
    color: 'white'
  }
  const displayTime = time.slice(0, 5)

  return time === selected ? (
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
