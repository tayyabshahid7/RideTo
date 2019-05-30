import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

function BikeSummary({
  bike: { id, images, name, price, desc, bookLink, reviewLink }
}) {
  const image = images[0]

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
        <Link
          className={classnames(styles.button)}
          to={`/bike-sales/bike/${id}`}>
          Read review
        </Link>
      </div>
    </div>
  )
}

export default BikeSummary
