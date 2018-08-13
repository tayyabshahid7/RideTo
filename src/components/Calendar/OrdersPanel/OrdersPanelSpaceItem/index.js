import React from 'react'
import styles from './style.scss'
import { Button } from 'reactstrap'

const OrdersPanelSpaceItem = ({ onAdd, onRemove }) => {
  return (
    <div className={styles.container}>
      <span className={styles.info}>Available</span>
      <Button color="primary" onClick={onAdd} className="mr-1">
        Add
      </Button>
      <Button color="" onClick={onRemove}>
        Remove
      </Button>
    </div>
  )
}

export default OrdersPanelSpaceItem
