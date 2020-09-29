import React from 'react'
import classnames from 'classnames'
import CalendarShiftDayCellItem from '../CalendarShiftDayCellItem'
import CalendarShiftDayEdit from '../CalendarShiftDayEdit'

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

const CalendarShiftDayCell = ({ day, user, onNew, onEdit }) => {
  const items = getDayItems(day, user)

  const handleDiaryClick = diary => {
    onEdit && onEdit({ diary, user, day })
  }

  const handleNewClick = eventType => {
    onNew && onNew({ eventType, day, user })
  }

  return (
    <div
      className={classnames(styles.container, items.length && styles.dataCell)}>
      <div className={styles.courseContainer}>
        {items.map(diary => (
          <CalendarShiftDayCellItem
            key={diary.id}
            diary={diary}
            onClick={handleDiaryClick}
          />
        ))}
      </div>
      {!items.length && <CalendarShiftDayEdit onClick={handleNewClick} />}
    </div>
  )
}

export default CalendarShiftDayCell
