import React, { useRef } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import ColorTag from 'components/ColorTag'
import ActionThreeDot from 'components/ActionThreeDot'
import { Link } from 'react-router-dom'
import { getCourseTitle } from 'services/course'
import { getCustomerBikeTypeOptions } from 'services/order'
import { IconRightArrow, IconEdit, IconTrash, IconPound } from 'assets/icons'

const OrdersTableRow = ({
  header,
  record,
  index,
  total,
  onViewOrder,
  onEditOrder
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

  const handleViewOrder = order => {
    menuRef.current.hideMenu()
    onViewOrder(order)
  }

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
              <div className={styles.spacing} />
              <div className={styles.menuItem}>
                <IconTrash />
                <span>Delete Order</span>
              </div>
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

export default OrdersTableRow
