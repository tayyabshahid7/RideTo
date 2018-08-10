import React from 'react'

import styles from './CourseTime.scss'

const CourseTime = ({ time, selected, color, onClick }) => {
  const overrides = {
    backgroundColor: color,
    color: 'white'
  }

  return time === selected ? (
    <div className={styles.courseTime} style={overrides}>
      {time}
    </div>
  ) : (
    <div className={styles.courseTime} onClick={onClick}>
      {time}
    </div>
  )
}

export default CourseTime
