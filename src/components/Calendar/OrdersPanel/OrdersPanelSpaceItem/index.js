import React from 'react'
import styles from './style.scss'

const OrdersPanelSpaceItem = ({ onAdd, onRemove }) => {
  return (
    <div className={styles.container}>
      <span className={styles.info}>Available</span>
      <button className="btn btn-primary" onClick={onAdd}>
        Add
      </button>
      <button className="btn" onClick={onRemove}>
        Remove
      </button>
    </div>
  )
}

export default OrdersPanelSpaceItem
