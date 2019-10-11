import React from 'react'
import { getCourseSpaceText } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import { WEEK_VIEW_START_TIME, WORK_HOURS } from 'common/constants'
import { getShortCourseType } from 'services/course'
import moment from 'moment'

const CalendarWeekCourse = ({
  course,
  position,
  barCount,
  history,
  calendar
}) => {
  let height = (course.duration / 60) * 100 // Duration is in mins
  let top = ((course.secondsForDay - WEEK_VIEW_START_TIME) / 3600) * 100
  if (top < 0) {
    top = 0
  }
  if (top + height > WORK_HOURS * 100) {
    height = WORK_HOURS * 100 - top
    if (height < 0) {
      return null
    }
  }
  let left = `${(100 / barCount) * position}%`
  let width = `${100 / barCount}%`
  // let borderColor = 'black'
  let style = {
    height: `${height}px`,
    top: `${top}px`,
    left,
    width
  }

  if (!course.course_type) {
    // Then it is event
    return (
      <li
        className={classnames(styles.singleEvent, styles.singleEventEvent)}
        style={style}
        onClick={() => history.push(`/calendar/events/${course.id}/edit`)}>
        <div
          className={classnames(
            styles.content,
            calendar.selectedCourse === `event-${course.id}` && styles.primary
          )}>
          <span className={styles.eventName}>{course.name}</span>
          {course.start_time && course.end_time && (
            <span className={styles.eventTime}>
              {moment(course.start_time).format('HH:mm')} -{' '}
              {moment(course.end_time).format('HH:mm')}
            </span>
          )}
        </div>
      </li>
    )
  }

  const availableSpaces = course.spaces - course.orders.length
  return (
    <li
      className={styles.singleEvent}
      style={style}
      onClick={() =>
        history.push(`/calendar/${course.date}/courses/${course.id}/edit`)
      }>
      <div
        className={classnames(
          styles.content,
          availableSpaces === 1 && styles.warning,
          availableSpaces === 0 && styles.danger,
          calendar.selectedCourse === `course-${course.id}` && styles.primary
        )}>
        <span className={styles.eventName}>
          {course.time.substring(0, 5)} |{' '}
          {getShortCourseType(course.course_type)}
        </span>
        <span
          className={classnames(
            styles.courseSpace,
            availableSpaces === 1 && styles.textWarning,
            availableSpaces === 0 && styles.textDanger
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
      </div>
    </li>
  )
}

export default CalendarWeekCourse
