import React, { Fragment } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function NextSteps({ isFullLicence }) {
  return (
    <Fragment>
      <div>
        <div className={classnames(styles.title, styles.titleOrderSummary)}>
          Great choice, here's what's next
        </div>
        <ul className={styles.nextStepsList}>
          <li>Securely complete your booking </li>
          <li>
            Get confirmation from the instructor within {isFullLicence ? 24 : 3}{' '}
            working hours{' '}
          </li>
          <li>Prepare for your training with our online guides</li>
        </ul>
      </div>
      <hr style={{ marginTop: '2rem', marginBottom: '2rem' }} />
    </Fragment>
  )
}

export default NextSteps
