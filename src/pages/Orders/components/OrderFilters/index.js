import React from 'react'
import moment from 'moment'
import styles from './OrderFilters.scss'

const DATE_FORMAT = 'YYYY-MM-DD'
const FILTERS = [
  {
    name: 'Today',
    getDate: () => moment().format(DATE_FORMAT)
  },
  {
    name: 'This Week',
    getDate: () =>
      moment()
        .startOf('week')
        .format(DATE_FORMAT)
  },
  {
    name: 'This Month',
    getDate: () =>
      moment()
        .startOf('month')
        .format(DATE_FORMAT)
  },
  {
    name: 'All',
    getDate: () => null
  }
]

const OrderFilters = ({ onDateFilter }) => {
  return (
    <div className={styles.orderFilters}>
      <div className={styles.dateFilters}>
        {FILTERS.map(filter => (
          <a
            key={filter.name}
            className={styles.dateFilter}
            onClick={() => onDateFilter(filter.getDate())}>
            {filter.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export default OrderFilters
