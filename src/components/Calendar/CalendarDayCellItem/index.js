import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './CalendarDayCellItem.scss'
import classnames from 'classnames'
import { Desktop } from 'common/breakpoints'
import { addCourseToPackage, removeCourseFromPackage } from 'store/course'

const CalendarDayCellItem = ({
  coursePackage,
  item,
  addCourseToPackage,
  removeCourseFromPackage
}) => {
  const isEvent = item.event
  const availableSpaces = item.spaces_available
  let isInPackage = false

  if (
    !isEvent &&
    coursePackage.adding &&
    item.course_type.constant.startsWith('FULL_LICENCE')
  ) {
    const courseIds = coursePackage.courses.map(x => x.id)
    isInPackage = courseIds.includes(item.id)
  }

  const className = classnames(
    styles.calendarDayCellItem,
    availableSpaces === 1 && styles.warning,
    availableSpaces <= 0 && styles.danger,
    isInPackage && styles.packageItem
  )

  const handleClick = e => {
    if (isEvent) {
      return
    }

    if (
      coursePackage.adding &&
      item.course_type.constant.startsWith('FULL_LICENCE') &&
      item.spaces_available
    ) {
      if (isInPackage) {
        removeCourseFromPackage(item)
      } else {
        addCourseToPackage(item)
      }
      e.stopPropagation()
    }
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
    settings: state.settings.settings,
    coursePackage: state.course.coursePackage
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addCourseToPackage,
      removeCourseFromPackage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarDayCellItem)
