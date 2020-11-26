import React from 'react'
import EditOrderFormContainer from 'pages/Calendar/EditOrderFormContainer'

const OrdersPanelDetailForm = ({ order, course, onCancel, onDelete }) => {
  const handleUpdateOrder = () => {}

  return (
    <EditOrderFormContainer
      orderDetail={order}
      course_type={course.course_type.constant}
      date={course.date}
      time={course.time}
      onCancel={onCancel}
      onDelete={onDelete}
      onSave={handleUpdateOrder}
    />
  )
}

export default OrdersPanelDetailForm
