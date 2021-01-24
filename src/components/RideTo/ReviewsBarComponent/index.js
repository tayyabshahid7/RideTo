import React from 'react'
import styles from './styles.scss'

const ReviewsBarComponent = ({ reviews }) => {
  const items = Object.keys(reviews)
  let total = 0
  items.forEach(item => (total += reviews[item]))

  return (
    <div className={styles.container}>
      {items.map(item => (
        <div key={item} className={styles.reviewLine}>
          <div className={styles.reviewKey}>{item}</div>
          <div className={styles.reviewBar}>
            <span style={{ width: (reviews[item] / total) * 100 + '%' }}></span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewsBarComponent
