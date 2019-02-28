import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'reactstrap'

import { BikeHires, getTitleFor } from 'common/info'

import classnames from 'classnames'

import styles from './style.scss'

const OrdersPanelItem = ({
  training,
  onEdit,
  onDelete,
  showEditButton = false
}) => {
  return (
    <div className={styles.container} key={training.id}>
      <div className={styles.col}>
        <strong>{training.direct_friendly_id}</strong>
      </div>
      <div className={styles.name}>
        <Link to={`/customers/${training.customer_id}`}>
          {training.customer_name}
        </Link>
      </div>
      <div className={styles.col}>
        {getTitleFor(BikeHires, training.bike_type)}
      </div>
      <div className={styles.actions}>
        {showEditButton && (
          <React.Fragment>
            <Button
              color="link"
              onClick={onEdit}
              className={classnames(
                'mr-1 btn-padding-sm',
                styles.inlineButton
              )}>
              Edit
            </Button>
            <Button
              color="link"
              onClick={onDelete}
              className={classnames(
                'mr-1 btn-padding-sm',
                styles.inlineButton
              )}>
              Delete
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default OrdersPanelItem
