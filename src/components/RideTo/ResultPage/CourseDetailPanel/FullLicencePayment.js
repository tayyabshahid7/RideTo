import React from 'react'
import { calcFullLicencePrices } from 'services/course'
import styles from './FullLicencePayment.scss'

function FullLicencePayment({ pricePerHour, hours, style, isWidget, addons }) {
  if (!hours) {
    return null
  }

  const [now, later] = calcFullLicencePrices(pricePerHour, hours, addons)

  return (
    <div className={styles.container} style={style}>
      <div className={styles.row}>
        <span className={styles.payToday}>Pay today</span>{' '}
        <span className={styles.payTodayPrice}>Only £{now}</span>
      </div>
      <div className={styles.row}>
        <span>To pay after booking your first lesson</span>{' '}
        <span>£{later}</span>
      </div>
      <br />
      <div className={styles.row}>
        <span>
          {' '}
          The full amount £{later} will be reserved on your card upon placing a
          booking. Payment will only be processed once the instructor has
          confirmed your dates.{' '}
        </span>
      </div>
    </div>
  )
}

export default FullLicencePayment
