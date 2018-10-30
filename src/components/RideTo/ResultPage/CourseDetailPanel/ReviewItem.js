import React from 'react'
import classnames from 'classnames'
import styles from './ReviewItem.scss'
import StarsComponent from 'components/RideTo/StarsComponent'

const ReviewItem = ({ review }) => (
  <div className={classnames(styles.container)}>
    <div className={styles.name}>{review.author}</div>
    <div className={styles.starWrapper}>
      <StarsComponent rating={review.rating} className={styles.starComponent} />
    </div>
    <div className={styles.desc}>{review.review}</div>
  </div>
)

export default ReviewItem
