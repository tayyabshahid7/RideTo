import React from 'react'
import moment from 'moment'

import Button from 'components/RideTo/Button'
import { getCourseTitle } from 'services/course'
import styles from './DashboardOrders.scss'

const DashboardOrderItem = ({ order, onDetails }) => {
  const { supplier } = order
  const momentDate = order.start_time
    ? moment(order.start_time)
    : moment(order.user_date, 'DD/MM/YYYY')
  const date = momentDate.format('dddd Do MMMM')
  const time = order.start_time ? momentDate.format(', hh:mm') : ''

  return (
    <div className={styles.order} onClick={() => onDetails(order)}>
      <div className={styles.title}>
        {getCourseTitle(order.selected_licence)}
      </div>
      <div className={styles.date}>
        {date}
        {time}
      </div>
      <div className={styles.location}>
        {supplier.town}, {supplier.postcode}
      </div>

      {order.training_status === 'COMPLETED' && (
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
      {orders.map(order => (
        <DashboardOrderItem order={order} onDetails={onDetails} />
      ))}
    </div>
  )
}

export default DashboardOrders
