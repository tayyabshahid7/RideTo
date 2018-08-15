import React from 'react'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import { WEEK_VIEW_START_TIME } from 'common/constants'

const CalendarWeekCourse = ({ course, position, barCount, history }) => {
  const availableSpaces = course.spaces - course.orders.length
  let height = `${(course.duration / 60) * 100}px` // Duration is in mins
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
      style={style}
      onClick={() =>
        history.push(`/calendar/${course.date}/courses/${course.id}`)
      }>
      <span className={styles.eventName}>
        {course.course_type.name} | {course.time.substring(0, 5)}
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
          <div className={styles.order} key={order.friendly_id}>
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
