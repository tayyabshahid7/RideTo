import React from 'react'
import styles from './styles.scss'

function OrderIncluded({ bikeHire, pom = false }) {
  if (pom) {
    return (
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            Complete <strong>peace of mind</strong> for new riders
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <strong>We'll pay for your 2nd day</strong> of training if you need
            it.
          </li>
        </ul>
      </div>
    )
  }

  const noBike = ['no', 'none', 'BIKE_HIRE_NONE'].includes(bikeHire)

  return (
    <div className={styles.wrapper}>
      {noBike ? (
        <p>Own bike, helmet and gloves required</p>
      ) : (
        <ul className={styles.list}>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            {bikeHire === 'auto' ? 'Automatic scooter' : 'Manual motorcycle'}{' '}
            hire
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            Helmet provided
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            Gloves &amp; jacket provided
          </li>
        </ul>
      )}
    </div>
  )
}

export default OrderIncluded
