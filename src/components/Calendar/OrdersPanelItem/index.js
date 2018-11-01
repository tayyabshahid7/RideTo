import React from 'react'

import { Button } from 'reactstrap'

import { BikeHires, getTitleFor } from 'common/info'

import styles from './style.scss'

const OrdersPanelItem = ({ order, onEdit, showEditButton = false }) => {
  return (
    <div className={styles.container} key={order.friendly_id}>
      <div className={styles.col}>
        <strong>{order.direct_friendly_id}</strong>
      </div>
      <div className={styles.name}>{order.user_name}</div>
      <div className={styles.col}>
        {getTitleFor(BikeHires, order.bike_hire)}
      </div>
      <div className={styles.actions}>
        {showEditButton && (
          <Button color="link" onClick={onEdit} className="mr-1 btn-padding-sm">
            Edit
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrdersPanelItem