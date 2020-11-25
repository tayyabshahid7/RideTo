import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import moment from 'moment'
import OrdersTableRow from '../OrdersTableRow'
import { Button, ConnectInput } from 'components/ConnectForm'
import { IconAngleRight, IconAngleLeft } from 'assets/icons'

const OrdersTable = ({
  location,
  history,
  match,
  orders,
  page,
  total,
  onPage
}) => {
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
    gridTemplateColumns: header.map(x => x.width).join(' '),
    gridTemplateRows: `repeat(${orders.length + 1}, auto) 1fr`
  }

  const statsStyle = {
    gridColumnStart: 1,
    gridColumnEnd: header.length + 1
  }

  const onNewPayment = () => {
    history.push('/invoices/new-payment')
  }

  const handlePageChange = event => {
    event.persist()
    pageChanged(parseInt(event.target.value))
  }

  const pageChanged = page => {
    page = Math.max(1, page)
    page = Math.min(Math.ceil(total / 25), page)
    console.log(page)
    onPage(page)
  }

  const statsText = `Showing ${(page - 1) * 25 + 1} to ${page *
    25} of ${total} orders`

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
        <div style={statsStyle}>
          <div className={styles.tableStats}>
            <span className={styles.statsText}>{statsText}</span>
            <div className={styles.pagination}>
              <Button
                color="white"
                className={styles.pageButton}
                onClick={() => pageChanged(page - 1)}>
                <IconAngleLeft />
              </Button>
              <div className={styles.pageInput}>
                <ConnectInput
                  basic
                  value={page}
                  type="number"
                  onChange={handlePageChange}
                />
              </div>
              <Button
                color="white"
                className={styles.pageButton}
                onClick={() => pageChanged(page + 1)}>
                <IconAngleRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersTable
