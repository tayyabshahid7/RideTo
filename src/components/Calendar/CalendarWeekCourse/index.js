import React from 'react'
import { getCourseSpaceTextShort } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import {
  WEEK_VIEW_START_TIME,
  WORK_HOURS,
  DATE_FORMAT,
  CALENDAR_VIEW
} from 'common/constants'
import { getShortCourseType } from 'services/course'
import moment from 'moment'
import UserInitial from '../UserInitial'
import { UserAvatar } from 'assets/icons'

const CalendarWeekCourse = React.forwardRef(
  (
    { course, position, barCount, history, calendar, match, showDetail },
    ref
  ) => {
    const isDay = calendar.viewMode === CALENDAR_VIEW.DAY

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

    if (isDay) {
      left = `${(100 / barCount) * position}%`
      width = `${100 / barCount}%`
    } else if (showDetail && course.sameTime > 1) {
      const offset = (4 * (barCount - course.sameTime)) / course.sameTime

      left = `${(100 / course.sameTime) *
        (position - course.minStart)}% - ${offset *
        (position - course.minStart)}px`
      width = `${100 / course.sameTime}% - ${offset}px`

      if (course.minStart) {
        left = `${4 * course.minStart}px + ${left}`
      }
      left = `calc(${left})`
      width = `calc(${width})`
    }

    let style = {
      height: `${height * 56}px`,
      top: `${startTime * 56}px`,
      left,
      width
    }

    const handleClick = () => {
      history.push(
        `/calendar/${moment(course.start_time).format(DATE_FORMAT)}/staff/${
          course.id
        }`
      )
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
          onClick={handleClick}>
          <div
            className={classnames(styles.content)}
            style={{ backgroundColor: course.colour }}>
            <span className={styles.eventName}>
              <UserAvatar />
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

    const getOrderText = course => {
      if (!course.orders || !course.orders.length) {
        return 'No order'
      }

      const customerNames = course.orders.map(x => x.customer_name)
      const tmp = customerNames.length === 1 ? 'Order' : 'Orders'
      return `${customerNames.length} ${tmp} (${customerNames.join(', ')})`
    }

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
          <div className={styles.eventHeader}>
            <span className={styles.eventName}>
              {getShortCourseType(course.course_type)}
            </span>
            {showDetail && course.instructor && course.sameTime <= 1 && (
              <UserInitial user={course.instructor} short />
            )}
          </div>
          {(showDetail || isDay) && (
            <React.Fragment>
              {!!course.supplierName && (
                <div className={styles.supplierName}>{course.supplierName}</div>
              )}
              <div className={styles.supplierName}>{getOrderText(course)}</div>
              <span
                className={classnames(
                  styles.eventSpaces
                  // availableSpaces === 2 && styles.textMildWarning,
                  // availableSpaces === 1 && styles.textWarning,
                  // availableSpaces === 0 && styles.textDanger
                )}>
                {getCourseSpaceTextShort(course)}
              </span>
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
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
)

export default CalendarWeekCourse
