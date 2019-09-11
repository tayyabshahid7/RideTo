import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const FILTERS = [
  'Latest Blogs',
  'How Tos',
  'Reviews',
  'Bikes',
  'Rides',
  'Fun',
  'Events'
]

function Filters({ selectedFilter, handleFilterClick }) {
  return (
    <ul className={styles.list}>
      {FILTERS.map(filter => (
        <li className={styles.listItem} key={filter}>
          <button
            className={classnames(
              styles.filterButton,
              filter === selectedFilter && styles.active
            )}
            onClick={() => {
              handleFilterClick(filter)
            }}>
            {filter}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Filters
