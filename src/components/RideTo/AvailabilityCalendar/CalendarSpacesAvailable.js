import React from 'react'
import styles from './CalendarSpacesAvailable.scss'
import classnames from 'classnames'

function CalendarSpacesAvailable({ calendar: { selectedCourse }, courses }) {
  if (
    !selectedCourse ||
    !courses.some(course => course.id === selectedCourse.id)
  ) {
    return null
  }

  const { training_count, spaces, spaces_available } = selectedCourse

  let spacesLeft = 0
  if (typeof spaces_available !== 'undefined') {
    spacesLeft = parseInt(spaces_available)
  } else {
    const spacesTotal = parseInt(spaces)
    const spacesTaken = parseInt(training_count)
    spacesLeft = spacesTotal - spacesTaken
  }
  let colorClass = null

  if (spacesLeft === 2) {
    colorClass = styles.yellow
  }

  if (spacesLeft < 2) {
    colorClass = styles.red
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Spaces available:</span>{' '}
      <span className={classnames(styles.color, colorClass)}>
        {spacesLeft} left
      </span>
    </div>
  )
}

export default CalendarSpacesAvailable
