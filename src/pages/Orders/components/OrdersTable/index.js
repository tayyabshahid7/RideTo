import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import moment from 'moment'
import OrdersTableRow from '../OrdersTableRow'

const OrdersTable = ({ location, history, match, orders }) => {
  const paymentStatusMap = {
    PARTIAL_PAYMENT: {
      text: 'Partially Paid',
      type: 'info'
    },
    PAID: {
      text: 'Paid',
      type: 'success'
    },
    OUTSTANDING: {
      text: 'Outstanding',
      type: 'default'
    }
  }

  const orderStatusMap = {
    CONFIRMED: {
      text: 'Confirmed',
      type: 'success'
    },
    CANCELLED: {
      text: 'Cancelled',
      type: 'default'
    },
    PENDING: {
      text: 'Pending',
      type: 'info'
    }
  }

  console.log(orders)
  orders.forEach(order => {
    order.training_date = moment(order.training_date_time).format('DD MMM YY')
    order.paymentStatus = paymentStatusMap[order.order.payment_status]
    order.orderStatus = orderStatusMap[order.order.status]
  })

  const header = [
    { title: 'Order #', field: 'id', width: '2fr' },
    { title: 'Training Date', field: 'training_date', width: '1.5fr' },
    { title: 'Course', field: 'course_type', width: '3fr' },
    { title: 'Bike Hire', field: 'bike_type', width: '2fr' },
    { title: 'Customer', field: 'customer', width: '2fr' },
    { title: 'Mobile #', field: 'phone', width: '1.5fr' },
    { title: 'Payment Status', field: 'payment_status', width: '2fr' },
    { title: 'Order Status', field: 'status', width: '1.5fr' },
    { title: '', field: 'action', width: '100px' }
  ]

  const tableStyles = {
    gridTemplateColumns: header.map(x => x.width).join(' ')
  }

  const onNewPayment = () => {
    history.push('/invoices/new-payment')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.headerLabel}>Orders</label>
      </div>
      <div
        className={classnames('main-table', styles.tableContainer)}
        style={tableStyles}>
        {header.map((item, index) => (
          <div key={index} className="main-table--cell header-cell">
            {item.title}
          </div>
        ))}

        {orders.map((record, index) => (
          <OrdersTableRow
            key={index}
            header={header}
            record={record}
            index={index}
            total={orders.length}
            onNewPayment={onNewPayment}
          />
        ))}
      </div>
    </div>
  )
}

export default OrdersTable
