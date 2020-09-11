import React from 'react'
import { connect } from 'react-redux'
import styles from './CalendarDayCellItem.scss'
import classnames from 'classnames'
import { Desktop } from 'common/breakpoints'

const CalendarDayCellItem = ({ item }) => {
  const isEvent = item.event
  const availableSpaces = item.spaces_available
  const className = classnames(
    styles.calendarDayCellItem,
    availableSpaces === 1 && styles.warning,
    availableSpaces === 0 && styles.danger
  )

  const handleClick = e => {
    // e.stopPropagation()
  }

  return (
    <div
      className={className}
      style={isEvent ? { backgroundColor: item.colour } : undefined}
      onClick={handleClick}>
      <Desktop>
        <span className={styles.nameCell}>{item.name}</span>
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
