import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import CalendarShiftDayCellItem from 'components/Calendar/CalendarShiftDayCellItem'

import styles from './index.scss'

const getDayItems = (day, user) => {
  let { staff = [] } = day

  const items = staff
    .filter(x => x.instructor_id === user.id)
    .map(s => {
      return {
        ...s,
        first_name: s.instructor_name ? s.instructor_name.split(' ')[0] : '',
        last_name: s.instructor_name ? s.instructor_name.split(' ')[1] : ''
      }
    })

  return items
}

const CalendarShiftDayCell = ({ day, calendar, history, user }) => {
  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, user)
  const selectedDay = dateStr === calendar.selectedDate

  const handleClick = () => {
    history.push(`/calendar/${dateStr}/shifts/${user.id}/list`)
  }

  const handleDiaryClick = diary => {
    console.log(diary)
    history.push(`/calendar/${dateStr}/shifts/${user.id}/${diary.id}/edit`)
  }

  return (
    <div
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDay
      )}
      onClick={handleClick}>
      <div className={styles.courseContainer}>
        {items.map(diary => (
          <CalendarShiftDayCellItem
            key={diary.id}
            diary={diary}
            onClick={handleDiaryClick}
          />
        ))}
      </div>
      {!items.length && <div className={styles.editButton}>Edit</div>}
    </div>
  )
}

export default CalendarShiftDayCell
