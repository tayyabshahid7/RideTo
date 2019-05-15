import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function BikeSummary({
  bike: { image, name, price, desc, bookLink, reviewLink }
}) {
  return (
    <div className={styles.bikeSummary}>
      <img className={styles.image} src={image} alt="Bike" />
      <div className={styles.info}>
        <div className={styles.header}>
          <span>{name}</span>
          <span>RRP £{price / 100}</span>
        </div>
        <div className={styles.description}>{desc}</div>
        <a
          className={classnames(styles.button, styles.buttonPrimary)}
          href={bookLink}>
          Book test ride
        </a>
        <a className={classnames(styles.button)} href={reviewLink}>
          Read review
        </a>
      </div>
    </div>
  )
}

export default BikeSummary
