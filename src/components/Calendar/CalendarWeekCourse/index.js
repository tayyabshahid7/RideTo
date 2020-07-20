import React from 'react'
import { getCourseSpaceTextShort } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import { WEEK_VIEW_START_TIME, WORK_HOURS, DATE_FORMAT } from 'common/constants'
import { getShortCourseType } from 'services/course'
import moment from 'moment'
import personIcon from 'assets/images/person.png'

const CalendarWeekCourse = React.forwardRef(
  (
    { course, position, barCount, history, calendar, match, showDetail },
    ref
  ) => {
    let height = course.duration / 60
    let startTime = (course.secondsForDay - WEEK_VIEW_START_TIME) / 3600
    if (startTime < 0) {
      height += startTime
      startTime = 0
    }
    if (startTime + height > WORK_HOURS - 1) {
      height = WORK_HOURS - startTime - 1
      if (height < 0) {
        return null
      }
    }
    let left = `${position * 4}px`
    let width = `calc(100% - ${(barCount - 1) * 4}px)`

    let style = {
      height: `${height * 56}px`,
      top: `${startTime * 56}px`,
      left,
      width,
      zIndex: position
    }

    if (course.instructor_name) {
      // Then it is staff
      return (
        <div
          className={classnames(
            styles.singleEvent,
            styles.singleEventEvent,
            parseInt(match.params.id) === course.id &&
              match.params.type === 'staff' &&
              styles.clickedCourse,
            calendar.selectedCourse === `staff-${course.id}` &&
              styles.clickedCourse
          )}
          style={style}
          onClick={() =>
            history.push(
              `/calendar/${moment(course.start_time).format(
                DATE_FORMAT
              )}/staff/${course.id}`
            )
          }>
          <div
            className={classnames(styles.content)}
            style={{ backgroundColor: course.colour }}>
            <span className={styles.eventName}>
              <img
                src={personIcon}
                alt=""
                className={styles.instructorIconSmall}
              />{' '}
              {course.instructor_name}
            </span>
            {course.start_time && course.end_time && (
              <span className={styles.eventTime}>
                {moment(course.start_time).format('HH:mm')} -{' '}
                {moment(course.end_time).format('HH:mm')}
              </span>
            )}
            {course.notes && (
              <div className={styles.eventsNotes}>
                <div>
                  <b>Notes:</b>
                </div>
                <div className={styles.notesContent}>{course.notes}</div>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (!course.course_type) {
      // Then it is event
      return (
        <div
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
          onClick={() =>
            history.push(
              `/calendar/${moment(course.start_time).format(
                DATE_FORMAT
              )}/events/${course.id}`
            )
          }>
          <div className={classnames(styles.content)}>
            <span className={styles.eventName}>{course.name}</span>
            {course.start_time && course.end_time && (
              <span className={styles.eventTime}>
                {moment(course.start_time).format('HH:mm')} -{' '}
                {moment(course.end_time).format('HH:mm')}
              </span>
            )}
            {course.notes && (
              <div className={styles.eventsNotes}>
                <div>
                  <b>Notes:</b>
                </div>
                <div className={styles.notesContent}>{course.notes}</div>
              </div>
            )}
          </div>
        </div>
      )
    }

    const availableSpaces = course.spaces_available

    return (
      <div
        ref={ref}
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
          className={classnames(
            styles.content,
            availableSpaces === 1 && styles.warning,
            availableSpaces === 0 && styles.danger
          )}>
          <span className={styles.eventName}>
            {getShortCourseType(course.course_type)}
          </span>
          {showDetail && (
            <React.Fragment>
              <div className={styles.eventTime}>
                {course.time.substring(0, 5)} -{' '}
                {moment(`${course.date} ${course.time}`)
                  .add(course.duration / 60, 'hours')
                  .format('HH:mm')}
              </div>
              {course.instructor && (
                <div className={styles.eventInst}>
                  <img
                    src={personIcon}
                    alt=""
                    className={styles.instructorIcon}
                  />{' '}
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
            </React.Fragment>
          )}
          {/* <div>
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
          </div> */}
          {course.notes && (
            <div className={styles.eventsNotes}>
              <div>
                <b>Notes:</b>
              </div>
              <div className={styles.notesContent}>{course.notes}</div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default CalendarWeekCourse
