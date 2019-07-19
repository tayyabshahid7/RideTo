import React from 'react'
import styles from './FullLicencePayment.scss'

function FullLicencePayment({ availability, date }) {
  return (
    <React.Fragment>
      <hr style={{ marginTop: '2.5rem' }} />
      <div className={styles.container}>
        <div className={styles.row}>
          <span className={styles.payToday}>Availability</span>{' '}
          <span className={styles.payTodayPrice}>{availability}</span>
        </div>
        <div className={styles.row}>
          <span>Est. pass date</span> <span>{date}</span>
        </div>
      </div>
    </React.Fragment>
  )
}

export default FullLicencePayment
