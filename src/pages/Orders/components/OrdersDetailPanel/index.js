import React, { useRef, useEffect, useState } from 'react'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import { getSingleCourse, resetSingleCourse } from 'store/course'
import { getPaymentStatus } from 'services/order'
import ColorTag from 'components/ColorTag'
import CourseSummary from 'components/Calendar/CoursesPanel/CourseSummary'
import { Button } from 'components/ConnectForm'
import { isAdmin } from 'services/auth'

const OrdersDetailPanel = ({
  course,
  orders,
  history,
  match,
  schools,
  instructors,
  getSingleCourse,
  isAdmin,
  resetSingleCourse
}) => {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    resetSingleCourse()
  }, [])

  useEffect(() => {
    if (order) {
      getSingleCourse({ courseId: order.school_course })
    }
  }, [order])

  const handleBack = () => {
    history.push('/orders')
  }

  let orderId = null
  if (match.params && match.params.id) {
    orderId = parseInt(match.params.id)
  }

  if (!orderId) {
    handleBack()
    return null
  }

  const tmpOrder = orders.find(x => x.id === orderId)
  if (!tmpOrder) {
    handleBack()
    return null
  }

  if (!order) {
    setOrder(tmpOrder)
  }

  if (!order || !course) {
    return null
  }

  const paymentStatus = getPaymentStatus(order.order.payment_status)

  console.log(order, course)
  let customerName = ' '
  if (order.customer) {
    customerName = order.customer.full_name
  }
  let friendlyId = orderId
  if (order.order) {
    friendlyId = order.order.direct_friendly_id
  }

  const canDelete =
    order &&
    order.order &&
    (order.order.source === 'DASHBOARD' || order.order.source === 'WIDGET')

  const onEditOrder = () => {}

  const onViewInvoice = () => {}

  const onAddPayment = () => {}

  const onDelete = () => {}

  return (
    <div className={styles.container}>
      <DateHeading
        title={customerName}
        subtitle={friendlyId}
        onBack={handleBack}
      />
      <div className={styles.priceLine}>
        <span className={styles.price}>
          £{(course.pricing.price / 100).toFixed(2)}
        </span>
        <ColorTag text={paymentStatus.text} type={paymentStatus.type} />
      </div>
      <CourseSummary
        course={course}
        schools={schools}
        instructors={instructors}
        embedded={false}
      />
      <div className={styles.actions}>
        <Button color="primary" onClick={onEditOrder}>
          Edit Order
        </Button>
        <Button color="white" onClick={onViewInvoice}>
          View Invoice
        </Button>
        <Button color="white" onClick={onAddPayment}>
          Add Payment
        </Button>
        {isAdmin && (
          <React.Fragment>
            <div className={styles.divider}></div>
            <Button color="danger" disabled={!canDelete} onClick={onDelete}>
              Delete
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.course.single.loading,
    course: state.course.single.course,
    instructors: state.instructor.instructors,
    schools: state.auth.user.suppliers,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      resetSingleCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersDetailPanel)
