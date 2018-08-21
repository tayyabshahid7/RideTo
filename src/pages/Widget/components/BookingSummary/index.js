import React from 'react'
import moment from 'moment'

import styles from './BookingSummary.scss'
import Loading from 'components/Loading'

const BookingSummary = ({ supplier, course, hire, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading loading={true} />
      </div>
    )
  }

  const dateStr = `${course.date}T${course.time}`
  const startTime = moment(dateStr, 'YYYY-MM-DDTh:mm:ss')

  return (
    <div className={styles.bookingSummary}>
      <div className={styles.address}>
        {supplier.address_1} {supplier.postcode}
      </div>
      <div className={styles.courseType}>{course.course_type.name}</div>
      <div className={styles.startTime}>
        {startTime.format('dddd MMMM Do YYYY h:mm a')}
      </div>
      <div className={styles.bikeHire}>Bike hire: {hire}</div>
    </div>
  )
}

export default BookingSummary
