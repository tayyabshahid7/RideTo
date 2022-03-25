import React from 'react'
import StarsComponent from '../../../StarsComponent'
import moment from 'moment'
import styles from './AddonReviewModal.scss'

const AddonReviewModal = props => {
  const { name, rating, description, date } = props

  return (
    <React.Fragment>
      <div className={styles.reviewName}>{name}</div>
      <StarsComponent rating={rating} />
      <div className={styles.reviewDescription}>{description}</div>
      <div className={styles.reviewDate}>
        {moment(date).format('MMMM YYYY')}
      </div>
    </React.Fragment>
  )
}

export default AddonReviewModal
