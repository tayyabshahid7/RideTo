import React, { Fragment } from 'react'
import moment from 'moment'

import Button from 'components/RideTo/Button'
import { showReview } from 'services/order'
import styles from './DashboardOrders.scss'

const DashboardOrderItem = ({ order, onDetails }) => {
  const { training_location } = order
  const isFullLicence = order.course_title.includes('Full Licence')
  return (
    <div className={styles.order} onClick={() => onDetails(order)}>
      <div className={styles.title}>Order #{order.friendly_id}</div>
      {isFullLicence ? (
        <div className={styles.training}>
          <div className={styles.subTitle}>
            {order.trainings[0].course_type}
          </div>
          <div className={styles.location}>
            {training_location.town}, {training_location.postcode}
          </div>
        </div>
      ) : (
        <Fragment>
          {order.trainings.map((training, index) => (
            <div className={styles.training} key={index}>
              <div className={styles.subTitle}>{training.course_type}</div>
              <div className={styles.date}>
                {training.date
                  ? moment(training.date).format('ddd Do MMMM YYYY')
                  : moment(training.requested_date).format('ddd Do MMMM YYYY')}
                {training.time &&
                  moment(`${training.date}T${training.time}`).format(
                    ' hh:mm A'
                  )}
              </div>
              <div className={styles.location}>
                {training_location.town}, {training_location.postcode}
              </div>
            </div>
          ))}
        </Fragment>
      )}
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
