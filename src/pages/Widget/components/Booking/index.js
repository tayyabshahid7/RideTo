import React from 'react'
import { Link } from 'react-router-dom'

import BookingOptions from 'pages/Widget/components/BookingOptions'

import styles from './Booking.scss'

const Booking = ({ url, profile, profiles }) => {
  const link = `${url}options`

  return (
    <div className={styles.booking}>
      <div className={styles.options}>
        <BookingOptions profile={profile} profiles={profiles} />
      </div>
      <div className={styles.continue}>
        <Link to={link}>Continue</Link>
      </div>
    </div>
  )
}

export default Booking
