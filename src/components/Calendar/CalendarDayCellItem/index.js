import React from 'react'
import { mapLabelColoursWithContant } from 'services/settings'
import { connect } from 'react-redux'
import styles from './CalendarDayCellItem.scss'

const CalendarDayCellItem = ({ item, settings }) => {
  const constant = item.course_type ? item.course_type.constant : 'EVENT'

  return (
    <div
      className={styles.calendarDayCellItem}
      style={{
        background: mapLabelColoursWithContant(settings, constant)
      }}>
      {item.time} | {item.name}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings
  }
}

export default connect(mapStateToProps)(CalendarDayCellItem)
