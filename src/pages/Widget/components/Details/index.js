import React from 'react'

import styles from './Details.scss'

const Details = ({ widget, address = '' }) => {
  const style = {
    color: widget.button_color
  }

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
        <div dangerouslySetInnerHTML={{ __html: widget.requirements }} />
      </div>

      <hr />

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Cancellations</h3>
        {widget.cancellation}
      </div>

      <div className={styles.block}>
        I can confirm that I have read and agreed to the requirements and{' '}
        <strong>
          <a style={style} href={widget.terms} target="_blank">
            terms and conditions
          </a>
        </strong>
      </div>
    </div>
  )
}

export default Details
