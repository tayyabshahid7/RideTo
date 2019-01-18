import React from 'react'
import moment from 'moment'

import styles from './OrderDetails.scss'
import Loading from 'components/Loading'
import { asPoundSterling } from 'services/widget'
import { getCourseTitle } from 'services/course'
import { SHORT_LICENCE_TYPES } from 'common/constants'

const OrderDetails = ({
  course,
  hire,
  supplier,
  isLoading,
  totalPrice,
  isFullLicence,
  trainings
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
  const isBikeHire = hire === 'auto' || hire === 'manual'
  const fullLicenceType =
    isFullLicence && SHORT_LICENCE_TYPES[trainings[0].full_licence_type]

  return (
    <React.Fragment>
      <div className={styles.orderDetails}>
        <div className={styles.school}>
          {course.course_type.name} {fullLicenceType}
          {isFullLicence && ' '}
          {supplier.town}
        </div>

        {isFullLicence ? (
          trainings.map((training, index) => {
            const {
              requested_date,
              requested_time,
              school_course_id
            } = training
            return (
              <div className={styles.fullLicenceDate} key={school_course_id}>
                <div>
                  <b>
                    {getCourseTitle(training.course_type).replace(
                      'Full Licence ',
                      ''
                    )}
                  </b>
                </div>
                <div>
                  {moment(`${requested_date}T${requested_time}`).format(
                    'h:mm a ddd D, MMMM'
                  )}
                </div>
              </div>
            )
          })
        ) : (
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
            {isBikeHire && <li>Bike and helmet hire (Manual Motorcycle)</li>}
            <li>Insurance</li>
          </ul>
        </div>
      </div>
      <div className={styles.price}>Total: {displayPrice}</div>
    </React.Fragment>
  )
}

export default OrderDetails
