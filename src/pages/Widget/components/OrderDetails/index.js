import React from 'react'
import moment from 'moment'

import styles from './OrderDetails.scss'
import Loading from 'components/Loading'
import { getTotalOrderPrice, asPoundSterling } from 'services/widget'
import { BikeHires } from 'common/info'

const OrderDetails = ({ course, hire, supplier, isLoading }) => {
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
  const isBikeHire = hire === 'auto' || hire === 'manual'

  return (
    <React.Fragment>
      <div className={styles.orderDetails}>
        <div className={styles.school}>
          {course.course_type.name} {supplier.town}
        </div>

        <div className={styles.date}>
          <div>
            Start: <strong>{startTime.format('h:mm a')}</strong>
          </div>
          <div>{startTime.format('dddd MMMM Do YYYY')}</div>
        </div>

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
      <div className={styles.price}>Total: {displayPrice}</div>
    </React.Fragment>
  )
}

export default OrderDetails
