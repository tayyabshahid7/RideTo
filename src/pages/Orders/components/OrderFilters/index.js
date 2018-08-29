import React from 'react'
import styles from './OrderFilters.scss'

import SearchField from 'components/SearchField'

const OrderFilters = ({ filters, selectedFilter, onDateFilter, onSearch }) => {
  const selected = selectedFilter || {}
  return (
    <div className={styles.orderFilters}>
      <div className={styles.filters}>
        {filters.map(filter => {
          const className =
            selected.name === filter.name
              ? `${styles.filter} ${styles.active}`
              : styles.filter

          return (
            <a
              key={filter.name}
              className={className}
              onClick={() => onDateFilter(filter)}>
              {filter.name}
            </a>
          )
        })}
      </div>

      <SearchField onSearch={onSearch} placeholder="Search Rider or Order ID" />
    </div>
  )
}

export default OrderFilters
