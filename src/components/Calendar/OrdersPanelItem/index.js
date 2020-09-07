import React from 'react'
import { Link } from 'react-router-dom'
import { getTrainingStatus } from 'services/course'
import { getPaymentOptions } from 'services/order'
import styles from './style.scss'
import classnames from 'classnames'

const OrdersPanelItem = ({
  training,
  onEdit,
  onDelete,
  showEditButton = false
}) => {
  const { payment_status } = training

  return (
    <div className={styles.container} key={training.id}>
      <div className={styles.line}>
        <div className={styles.name}>
          <Link to={`/customers/${training.customer_id}`}>
            {training.customer_name}
          </Link>
        </div>
        <button className={styles.editButton} onClick={onEdit}>
          {training.direct_friendly_id}
        </button>
      </div>
      <div className={styles.line}>
        {training.bike_hire && <div>{training.bike_hire}</div>}
        {training.status && <div>{getTrainingStatus(training.status)}</div>}
      </div>
      <div className={styles.line}>
        {training.rider_experience && <div>{training.rider_experience}</div>}
        {training.payment_status && (
          <div
            className={classnames(
              payment_status === 'PARTIAL_PAYMENT' && styles.partial,
              payment_status === 'PENDING' && styles.pending
            )}>
            {
              getPaymentOptions().find(
                ({ id }) => id === training.payment_status
              ).name
            }
          </div>
        )}
      </div>
      {training.notes && <div className={styles.notes}>{training.notes}</div>}
    </div>
  )
}

export default OrdersPanelItem
