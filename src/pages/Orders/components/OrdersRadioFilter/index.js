import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const OrdersRadioFilter = ({ title, filters, selectedFilter, onSelect }) => {
  const handleChangeStatus = filter => {
    onSelect(filter.value)
  }

  return (
    <div className={styles.container}>
      <h5 className={styles.sectionTitle}>{title}</h5>
      {filters.map((filter, index) => (
        <div
          className={classnames(
            styles.sectionItem,
            filter.value === selectedFilter && styles.activeItem
          )}
          key={index}
          onClick={() => handleChangeStatus(filter)}>
          <h6 className={styles.sectionLabel}>{filter.text}</h6>
          <label className="cross-check">
            <input
              type="radio"
              name={`${title}Filter`}
              checked={filter.value === selectedFilter}
            />
            <span className="slider"></span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default OrdersRadioFilter
