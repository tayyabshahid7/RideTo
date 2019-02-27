import React from 'react'
import moment from 'moment'

import Button from 'components/RideTo/Button'
import { showReview } from 'services/order'
import styles from './DashboardOrders.scss'

const DashboardOrderItem = ({ order, onDetails }) => {
  const { training_location } = order
  const momentDate = order.start_time
    ? moment(order.start_time)
    : moment(order.user_date, 'DD/MM/YYYY')
  const date = momentDate.format('dddd Do MMMM')
  const time = order.start_time ? momentDate.format(', hh:mm') : ''
  return (
    <div className={styles.order} onClick={() => onDetails(order)}>
      <div className={styles.title}>Order #{order.friendly_id}</div>
      {order.trainings.map((training, index) => (
        <div className={styles.training} key={index}>
          <div className={styles.subTitle}>{training.course_type}</div>
          <div className={styles.date}>
            {training.date
              ? date
              : moment(training.requested_date).format('ddd Do MMMM YYYY')}
            {training.time && time}
          </div>
          <div className={styles.location}>
            {training_location.town}, {training_location.postcode}
          </div>
        </div>
      ))}
      {showReview(order) && (
        <Button className={styles.review}>
          <span>Write Review</span>
        </Button>
      )}
    </div>
  )
}

const DashboardOrders = ({ orders, onDetails }) => {
  return (
    <div className={styles.dashboardOrders}>
      <h4>My Orders</h4>
      {orders.map((order, index) => (
        <DashboardOrderItem key={index} order={order} onDetails={onDetails} />
      ))}
    </div>
  )
}

export default DashboardOrders
