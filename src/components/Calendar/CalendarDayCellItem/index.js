import React from 'react'
import { mapLabelColoursWithContant } from 'services/settings'
import { connect } from 'react-redux'
import styles from './CalendarDayCellItem.scss'
import personIcon from 'assets/images/person.png'

const CalendarDayCellItem = ({ item, settings }) => {
  const constant = item.course_type ? item.course_type.constant : 'EVENT'
  const isInstructor = item.instructor_name

  return (
    <div
      className={styles.calendarDayCellItem}
      style={{
        background:
          item.colour || mapLabelColoursWithContant(settings, constant)
      }}>
      {isInstructor && (
        <img src={personIcon} alt="" className={styles.instructorIcon} />
      )}{' '}
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
