import React from 'react'

import { BikeHires, getTitleFor } from 'common/info'

import styles from './style.scss'

const OrdersPanelItem = ({ order }) => {
  return (
    <div className={styles.container} key={order.friendly_id}>
      <div>
        <strong>#{order.friendly_id}</strong>
      </div>
      <div>{order.user_name}</div>
      <div>{getTitleFor(BikeHires, order.bike_hire)}</div>
      <div>{order.user_phone}</div>
    </div>
  )
}

export default OrdersPanelItem
