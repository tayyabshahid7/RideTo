import React from 'react'
import moment from 'moment'

import styles from './OrderDetails.scss'
import Loading from 'components/Loading'

import { SHORT_LICENCE_TYPES } from 'common/constants'
import { asPoundSterling } from 'services/widget'
import { BikeHires } from 'common/info'
import { BIKE_HIRE } from 'common/constants'

const OrderDetails = ({
  course,
  hire,
  supplier,
  isLoading,
  totalPrice,
  isFullLicence,
  trainings,
  discount
}) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading loading={true} />
      </div>
    )
  }

  const dateStr = `${course.date}T${course.time}`
  const startTime = moment(dateStr, 'YYYY-MM-DDTh:mm:ss')
  const displayPrice = asPoundSterling(totalPrice)
  const isBikeHire = hire !== BIKE_HIRE.NO
  const fullLicenceType =
    isFullLicence && SHORT_LICENCE_TYPES[trainings[0].full_licence_type]

  return (
    <React.Fragment>
      <div className={styles.orderDetails}>
        <div className={styles.school}>
          {course.course_type.name} {fullLicenceType}
          {isFullLicence && ' '}
          {supplier.town}
          {isFullLicence && ` (${trainings[0].package_hours} hours)`}
        </div>

        {!isFullLicence && (
          <div className={styles.date}>
            <div>
              Start: <strong>{startTime.format('h:mm a')}</strong>
            </div>
            <div>{startTime.format('dddd MMMM Do YYYY')}</div>
          </div>
        )}

        <div className={styles.addressDetails}>
          <div>
            {supplier.address_1} {supplier.town} {supplier.postcode}
          </div>
        </div>

        <div className={styles.includes}>
          <h3 className={styles.heading}>Includes</h3>
          <ul className={styles.checklist}>
            {isBikeHire && (
              <li>
                Bike and helmet hire (
                {BikeHires.find(bike => bike.value === hire).title} Motorcycle)
              </li>
            )}
            <li>Insurance</li>
          </ul>
        </div>
      </div>
      {discount > 0 && (
        <div className={styles.discountRow}>
          Discount: -{asPoundSterling(discount)}
        </div>
      )}
      <div className={styles.price}>Total: {displayPrice}</div>
    </React.Fragment>
  )
}

export default OrderDetails
