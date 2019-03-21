import React from 'react'
import styles from './style.scss'
import { Button } from 'reactstrap'

const OrdersPanelSpaceItem = ({ onAdd, onRemove }) => {
  return (
    <div className={styles.container}>
      <span className={styles.info}>Available</span>
      <Button
        color="primary"
        onClick={onAdd}
        className="mr-1 btn-padding-md"
        size="sm">
        Add
      </Button>
    </div>
  )
}

export default OrdersPanelSpaceItem
