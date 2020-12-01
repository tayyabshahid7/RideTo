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
import { getPaymentStatus } from 'services/order'
import ColorTag from 'components/ColorTag'
import CourseSummary from 'components/Calendar/CoursesPanel/CourseSummary'
import OrdersPanelDetailForm from '../OrdersPanelDetailForm'
import { Button } from 'components/ConnectForm'
import LoadingMask from 'components/LoadingMask'
import Loading from 'components/Loading'
import { isAdmin } from 'services/auth'

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
  isEdit = false,
  params
}) => {
  const [order, setOrder] = useState(null)
  const [editMode, setEditMode] = useState(isEdit)

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
    return <Loading loading />
  }

  const tmpOrder = orders.find(x => x.id === orderId)
  if (!tmpOrder) {
    handleBack()
    return <Loading loading />
  }

  if (!order) {
    setOrder(tmpOrder)
  }

  if (!order || !course) {
    return <Loading loading />
  }

  const paymentStatus = getPaymentStatus(order.order.payment_status)

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

  const onEditOrder = () => {
    setEditMode(true)
  }

  const onViewInvoice = () => {}

  const onAddPayment = () => {}

  const onSave = async (updatedOrder, updateDate = false) => {
    const tmp = Object.assign({}, updatedOrder)
    await updateOrder({
      trainingId: order.id,
      order: {
        ...tmp,
        full_edit: updateDate
      }
    })

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
      } catch {
        console.log("Couldn't delete order.")
      }
    }
  }

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
      fetchFilteredOrders: orderModule.actions.fetchFilteredOrders
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersDetailPanel)
