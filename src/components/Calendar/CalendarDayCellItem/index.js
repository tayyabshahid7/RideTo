import React from 'react'
import classnames from 'classnames'

import styles from './CalendarDayCellItem.scss'

const CalendarDayCellItem = ({ item }) => {
  const availableSpaces = item.course ? item.spaces - item.orders.length : null
  const className = classnames(
    styles.calendarDayCellItem,
    availableSpaces === 1 && styles.warning,
    availableSpaces <= 0 && styles.danger
  )

  return (
    <div className={className}>
      {item.time} | {item.name}
    </div>
  )
}

export default CalendarDayCellItem
