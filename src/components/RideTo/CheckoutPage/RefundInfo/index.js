import React from 'react'
import styles from './styles.scss'

function RefundInfo() {
  return (
    <div className={styles.container}>
      <span>!</span>
      <div className={styles.popover}>
        As the course is within 3 working days, you will not be able to cancel
        or change the booking once confirmed.
      </div>
    </div>
  )
}

export default RefundInfo
