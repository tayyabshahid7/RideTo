import React from 'react'
import { Link } from 'react-router-dom'
import { getTrainingStatus } from 'services/course'
import styles from './style.scss'

const OrdersPanelItem = ({
  training,
  onEdit,
  onDelete,
  showEditButton = false
}) => {
  return (
    <div className={styles.container} key={training.id}>
      <div className={styles.row}>
        <div className={styles.name}>
          <Link to={`/customers/${training.customer_id}`}>
            {training.customer_name}
          </Link>
        </div>
        <button className={styles.editButton} onClick={onEdit}>
          {training.direct_friendly_id}
        </button>
      </div>
      <div className={styles.row}>
        {training.bike_hire && (
          <div className={styles.bikeType}>{training.bike_hire}</div>
        )}
        {training.status && (
          <div className={styles.status}>
            {getTrainingStatus(training.status)}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPanelItem
