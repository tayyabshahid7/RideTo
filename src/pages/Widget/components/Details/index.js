import React from 'react'

import styles from './Details.scss'

const Details = ({ widget, address = '' }) => {
  return (
    <div className={styles.details}>
      <h1 className={styles.heading}>
        <img className={styles.logo} src={widget.logo} />
      </h1>

      <div className={styles.intro}>{widget.intro}</div>

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Address</h3>
        {address}
        <hr />
      </div>

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Requirements</h3>
        {widget.requirements}
        <hr />
      </div>
    </div>
  )
}

export default Details
