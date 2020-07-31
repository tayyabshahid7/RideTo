import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import CalendarDayCellItem from 'components/Calendar/CalendarDayCellItem'
import { getStarTimeForEventForDate } from 'utils/helper'
import styles from './index.scss'
import sortBy from 'lodash/sortBy'

const getDayItems = (day, dateStr, user) => {
  let { staff = [] } = day

  const items = staff
    .filter(x => x.instructor === user.id)
    .map(s => {
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
    .sort((a, b) => b.all_day - a.all_day)

  return sortBy(items, ['time'])
}

const CalendarShiftDayCell = ({ day, calendar, history, user }) => {
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, dateStr, user)
  const selectedDay = dateStr === calendar.selectedDate

  const handleClick = () => {
    console.log('clicked')
    history.push(`/calendar/${dateStr}/shifts/${user.id}/list`)
  }

  return (
    <div
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDay
      )}
      onClick={handleClick}>
      <div className={styles.courseContainer}>
        {items.map(item => (
          <CalendarDayCellItem key={item.id} item={item} />
        ))}
      </div>
      {!items.length && <div className={styles.editButton}>Edit</div>}
    </div>
  )
}

export default CalendarShiftDayCell
