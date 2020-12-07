import React, { useRef } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import styles from './styles.scss'
import ColorTag from 'components/ColorTag'
import ActionThreeDot from 'components/ActionThreeDot'
import { Link } from 'react-router-dom'
import { getCourseTitle } from 'services/course'
import { getCustomerBikeTypeOptions } from 'services/order'
import { IconRightArrow, IconEdit, IconTrash, IconPound } from 'assets/icons'
import { isAdmin } from 'services/auth'
import * as orderModule from 'store/order'
import { deleteOrderTraining } from 'store/course'

const OrdersTableRow = ({
  header,
  record,
  index,
  total,
  onViewOrder,
  onEditOrder,
  isAdmin,
  params,
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

  const handleEditOrder = order => {
    menuRef.current.hideMenu()
    onEditOrder(order)
  }

  const handleDeleteOrder = order => {
    menuRef.current.hideMenu()

    if (
      window.confirm(
        `Are you sure you want to delete the training from Order ${order.direct_friendly_id}?`
      )
    ) {
      // try {
      //   await deleteOrderTraining(course.supplier, order.id)
      //   fetchFilteredOrders(params)
      //   handleBack()
      // } catch {
      //   console.log("Couldn't delete order.")
      // }
      fetchFilteredOrders(params)
    }
  }

  const handleViewOrder = order => {
    menuRef.current.hideMenu()
    onViewOrder(order)
  }

  const canDelete =
    record &&
    record.order &&
    (record.order.source === 'DASHBOARD' || record.order.source === 'WIDGET')

  return (
    <React.Fragment>
      {header.map((item, rIndex) => {
        let cell = null
        if (item.field === 'id') {
          if (record.order) {
            cell = (
              <Link to={`/orders/${record.order.direct_friendly_id}`}>
                {record.order.direct_friendly_id}
              </Link>
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
            cell = (
              <Link to={`/customers/${record.customer.id}`}>
                {record.customer.full_name}
              </Link>
            )
          }
        } else if (item.field === 'payment_status') {
          if (record.paymentStatus) {
            cell = (
              <ColorTag
                text={record.paymentStatus.text}
                type={record.paymentStatus.type}
              />
            )
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
                onClick={() => handleEditOrder(record)}>
                <IconEdit />
                <span>Edit Order</span>
              </div>
              {isAdmin && canDelete && (
                <React.Fragment>
                  <div className={styles.spacing} />
                  <div
                    className={styles.menuItem}
                    onClick={() => handleDeleteOrder(record)}>
                    <IconTrash />
                    <span>Delete Order</span>
                  </div>
                </React.Fragment>
              )}
              <div className={styles.divider}></div>
              <div className={styles.menuItem}>
                <IconPound />
                <span>Create Invoice</span>
              </div>
            </ActionThreeDot>
          )
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
