import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import {
  getSingleCourse,
  resetSingleCourse,
  deleteOrderTraining,
  updateOrder
} from 'store/course'
import * as orderModule from 'store/order'
import OrderPriceLine from 'components/Calendar/CoursesPanel/OrderPriceLine'
import CourseSummary from 'components/Calendar/CoursesPanel/CourseSummary'
import OrderPaymentContainer from 'pages/Invoices/components/OrderPaymentContainer'
import OrdersPanelDetailForm from '../OrdersPanelDetailForm'
import { Button } from 'components/ConnectForm'
import LoadingMask from 'components/LoadingMask'
import Loading from 'components/Loading'
import { isAdmin } from 'services/auth'
import { actions as notifyActions } from 'store/notification'

const OrdersDetailPanel = ({
  course,
  orders,
  history,
  match,
  schools,
  instructors,
  loading,
  isAdmin,
  getSingleCourse,
  resetSingleCourse,
  updateOrder,
  deleteOrderTraining,
  fetchFilteredOrders,
  showNotification,
  isEdit = false,
  isPayment = false,
  isInvoice = false,
  trainingId, // from invoice page
  params
}) => {
  const [order, setOrder] = useState(null)
  const [editMode, setEditMode] = useState(isEdit)
  const [paymentMode, setPaymentMode] = useState(isPayment)

  useEffect(() => {
    resetSingleCourse()
  }, [])

  useEffect(() => {
    if (order) {
      getSingleCourse({ courseId: order.school_course })
    }
  }, [order])

  const handleBack = () => {
    history.push(isInvoice ? '/invoices' : '/orders')
  }

  let orderId = trainingId
  if (!orderId && match.params && match.params.id) {
    orderId = parseInt(match.params.id)
  }

  if (!orderId) {
    handleBack()
    return <Loading loading />
  }

  const tmpOrder = orders.find(x => x.id === orderId)
  if (!tmpOrder) {
    handleBack()
    return <Loading loading />
  } else if (!tmpOrder.school_course) {
    showNotification('Error', 'Order course is null', 'danger')
    handleBack()
    return <Loading loading />
  }

  if (!order) {
    setOrder(tmpOrder)
  }

  if (!order || !course) {
    return <Loading loading />
  }

  let customerName = ' '
  if (order.customer) {
    customerName = order.customer.full_name
  }
  let friendlyId = orderId
  if (order.order) {
    friendlyId = order.order.direct_friendly_id
  }

  const onPaid = () => {
    const tmp = Object.assign({}, order)
    tmp.order.payment_status = 'PAID'
    setOrder(tmp)
  }

  const canDelete =
    order.order &&
    (order.order.source === 'DASHBOARD' || order.order.source === 'WIDGET')

  const onEditOrder = () => {
    setEditMode(true)
  }

  // const onViewInvoice = () => {}

  const onAddPayment = () => {
    setPaymentMode(true)
  }

  const onSave = async (updatedOrder, updateDate = false) => {
    const tmp = Object.assign({}, updatedOrder)
    try {
      await updateOrder({
        trainingId: order.id,
        order: {
          ...tmp,
          full_edit: updateDate
        }
      })
      fetchFilteredOrders(params)
      handleBack()
    } catch (err) {
      showNotification('Error', err.message || 'Failed to save order', 'danger')
    }
  }

  const handleCloseAndRefresh = () => {
    fetchFilteredOrders(params)
    handleBack()
  }

  const onDelete = async () => {
    if (!canDelete) {
      return
    }

    if (
      window.confirm(
        `Are you sure you want to delete the training from Order ${order.direct_friendly_id}?`
      )
    ) {
      try {
        await deleteOrderTraining(course.supplier, order.id)
        fetchFilteredOrders(params)
        handleBack()
      } catch (err) {
        showNotification(
          'Error',
          err.message || 'Failed to delete order',
          'danger'
        )
      }
    }
  }

  const orderPaid = order.order && order.order.payment_status === 'PAID'
  // const hasInvoice = order.order && !!order.order.stripe_invoice_id
  const payOrderId = order.order ? order.order.friendly_id : null
  let amount = course.pricing ? course.pricing.price : 0
  const paymentValid = payOrderId && amount

  let orderResponse = {}
  if (course && course.orders) {
    const courseOrder = course.orders.find(x => x.id === order.id)
    if (courseOrder) {
      if (courseOrder.package_price) {
        amount = courseOrder.package_price
        orderResponse.package = {
          price: (amount / 100).toFixed(2)
        }
      }
    }
  }

  const renderHeader = () => {
    return (
      <React.Fragment>
        <DateHeading
          title={customerName}
          subtitle={friendlyId}
          onBack={handleBack}
        />
        <OrderPriceLine
          order={order}
          orderDetail={orderResponse}
          course={course}
        />
      </React.Fragment>
    )
  }

  if (paymentValid && paymentMode) {
    return (
      <div className={styles.container}>
        {renderHeader()}
        <OrderPaymentContainer
          customer={order.customer}
          amount={amount}
          orderId={payOrderId}
          onPaid={onPaid}
          onRefresh={handleCloseAndRefresh}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {renderHeader()}
      <CourseSummary
        course={course}
        schools={schools}
        instructors={instructors}
        embedded={false}
      />
      {editMode ? (
        <OrdersPanelDetailForm
          onCancel={() => setEditMode(false)}
          onDelete={onDelete}
          onSave={onSave}
          order={order}
          course={course}
        />
      ) : (
        <div className={styles.actions}>
          <Button color="primary" onClick={onEditOrder}>
            Edit Order
          </Button>
          {/* {hasInvoice && (
            <Button color="white" onClick={onViewInvoice}>
              View Invoice
            </Button>
          )} */}
          {!trainingId && paymentValid && !orderPaid && (
            <Button color="white" onClick={onAddPayment}>
              Add Payment
            </Button>
          )}

          {isAdmin && (
            <React.Fragment>
              <div className={styles.divider}></div>
              <Button color="danger" disabled={!canDelete} onClick={onDelete}>
                Delete
              </Button>
            </React.Fragment>
          )}
        </div>
      )}
      <LoadingMask loading={loading} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.course.single.loading,
    course: state.course.single.course,
    instructors: state.instructor.instructors,
    schools: state.auth.user.suppliers,
    params: state.order.orders.params,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      resetSingleCourse,
      deleteOrderTraining,
      updateOrder,
      fetchFilteredOrders: orderModule.actions.fetchFilteredOrders,
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersDetailPanel)
