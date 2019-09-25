import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function Filters({ selectedFilter, handleFilterClick, filters }) {
  return (
    <ul className={styles.list}>
      {filters.map(filter => (
        <li className={styles.listItem} key={filter}>
          <button
            className={classnames(
              styles.filterButton,
              filter === selectedFilter && styles.active
            )}
            onClick={() => {
              handleFilterClick(filter)
            }}>
            {filter.replace('How Tos', "How To's")}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Filters
