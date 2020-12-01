import React from 'react'
import EditOrderFormContainer from 'pages/Calendar/EditOrderFormContainer'

const OrdersPanelDetailForm = ({
  order,
  course,
  onSave,
  onCancel,
  onDelete
}) => {
  const handleSave = (updatedOrder, updateDate = false) => {
    if (updateDate) {
      onSave(updatedOrder, updateDate)
    } else {
      const data = {
        id: updatedOrder.id,
        customer: updatedOrder.customer,
        order: {
          payment_status: updatedOrder.order.payment_status
        },
        status: updatedOrder.status,
        notes: updatedOrder.notes || '',
        requested_date: updatedOrder.requested_date,
        training_date_time: updatedOrder.training_date_time,
        bike_type: updatedOrder.bike_type,
        school_course: updatedOrder.school_course
      }
      onSave(data, updateDate)
    }
  }

  const tmpOrder = course.orders.find(x => x.id === order.id)
  if (tmpOrder) {
    order.notes = tmpOrder.notes
  }

  return (
    <EditOrderFormContainer
      orderDetail={order}
      courseDetail={course}
      course_type={course.course_type.constant}
      date={course.date}
      time={course.time}
      onCancel={onCancel}
      onDelete={onDelete}
      onSave={handleSave}
    />
  )
}

export default OrdersPanelDetailForm
