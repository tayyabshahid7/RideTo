import React from 'react'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import calendarStyles from '../index.scss'
import classnames from 'classnames'
import {
  WEEK_VIEW_START_TIME,
  COLOR_RED_1,
  COLOR_YELLOW_1
} from 'common/constants'

const CalendarWeekCourse = ({ course, position, barCount }) => {
  const availableSpaces = course.spaces - course.orders.length
  let height = `${(course.duration / 3600) * 100}px` // TODO: This should be replaced by calculating height by duration
  let top = `${((course.secondsForDay - WEEK_VIEW_START_TIME) / 3600) * 100}px`
  let left = `${(100 / barCount) * position}%`
  let width = `${100 / barCount}%`
  let borderColor = 'black'
  if (availableSpaces < 1) {
    borderColor = COLOR_RED_1
  } else if (availableSpaces === 1) {
    borderColor = COLOR_YELLOW_1
  }
  let style = {
    height,
    top,
    left,
    width,
    borderColor
  }
  console.log(
    'HALA style',
    style,
    course,
    course.secondsForDay - WEEK_VIEW_START_TIME,
    WEEK_VIEW_START_TIME
  )
  return (
    <li className={styles.singleEvent} style={style}>
      <span className={styles.eventName}>
        {course.course_type.name} | {course.time}
      </span>
      <span
        className={classnames(
          styles.courseSpace,
          availableSpaces === 1 && calendarStyles.oneSpace,
          availableSpaces === 0 && calendarStyles.full
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
