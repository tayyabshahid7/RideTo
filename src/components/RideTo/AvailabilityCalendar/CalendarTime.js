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
          let spacesLeft = 0
          if (typeof course.spaces_available !== 'undefined') {
            spacesLeft = parseInt(course.spaces_available)
          } else {
            const training_count =
              course.training_count || course.auto_count + course.manual_count
            spacesLeft = course.spaces - training_count
          }

          return (
            !!spacesLeft && (
              <React.Fragment key={course.id}>
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
                  <span
                    className={classnames(
                      styles.trainingTime,
                      styles.singleTrainingTime
                    )}>
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
