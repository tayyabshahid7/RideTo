import React from 'react'
import moment from 'moment'

import styles from './OrderDetails.scss'
import { getStartInTime } from 'services/widget'

const OrderDetails = ({ course, supplier }) => {
  const dateStr = `${course.date}T${course.time}`
  const startTime = moment(dateStr, 'YYYY-MM-DDTh:mm:ss')
  const startIn = getStartInTime(moment(), startTime)

  return (
    <div className={styles.orderDetails}>
      <h3>Your Training</h3>
      <hr />
      <div className={styles.starts}>
        Course Starts In: <span>{startIn}</span>
      </div>

      <div>
        {course.course_type.name} {supplier.town}
      </div>
      <div>{startTime.format('dddd MMMM Do YYYY, h:mm:ss a')}</div>
      <div>
        {supplier.address_1} {supplier.town} {supplier.postcode}
      </div>

      <h3>Includes</h3>
      <ul className={styles.checklist}>
        <li>Bike and helmet hire (Manual Motorcycle)</li>
        <li>Insurance</li>
      </ul>

      <div className={styles.price}>Total: £TODO</div>
    </div>
  )
}

export default OrderDetails
