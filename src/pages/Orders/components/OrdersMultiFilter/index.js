import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const OrdersMultiFilter = ({ title, filters, selectedFilters, onSelect }) => {
  const handleChangeStatus = filter => {
    onSelect(filter.value)
  }

  return (
    <div className={styles.container}>
      <h5 className={styles.sectionTitle}>{title}</h5>
      {filters.map((filter, index) => (
        <div
          className={classnames(styles.sectionItem)}
          key={index}
          onClick={() => handleChangeStatus(filter)}>
          <h6 className={styles.sectionLabel}>{filter.text}</h6>
          <label className="general-check">
            <input
              type="checkbox"
              name={`${title}Filter`}
              checked={selectedFilters.includes(filter.value)}
            />
            <span className="slider"></span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default OrdersMultiFilter
