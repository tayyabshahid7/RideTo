import React, { useEffect } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import { useMediaQuery } from 'react-responsive'
import styles from './CalendarTime.scss'

export default function CalendarTime({ courses, handleTimeSelect, calendar }) {
  const isMobile = useMediaQuery({ maxWidth: 767 })

  useEffect(() => {
    if (courses.length === 1) {
      handleTimeSelect(courses[0])
    }
  }, [courses, handleTimeSelect])

  const getCourseTime = course => {
    if (isMobile) {
      return (
        <span className={styles.courseTime}>
          <b>{moment(course.date).format('D MMMM')} - </b>
          {course.time.substring(0, 5)}
        </span>
      )
    } else {
      return course.time.substring(0, 5)
    }
  }

  const isSingleTime = courses.length === 1
  if (courses.length && !courses[0].time) {
    return null
  }

  console.log(courses)
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
                  {getCourseTime(course)}
                </button>
              ) : (
                <span
                  className={classnames(
                    styles.trainingTime,
                    styles.singleTrainingTime
                  )}>
                  {getCourseTime(course)}
                </span>
              )}
            </React.Fragment>
          )
        )
      })}
    </div>
  )
}
