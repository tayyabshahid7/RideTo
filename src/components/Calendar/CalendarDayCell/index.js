import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import CalendarDayCellItem from 'components/Calendar/CalendarDayCellItem'
import { getStarTimeForEventForDate } from 'utils/helper'
import { getShortCourseType } from 'services/course'
import styles from './index.scss'
import sortBy from 'lodash/sortBy'

const getDayItems = (day, dateStr) => {
  const { courses = [], events = [], staff = [] } = day

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
    .concat(
      staff.map(s => {
        return {
          ...s,
          s: true,
          time: getStarTimeForEventForDate(s, dateStr),
          name: s.instructor_name,
          color: s.colour
        }
      })
    )
    .sort((a, b) => b.all_day - a.all_day)

  return sortBy(items, ['time'])
}

const CalendarDayCell = ({ day, calendar, history, handleMobileCellClick }) => {
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, dateStr)
  const selectedDay = dateStr === calendar.selectedDate
  const more = items.length - 3
  const isOtherMonthDate = day.date.getMonth() !== calendar.month
  const isAxisDate =
    calendar.year === day.date.getFullYear() &&
    calendar.month === day.date.getMonth() &&
    calendar.day === day.date.getDate()
  const now = new Date()
  const isToday =
    now.getFullYear() === day.date.getFullYear() &&
    now.getMonth() === day.date.getMonth() &&
    now.getDate() === day.date.getDate()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const handleClick = () => {
    if (isMobile) {
      handleMobileCellClick(dateStr)
    } else {
      history.push(`/calendar/${dateStr}`)
    }
  }

  return (
    <li
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDay,
        isAxisDate && 'axis-date'
      )}
      onClick={handleClick}>
      <div
        className={classnames(
          isOtherMonthDate && styles.otherMonthDate,
          styles.date,
          isToday && styles.highlight
        )}>
        {day.date.getDate()}
      </div>
      <div className={styles.courseContainer}>
        {items.slice(0, 3).map(item => (
          <CalendarDayCellItem key={item.id} item={item} />
        ))}

        {more > 0 && <div className={styles.more}>{more} more...</div>}
      </div>
    </li>
  )
}

export default CalendarDayCell
