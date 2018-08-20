import React from 'react'

import styles from './Details.scss'

const Details = ({ widget, address = '' }) => {
  return (
    <div className={styles.details}>
      <div className={styles.intro}>{widget.intro}</div>

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Address</h3>
        {address}
      </div>

      <hr />

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Requirements</h3>
        {widget.requirements}
      </div>

      <hr />

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Cancellations</h3>
        {widget.cancellation}
      </div>

      <div className={styles.block}>
        You can also view the terms{' '}
        <strong>
          <a href={widget.terms}>here.</a>
        </strong>
      </div>
    </div>
  )
}

export default Details
