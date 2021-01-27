import React from 'react'
import moment from 'moment'
import styles from './styles.scss'
import StarsComponent from '../StarsComponent'

const ReviewItem = ({ author, rating, review, time }) => {
  let datetime = moment(time).format('MMMM, YYYY')
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>{author}</span>
        <span className={styles.date}>{datetime}</span>
      </div>
      <StarsComponent rating={rating} />
      <p className={styles.content}>{review}</p>
    </div>
  )
}

export default ReviewItem
