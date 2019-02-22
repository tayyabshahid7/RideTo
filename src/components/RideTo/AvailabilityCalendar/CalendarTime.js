import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './CalendarTime.scss'

class CalendarTime extends Component {
  componentDidUpdate(prevProps) {
    const { courses, handleTimeSelect } = this.props

    if (courses.length !== prevProps.courses.length && courses.length === 1) {
      handleTimeSelect(courses[0])
    }
  }

  render() {
    const { calendar, courses, handleTimeSelect } = this.props
    const isSingleTime = courses.length === 1

    return (
      <div className={classnames(!isSingleTime && styles.container)}>
        {courses.map((course, index) => {
          const training_count =
            course.training_count || course.auto_count + course.manual_count

          return (
            course.spaces > training_count && (
              <React.Fragment>
                {!isSingleTime ? (
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
                ) : (
                  <span className={styles.trainingTime}>
                    {course.time.substring(0, 5)}
                  </span>
                )}
              </React.Fragment>
            )
          )
        })}
      </div>
    )
  }
}

export default CalendarTime
