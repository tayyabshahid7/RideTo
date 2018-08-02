import React from 'react'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import { WEEK_VIEW_START_TIME } from 'common/constants'

const CalendarWeekCourse = ({ course, position, barCount }) => {
  const availableSpaces = course.spaces - course.orders.length
  let height = `${(course.duration / 3600) * 100}px` // TODO: This should be replaced by calculating height by duration
  let top = `${((course.secondsForDay - WEEK_VIEW_START_TIME) / 3600) * 100}px`
  let left = `${(100 / barCount) * position}%`
  let width = `${100 / barCount}%`
  // let borderColor = 'black'
  let style = {
    height,
    top,
    left,
    width
  }
  return (
    <li
      className={classnames(
        styles.singleEvent,
        availableSpaces === 1 && 'border-warning',
        availableSpaces === 0 && 'border-danger'
      )}
      style={style}>
      <span className={styles.eventName}>
        {course.course_type.name} | {course.time}
      </span>
      <span
        className={classnames(
          styles.courseSpace,
          availableSpaces === 1 && 'text-warning',
          availableSpaces === 0 && 'text-danger'
        )}>
        {getCourseSpaceText(course)}
      </span>
      <div>
        {course.orders.map(order => (
          <div className={styles.order}>
            <span>#{order.friendly_id}</span>
            <span>{order.bike_hire}</span>
            <span>{order.user_name}</span>
          </div>
        ))}
      </div>
    </li>
  )
}

export default CalendarWeekCourse
