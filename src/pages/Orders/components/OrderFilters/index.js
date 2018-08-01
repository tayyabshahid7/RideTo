import React from 'react'
import moment from 'moment'
import styles from './OrderFilters.scss'

import OrderSearch from 'pages/Orders/components/OrderSearch'

const DATE_FORMAT = 'YYYY-MM-DD'
const FILTERS = [
  {
    name: 'Today',
    getStartDate: () => moment().format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .add(1, 'day')
        .format(DATE_FORMAT)
  },
  {
    name: 'This Week',
    getStartDate: () =>
      moment()
        .startOf('week')
        .format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .endOf('week')
        .format(DATE_FORMAT)
  },
  {
    name: 'This Month',
    getStartDate: () =>
      moment()
        .startOf('month')
        .format(DATE_FORMAT),
    getEndDate: () =>
      moment()
        .endOf('month')
        .format(DATE_FORMAT)
  },
  {
    name: 'All',
    getStartDate: () => null,
    getEndDate: () => null
  }
]

const OrderFilters = ({ selected, onDateFilter, onSearch }) => {
  return (
    <div className={styles.orderFilters}>
      <div className={styles.dateFilters}>
        {FILTERS.map(filter => {
          const className =
            selected === filter.name
              ? `${styles.filter} ${styles.active}`
              : styles.filter

          return (
            <a
              key={filter.name}
              className={className}
              onClick={() =>
                onDateFilter(
                  filter.getStartDate(),
                  filter.getEndDate(),
                  filter.name
                )
              }>
              {filter.name}
            </a>
          )
        })}
      </div>

      <OrderSearch onSearch={onSearch} />
    </div>
  )
}

export default OrderFilters
