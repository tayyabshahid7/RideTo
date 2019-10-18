import React from 'react'
import { CALENDAR_COLOURS } from 'common/constants'

import styles from './CalendarDayCellItem.scss'

const CalendarDayCellItem = ({ item }) => {
  const constant = item.course_type ? item.course_type.constant : 'EVENT'

  return (
    <div
      className={styles.calendarDayCellItem}
      style={{
        background: CALENDAR_COLOURS[constant]
      }}>
      {item.time} | {item.name}
    </div>
  )
}

export default CalendarDayCellItem
