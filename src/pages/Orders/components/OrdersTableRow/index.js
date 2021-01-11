import React, { useRef } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import styles from './styles.scss'
import ColorTag from 'components/ColorTag'
import ActionThreeDot from 'components/ActionThreeDot'
import { Link } from 'react-router-dom'
import { getCourseTitle } from 'services/course'
import { getCustomerBikeTypeOptions, fetchOrderById } from 'services/order'
import { IconRightArrow, IconEdit, IconTrash, IconPound } from 'assets/icons'
import { isAdmin } from 'services/auth'
import * as orderModule from 'store/order'
import { deleteOrderTraining } from 'store/course'
import { Desktop } from 'common/breakpoints'

const OrdersTableRow = ({
  header,
  record,
  index,
  total,
  onViewOrder,
  onEditOrder,
  onPayOrder,
  isAdmin,
  params,
  onCreateInvoice,
  showNotification,
  deleteOrderTraining,
  fetchFilteredOrders
}) => {
  const menuRef = useRef()

  const isRight = field => {
    return field === 'payment_status' || field === 'status'
  }

  const calcDown = index => {
    return index > 4 && index > total - 5
  }

  const handleEditOrder = () => {
    menuRef.current.hideMenu()
    onEditOrder(record)
  }

  const handleTakePayment = () => {
    menuRef.current.hideMenu()
    onPayOrder(record)
  }

  const handleCreateInvoice = () => {
    menuRef.current.hideMenu()
    onCreateInvoice(record)
  }

  const handleDeleteOrder = async () => {
    menuRef.current.hideMenu()

    if (
      window.confirm(
        `Are you sure you want to delete the training from Order ${record.direct_friendly_id}?`
      )
    ) {
      try {
        const result = await fetchOrderById(record.order.friendly_id)
        await deleteOrderTraining(result.supplier_id, record.id)
        fetchFilteredOrders(params)
      } catch (err) {
        showNotification(
          'Error',
          err.message || 'Failed to delete order',
          'danger'
        )
        console.log("Couldn't delete order.")
      }
      fetchFilteredOrders(params)
    }
  }

  const handleViewOrder = order => {
    menuRef.current.hideMenu()
    onViewOrder(order)
  }

  const canDelete =
    record.order.source === 'DASHBOARD' || record.order.source === 'WIDGET'

  const orderPaid = record.order.payment_status === 'PAID'
  const hasInvoice = !!record.order.stripe_invoice_id

  return (
    <React.Fragment>
      {header.map((item, rIndex) => {
        let cell = null
        if (item.field === 'id') {
          if (record.order) {
            cell = (
              <span className={styles.link} onClick={() => handleEditOrder()}>
                {record.order.direct_friendly_id}
              </span>
            )
          } else {
            cell = null
          }
        } else if (item.field === 'phone') {
          cell = record.customer ? <span>{record.customer.phone}</span> : null
        } else if (item.field === 'course_type') {
          cell = <span>{getCourseTitle(record.course_type)}</span>
        } else if (item.field === 'bike_type') {
          const isFullLicense = record.course_type.startsWith('FULL_LICENCE')
          const options = getCustomerBikeTypeOptions(isFullLicense)
          let text = options[record.bike_type]
          cell = <span>{text}</span>
        } else if (item.field === 'customer') {
          if (record.customer) {
            if (
              record.orderStatus &&
              record.orderStatus.text === 'Cancelled' &&
              record.order.source.startsWith('RIDETO')
            ) {
              cell = null
            } else {
              cell = (
                <Link
                  className={styles.link}
                  to={`/customers/${record.customer.id}`}>
                  {record.customer.full_name}
                </Link>
              )
            }
          }
        } else if (item.field === 'payment_status') {
          if (record.paymentStatus) {
            if (record.orderStatus && record.orderStatus.text === 'Cancelled') {
              cell = null
            } else {
              cell = (
                <ColorTag
                  text={record.paymentStatus.text}
                  type={record.paymentStatus.type}
                />
              )
            }
          }
        } else if (item.field === 'status') {
          if (record.orderStatus) {
            cell = (
              <ColorTag
                text={record.orderStatus.text}
                type={record.orderStatus.type}
              />
            )
          } else {
            cell = null
          }
        } else if (item.field === 'action') {
          cell = (
            <ActionThreeDot ref={menuRef} down={calcDown(index)}>
              <div
                className={styles.menuItem}
                onClick={() => handleViewOrder(record)}>
                <IconRightArrow />
                <span>View Order</span>
              </div>
              <div className={styles.spacing} />
              <div
                className={styles.menuItem}
                onClick={() => handleEditOrder()}>
                <IconEdit />
                <span>Edit Order</span>
              </div>
              {isAdmin && canDelete && (
                <React.Fragment>
                  <div className={styles.spacing} />
                  <div className={styles.menuItem} onClick={handleDeleteOrder}>
                    <IconTrash />
                    <span>Delete Order</span>
                  </div>
                </React.Fragment>
              )}
              <Desktop>
                {!orderPaid && (
                  <React.Fragment>
                    <div className={styles.divider}></div>
                    <div
                      className={styles.menuItem}
                      onClick={handleTakePayment}>
                      <IconPound />
                      <span>Take Payment</span>
                    </div>
                    <Desktop>
                      {!hasInvoice && (
                        <React.Fragment>
                          <div className={styles.divider}></div>
                          <div
                            className={styles.menuItem}
                            onClick={handleCreateInvoice}>
                            <IconPound />
                            <span>Create Invoice</span>
                          </div>
                        </React.Fragment>
                      )}
                    </Desktop>
                  </React.Fragment>
                )}
              </Desktop>
            </ActionThreeDot>
          )
        } else if (item.field === 'training_date') {
          cell = <span className={styles.noBreak}>{record[item.field]}</span>
        } else {
          cell = <span>{record[item.field]}</span>
        }
        return (
          <div
            className={classnames(
              isRight(item.field) && styles.textRight,
              'main-table--cell'
            )}
            key={`${index}-${item.id}-${rIndex}`}>
            {cell}
          </div>
        )
      })}
    </React.Fragment>
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
      deleteOrderTraining,
      fetchFilteredOrders: orderModule.actions.fetchFilteredOrders
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersTableRow)
