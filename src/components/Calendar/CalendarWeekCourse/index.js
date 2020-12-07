import React from 'react'
import { getCourseSpaceTextShort } from 'services/course'
import styles from './index.scss'
import classnames from 'classnames'
import { DATE_FORMAT, CALENDAR_VIEW } from 'common/constants'
import { getShortCourseType } from 'services/course'
import moment from 'moment'
import UserInitial from '../UserInitial'
import { UserAvatar } from 'assets/icons'
import { calculateDimension } from 'utils/helper'

const CalendarWeekCourse = React.forwardRef(
  ({ course, barCount, history, calendar, match, showDetail }, ref) => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const isDay = calendar.viewMode === CALENDAR_VIEW.DAY
    const style = calculateDimension(
      course,
      isDesktop,
      isDay,
      barCount,
      showDetail
    )

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

    const tmpTime = moment(course.time, 'HH:mm:ss')
    const startTime = tmpTime.format('HH:mm')
    const endTime = tmpTime.add(course.duration, 'minutes').format('HH:mm')

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
            availableSpaces <= 0 && styles.danger
          )}>
          <div className={styles.eventHeader}>
            {(isDay || isDesktop) && (
              <span className={styles.eventName}>
                {getShortCourseType(course.course_type)}
              </span>
            )}
            {isDay && isDesktop && (
              <span className={styles.eventTime}>
                {startTime} - {endTime}
              </span>
            )}
            {!isDesktop && (
              <div className={styles.mobileAvatar}>
                {/* {isDay && (
                  <span className={styles.eventTime}>
                    {startTime} - {endTime}
                  </span>
                )} */}
                {course.instructor ? (
                  <UserInitial user={course.instructor} minimized />
                ) : (
                  <UserAvatar />
                )}
              </div>
            )}
            {isDesktop &&
              showDetail &&
              course.instructor &&
              course.sameTime <= 1 && (
                <UserInitial user={course.instructor} short />
              )}
          </div>
          {((showDetail && isDesktop) || isDay) && (
            <React.Fragment>
              {!!course.supplierName && (
                <div className={styles.supplierName}>{course.supplierName}</div>
              )}
              <div className={styles.supplierName}>{getOrderText(course)}</div>
              <span className={classnames(styles.eventSpaces)}>
                {getCourseSpaceTextShort(course)}
              </span>
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
