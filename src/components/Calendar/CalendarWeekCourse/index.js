import React from 'react'
import { getCourseSpaceTextShort } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import {
  WEEK_VIEW_START_TIME,
  WORK_HOURS,
  CALENDAR_COLOURS
} from 'common/constants'
import { getShortCourseType } from 'services/course'
import moment from 'moment'
import personIcon from 'assets/images/person.png'

const CalendarWeekCourse = ({
  course,
  position,
  barCount,
  history,
  calendar,
  match
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
  let width = `calc(${100 / barCount}% + 12px)`

  if (position > 0) {
    left = `calc(${(100 / barCount) * position}% - 12px)`
    width = `calc(${100 / barCount}% + 12px)`
  }

  // let borderColor = 'black'
  let style = {
    height: `${height}px`,
    top: `${top}px`,
    left,
    width,
    zIndex: position
  }

  if (!course.course_type) {
    // Then it is event
    return (
      <li
        className={classnames(
          styles.singleEvent,
          styles.singleEventEvent,
          parseInt(match.params.id) === course.id &&
            match.params.type === 'events' &&
            styles.clickedCourse,
          calendar.selectedCourse === `event-${course.id}` &&
            styles.clickedCourse
        )}
        style={style}
        onClick={() => history.push(`/calendar/events/${course.id}`)}>
        <div className={classnames(styles.content)}>
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
      className={classnames(
        styles.singleEvent,
        parseInt(match.params.id) === course.id &&
          match.params.type === 'courses' &&
          styles.clickedCourse,
        calendar.selectedCourse === `course-${course.id}` &&
          styles.clickedCourse
      )}
      style={style}
      onClick={() =>
        history.push(`/calendar/${course.date}/courses/${course.id}`)
      }>
      <div
        className={classnames(styles.content)}
        style={{
          background: CALENDAR_COLOURS[course.course_type.constant]
        }}>
        <span className={styles.eventName}>
          {getShortCourseType(course.course_type)}
        </span>
        <div className={styles.eventTime}>
          {course.time.substring(0, 5)} -{' '}
          {moment(`${course.date} ${course.time}`)
            .add(course.duration / 60, 'hours')
            .format('HH:mm')}
        </div>
        {course.instructor && (
          <div className={styles.eventInst}>
            <img src={personIcon} alt="" className={styles.instructorIcon} />{' '}
            {course.instructor.first_name} {course.instructor.last_name}
          </div>
        )}
        <span
          className={classnames(
            styles.eventSpaces,
            availableSpaces === 2 && styles.textMildWarning,
            availableSpaces === 1 && styles.textWarning,
            availableSpaces === 0 && styles.textDanger
          )}>
          {getCourseSpaceTextShort(course)}
        </span>
        <div>
          <div>
            <b>Orders:</b>
          </div>
          {course.orders.length > 0
            ? course.orders.map(order => (
                <div className={styles.order} key={order.friendly_id}>
                  <span>{order.customer_name}</span>
                </div>
              ))
            : 'No orders'}
        </div>
        {course.notes && (
          <div className={styles.eventsNotes}>
            <div>
              <b>Notes:</b>
            </div>
            <div className={styles.notesContent}>{course.notes}</div>
          </div>
        )}
      </div>
    </li>
  )
}

export default CalendarWeekCourse
