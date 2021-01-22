import React from 'react'
import classnames from 'classnames'
import styles from './SupplierExtraInfo.scss'

const SupplierExtraInfo = () => {
  return (
    <React.Fragment>
      <div className={styles.container}>
        <div className={styles.moneybackContent}>
          <div>Icon</div>
          <div>
            <p>
              Cancel within 3 working days to get a full refund on your booking.
            </p>
            <span className={styles.link}>More Details</span>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <h4 className={styles.blockTitle}>the rideto difference</h4>
        <div className={styles.diffBlock}>
          <h6>Get Started Faster</h6>
          <p>
            With more schools than anywhere else, you can be on two wheels
            sooner than you think.
          </p>
        </div>
        <div className={styles.diffBlock}>
          <h6>top rated schools</h6>
          <p>
            We’ve hand-picked the top motorcycle schools based on learner
            feedback. Only the best stay on our platform.
          </p>
        </div>
        <div className={styles.diffBlock}>
          <h6>best prices</h6>
          <p>
            With our price match guarantee and discounts for new riders, we make
            learning to ride fun and affordable.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SupplierExtraInfo
