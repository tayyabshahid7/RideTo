import React from 'react'

import SchoolSelect from 'components/SchoolSelect/SchoolSelect'

import styles from './BookingOptions.scss'

const BookingOptions = ({ profile, profiles, onChangeProfile }) => {
  return (
    <div className={styles.bookingOptions}>
      <h2>Booking Options</h2>

      <SchoolSelect
        schools={profiles}
        selected={profile.slug}
        valueField="slug"
        onChange={onChangeProfile}
      />
    </div>
  )
}

export default BookingOptions
