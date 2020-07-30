import React from 'react'
import { connect } from 'react-redux'
import styles from './CalendarDayCellItem.scss'
import UserInitial from '../UserInitial'
import classnames from 'classnames'
import { Desktop } from 'common/breakpoints'

const CalendarDayCellItem = ({ item }) => {
  const isInstructor = item.instructor_name
  const availableSpaces = item.spaces_available
  const className = classnames(
    styles.calendarDayCellItem,
    availableSpaces === 1 && styles.warning,
    availableSpaces === 0 && styles.danger
  )

  const handleClick = () => {
    console.log(item)
  }

  return (
    <div
      className={className}
      style={isInstructor ? { backgroundColor: item.color } : undefined}
      onClick={handleClick}>
      <Desktop>
        {isInstructor ? (
          <UserInitial user={item} short />
        ) : (
          <span className={styles.nameCell}>{item.name}</span>
        )}
        <span>{item.all_day ? 'All day' : item.time}</span>
      </Desktop>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings
  }
}

export default connect(mapStateToProps)(CalendarDayCellItem)
