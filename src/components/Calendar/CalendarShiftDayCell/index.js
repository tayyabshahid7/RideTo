import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import CalendarDayCellItem from 'components/Calendar/CalendarDayCellItem'
import { getStarTimeForEventForDate } from 'utils/helper'
import styles from './index.scss'
import sortBy from 'lodash/sortBy'

const getDayItems = (day, dateStr, users) => {
  let { events = [] } = day

  const items = events
    .map(event => {
      return {
        ...event,
        event: true,
        time: getStarTimeForEventForDate(event, dateStr)
      }
    })
    .sort((a, b) => b.all_day - a.all_day)

  return sortBy(items, ['time'])
}

const CalendarShiftDayCell = ({
  day,
  calendar,
  history,
  users,
  inactiveCourses,
  rowsCount
}) => {
  let showItems = 4
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, dateStr, users, inactiveCourses)
  const selectedDay = dateStr === calendar.selectedDate
  const more = items.length - showItems
  const isAxisDate =
    calendar.year === day.date.getFullYear() &&
    calendar.month === day.date.getMonth() &&
    calendar.day === day.date.getDate()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  if (isMobile) {
    showItems = 3
  }

  const handleClick = () => {
    console.log('clicked')
    // history.push(`/calendar/${dateStr}`)
  }

  return (
    <div
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDay,
        isAxisDate && 'axis-date'
      )}
      onClick={handleClick}>
      <div className={styles.courseContainer}>
        {items.slice(0, showItems).map(item => (
          <CalendarDayCellItem key={item.id} item={item} />
        ))}

        {more > 0 && <div className={styles.more}>+ {more} More</div>}
      </div>
    </div>
  )
}

export default CalendarShiftDayCell
