import React from 'react'

import styles from './CourseTypeSelectionFilters.scss'

const handleToggleFilter = (filter, selected, onSelect) => {
  if (selected && filter.tag === selected.tag) {
    return onSelect(null)
  }

  return onSelect(filter)
}

const handleSelectFilter = ({ target }, filters, onSelect) => {
  const { value } = target
  return onSelect(filters.filter(({ tag }) => tag === value)[0])
}

const CourseTypeSelectionFilters = ({ filters, selected, onSelect }) => {
  return (
    <React.Fragment>
      <div className={styles.courseTypeSelectionFiltersDesktop}>
        {filters.map(filter => (
          <div
            key={filter.tag}
            className={styles.filter}
            onClick={() => handleToggleFilter(filter, selected, onSelect)}>
            {filter.name}
          </div>
        ))}
      </div>

      <div className={styles.courseTypeSelectionFiltersMobile}>
        <select
          className={styles.select}
          onChange={event => handleSelectFilter(event, filters, onSelect)}>
          <option value={null}>Select Filter</option>
          {filters.map(filter => (
            <option
              key={filter.tag}
              value={filter.tag}
              className={styles.filter}>
              {filter.name}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  )
}

export default CourseTypeSelectionFilters
