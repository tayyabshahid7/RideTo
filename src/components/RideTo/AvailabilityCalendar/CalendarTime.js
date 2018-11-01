import React from 'react'
import classnames from 'classnames'
import styles from './CalendarTime.scss'

const CalendarTime = ({ calendar, courses, handleTimeSelect }) => {
  return (
    <div className={styles.container}>
      {courses.map(
        (course, index) =>
          course.spaces > course.order_count && (
            <button
              key={index}
              className={classnames(
                styles.btn,
                calendar.selectedCourse &&
                  calendar.selectedCourse.id === course.id &&
                  styles.activeBtn
              )}
              onClick={() => handleTimeSelect(course)}>
              {course.time.substring(0, 5)}
            </button>
          )
      )}
    </div>
  )
}

export default CalendarTime
