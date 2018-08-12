import React from 'react'
import moment from 'moment'

const OrderDetails = ({ course, supplier }) => {
  const dateStr = `${course.date}T${course.time}`
  const startTime = moment(dateStr, 'YYYY-MM-DDTh:mm:ss')

  return (
    <div>
      <h2>Your Training</h2>
      <hr />
      <div>
        {course.course_type.name} {supplier.town}
      </div>
      <div>{startTime.format('dddd MMMM Do YYYY, h:mm:ss a')}</div>
      <div>
        {supplier.address_1} {supplier.town} {supplier.postcode}
      </div>
    </div>
  )
}

export default OrderDetails
