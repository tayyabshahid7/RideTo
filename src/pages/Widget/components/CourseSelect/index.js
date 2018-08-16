import React from 'react'
import moment from 'moment'

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
  const finish = moment(selected.time, 'h:mm:ss')
    .add(selected.duration, 'minutes')
    .format('h:mm a')

  const spacesLeft = selected.spaces - selected.order_count

  return (
    <div className={styles.courseSelect}>
      <h4>{date.format('dddd Do MMMM')}</h4>

      <div>{spacesLeft} Spaces Left</div>

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
      <div className={styles.times}>
        <span className={styles.label}>Finish Time:</span>
        <span className={styles.finishTime}>{finish}</span>
      </div>
    </div>
  )
}

export default CourseSelect
