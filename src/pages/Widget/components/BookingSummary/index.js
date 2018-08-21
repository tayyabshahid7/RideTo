import React from 'react'
import moment from 'moment'

import { getMotorbikeLabel } from 'services/widget'
import styles from './BookingSummary.scss'
import Loading from 'components/Loading'
import { getTotalOrderPrice, asPoundSterling } from 'services/widget'

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
  const displayPrice = asPoundSterling(getTotalOrderPrice(course, hire))

  return (
    <div className={styles.bookingSummary}>
      <h3 className={styles.heading}>Your Training</h3>
      <div className={styles.details}>
        <div className={styles.address}>
          {supplier.address_1} {supplier.postcode}
        </div>
        <div className={styles.courseType}>{course.course_type.name}</div>
        <div className={styles.startTime}>
          {startTime.format('dddd MMMM Do YYYY h:mm a')}
        </div>
        <div className={styles.bikeHire}>{getMotorbikeLabel(hire)}</div>
      </div>
      <div className={styles.price}>Total: {displayPrice}</div>
    </div>
  )
}

export default BookingSummary
