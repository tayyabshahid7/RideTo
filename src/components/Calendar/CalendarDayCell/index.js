import React from 'react'
import moment from 'moment'
import classnames from 'classnames'

import CalendarDayCellItem from 'components/Calendar/CalendarDayCellItem'
import { getStarTimeForEventForDate } from 'utils/helper'
import { getShortCourseType } from 'services/course'
import styles from './index.scss'

const getDayItems = (day, dateStr) => {
  const { courses = [], events = [] } = day

  const items = courses
    .map(course => {
      return {
        ...course,
        course: true,
        name: getShortCourseType(course.course_type),
        time: course.time.substring(0, 5)
      }
    })
    .concat(
      events.map(event => {
        return {
          ...event,
          event: true,
          time: getStarTimeForEventForDate(event, dateStr)
        }
      })
    )

  return items.sort((a, b) => a.time > b.time)
}

const CalendarDayCell = ({ day, calendar, history }) => {
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, dateStr)
  const selectedDay = dateStr === calendar.selectedDate
  const more = items.length - 3
  const isOtherMonthDate = day.date.getMonth() !== calendar.month

  return (
    <li
      className={classnames(styles.container, selectedDay && 'bg-highlight')}
      onClick={() => history.push(`/calendar/${dateStr}`)}>
      <div
        className={classnames(
          isOtherMonthDate && styles.otherMonthDate,
          styles.date
        )}>
        {day.date.getDate()}
      </div>

      {items
        .slice(0, 3)
        .map(item => <CalendarDayCellItem key={item.id} item={item} />)}

      {more > 0 && <div className={styles.more}>{more} more...</div>}
    </li>
  )
}

export default CalendarDayCell
