import React from 'react'

import CourseTime from 'pages/Widget/components/CourseTime'

import styles from './CourseSelect.scss'

const CourseSelect = ({
  date,
  courses,
  selectedCourse,
  onChangeCourse,
  color
}) => {
  const selected = selectedCourse || {}

  return (
    <div className={styles.courseSelect}>
      <div className={styles.times}>
        <span className={styles.label}>Start Time:</span>
        {courses.map(course => (
          <CourseTime
            key={course.id}
            time={course.time}
            selected={selected.time}
            color={color}
            onClick={() => onChangeCourse(course)}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseSelect
