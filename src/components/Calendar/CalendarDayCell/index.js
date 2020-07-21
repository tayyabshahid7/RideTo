import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import CalendarDayCellItem from 'components/Calendar/CalendarDayCellItem'
import { getStarTimeForEventForDate } from 'utils/helper'
import { getShortCourseType } from 'services/course'
import styles from './index.scss'
import pluralize from 'pluralize'
import sortBy from 'lodash/sortBy'

const getDayItems = (day, dateStr, users, inactiveCourses) => {
  let { courses = [], events = [], staff = [] } = day

  const userIds = users.map(x => x.id)
  courses = courses
    .filter(x => x.course_type && !inactiveCourses.includes(x.course_type.id))
    .filter(
      x =>
        (userIds.includes(-1) && !x.instructor) ||
        (x.instructor && userIds.includes(x.instructor.id))
    )
  staff = staff.filter(x => userIds.includes(x.instructor))

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
          first_name: s.instructor_name.split(' ')[0],
          last_name: s.instructor_name.split(' ')[1],
          color: s.colour
        }
      })
    )
    .sort((a, b) => b.all_day - a.all_day)

  return sortBy(items, ['time'])
}

const CalendarDayCell = ({
  day,
  calendar,
  history,
  handleMobileCellClick,
  users,
  inactiveCourses,
  rowsCount
}) => {
  const isLowHeight = useMediaQuery({ maxHeight: 750 })
  const isVeryLowHeight = useMediaQuery({ maxHeight: 591 })
  const isLargeHeight = useMediaQuery({ minHeight: 760 })
  let showItems = isVeryLowHeight
    ? 0
    : isLowHeight
    ? 1
    : rowsCount < 6
    ? 2
    : isLargeHeight
    ? 2
    : 1
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, dateStr, users, inactiveCourses)
  const selectedDay = dateStr === calendar.selectedDate
  const more = items.length - showItems
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

  if (isMobile) {
    showItems = 3
  }

  const handleClick = () => {
    if (isMobile) {
      handleMobileCellClick(dateStr)
    } else {
      history.push(`/calendar/${dateStr}`)
    }
  }

  const dayText = moment(day.date).format(isMobile ? 'D' : 'ddd DD')

  return (
    <div
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDay,
        isAxisDate && 'axis-date'
      )}
      onClick={handleClick}>
      <div className={styles.cellHeader}>
        <div
          className={classnames(
            isOtherMonthDate && styles.otherMonthDate,
            styles.date,
            isToday && styles.highlight
          )}>
          {dayText}
        </div>
      </div>
      <div className={styles.courseContainer}>
        {items.slice(0, showItems).map(item => (
          <CalendarDayCellItem key={item.id} item={item} />
        ))}

        {more > 0 && (
          <div className={styles.more}>
            {more} {isVeryLowHeight ? pluralize('item', more) : 'more...'}
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarDayCell
