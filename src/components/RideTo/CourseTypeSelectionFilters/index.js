import React from 'react'

import styles from './CourseTypeSelectionFilters.scss'

const handleToggleFilter = (filter, selected, onSelect) => {
  if (selected && filter.tag === selected.tag) {
    return onSelect(null)
  }

  return onSelect(filter)
}

const CourseTypeSelectionFilters = ({ filters, selected, onSelect }) => {
  return (
    <div className={styles.courseTypeSelectionFilters}>
      {filters.map(filter => (
        <div
          className={styles.filter}
          onClick={() => handleToggleFilter(filter, selected, onSelect)}>
          {filter.name}
        </div>
      ))}
    </div>
  )
}

export default CourseTypeSelectionFilters
