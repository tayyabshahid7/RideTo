import React from 'react'
import { connect } from 'react-redux'
import styles from './CalendarDayCellItem.scss'
import personIcon from 'assets/images/person.png'
import classnames from 'classnames'

const CalendarDayCellItem = ({ item, settings }) => {
  const isInstructor = item.instructor_name
  const availableSpaces = item.spaces - item.orders.length
  const className = classnames(
    styles.calendarDayCellItem,
    availableSpaces === 1 && styles.warning,
    availableSpaces === 0 && styles.danger
  )

  return (
    <div
      className={className}
      style={isInstructor ? { backgroundColor: item.color } : undefined}>
      {isInstructor && (
        <img src={personIcon} alt="" className={styles.instructorIcon} />
      )}{' '}
      <span className={styles.nameCell}>{item.name}</span>
      <span>{item.all_day ? 'All day' : item.time}</span>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings
  }
}

export default connect(mapStateToProps)(CalendarDayCellItem)
