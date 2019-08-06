import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

function BikeSummary({ bike: { slug, images, name, price, desc, bookLink } }) {
  const image = images[0]

  return (
    <div className={styles.bikeSummary}>
      <Link to={`/bike-reviews/${slug}/`}>
        <img
          className={styles.image}
          src={image}
          alt="Bike"
          width="317"
          height="205"
        />
      </Link>
      <div className={styles.info}>
        <div className={styles.header}>
          <span>{name}</span>
          <div className={styles.price}>
            <span className={styles.rrp}>RRP</span>£
            {(price / 100).toLocaleString()}
          </div>
        </div>
        <div className={styles.description}>{desc}</div>
        <a
          className={classnames(styles.button, styles.buttonPrimary)}
          href={bookLink}>
          Book test ride
        </a>
        <Link
          className={classnames(styles.button)}
          to={`/bike-reviews/${slug}/`}>
          Read review
        </Link>
      </div>
    </div>
  )
}

export default BikeSummary