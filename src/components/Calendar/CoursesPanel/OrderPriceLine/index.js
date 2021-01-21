import React from 'react'
import ColorTag from 'components/ColorTag'
import { getPaymentStatus } from 'services/order'
import styles from './OrderPriceLine.scss'

const OrderPriceLine = ({ course, order, orderDetail }) => {
  if (!order || !order.order || !course) {
    return null
  }

  const paymentStatus = getPaymentStatus(order.order.payment_status)

  let price = ''
  if (course.pricing) {
    price = (course.pricing.price / 100).toFixed(2)
  }
  if (orderDetail && orderDetail.package && orderDetail.package.price) {
    price = orderDetail.package.price
  }

  return (
    <div className={styles.priceLine}>
      {price ? <span className={styles.price}>£{price}</span> : <span></span>}
      <ColorTag text={paymentStatus.text} type={paymentStatus.type} />
    </div>
  )
}

export default OrderPriceLine
