import React, { useState } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import moment from 'moment'
import OrdersTableRow from '../OrdersTableRow'
import { Button, ConnectInput } from 'components/ConnectForm'
import {
  IconSideFilter,
  IconAngleRight,
  IconAngleLeft,
  IconLongArrowRight
} from 'assets/icons'
import { fetchOrderById, getPaymentStatus } from 'services/order'
import InvoiceForm from 'pages/Invoices/components/InvoiceForm'
import { Mobile } from 'common/breakpoints'

const OrdersTable = ({
  location,
  history,
  match,
  orders,
  page,
  total,
  ordering,
  orderDir,
  pageSize = 50,
  onPage,
  onSort,
  onOpenFilter,
  onRefresh
}) => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [orderDetail, setOrderDetail] = useState(false)

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
    },
    CREATED: {
      text: 'Created',
      type: 'default'
    },
    FAILED: {
      text: 'Failed',
      type: 'danger'
    }
  }

  orders.forEach(order => {
    order.training_date = order.training_date_time
      ? moment(order.training_date_time).format('DD MMM YY')
      : ''
    order.paymentStatus = getPaymentStatus(order.order.payment_status)
    order.orderStatus = orderStatusMap[order.order.status]
    if (!order.orderStatus) {
      order.orderStatus = {
        text:
          order.order.status.substr(0, 1).toUpperCase() +
          order.order.status.substr(1).toLowerCase(),
        type: 'default'
      }
    }
  })

  const header = [
    {
      title: 'Order #',
      sortField: 'order__friendly_id',
      field: 'id',
      width: '2fr'
    },
    {
      title: 'Training Date',
      sortField: 'training_date_time',
      field: 'training_date',
      width: '1.5fr'
    },
    {
      title: 'Course',
      sortField: 'course_type__constant',
      field: 'course_type',
      width: '3fr'
    },
    { title: 'Bike Hire', field: 'bike_type', width: '2fr' },
    {
      title: 'Customer',
      sortField: 'order__customer__first_name',
      field: 'customer',
      width: '2fr'
    },
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

  const onViewOrder = order => {
    history.push(`/orders/detail/${order.id}`)
  }

  const onEditOrder = order => {
    history.push(`/orders/edit/${order.id}`)
  }

  const handlePageChange = event => {
    event.persist()
    pageChanged(parseInt(event.target.value))
  }

  const pageChanged = page => {
    page = Math.max(1, page)
    page = Math.min(Math.ceil(total / pageSize), page)
    onPage(page)
  }

  const onCreateInvoice = async order => {
    const result = await fetchOrderById(order.order.friendly_id)
    // console.log(order)

    const tmp = {
      customer: `${order.customer.first_name} ${order.customer.last_name}`,
      customerId: order.customer.id,
      supplierId: result.supplier_id,
      courseTypeId: result.course_type_id,
      order: order.order.direct_friendly_id,
      orderId: order.order.friendly_id,
      customerEmail: order.customer.email
    }

    setOrderDetail(tmp)
    setShowInvoiceForm(true)
  }

  const handleSort = column => {
    if (column.sortField) {
      if (ordering !== column.sortField) {
        onSort(column.sortField, true)
        return
      }

      const dir = !!orderDir
      onSort(column.sortField, dir)
    }
  }

  const handleInvoiceSent = () => {
    setShowInvoiceForm(false)
    onRefresh()
  }

  const handleToggleFitler = () => {
    onOpenFilter()
  }

  const showCount = Math.min(total, page * pageSize)
  const statsText = `Showing ${(page - 1) * pageSize +
    1} to ${showCount} of ${total} orders`

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Mobile>
          <div
            id="btn-filter-toggle"
            onClick={handleToggleFitler}
            className={classnames('icon-button')}>
            <IconSideFilter />
          </div>
        </Mobile>
        <label className={styles.headerLabel}>Orders</label>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableInner}>
          <div
            className={classnames('main-table', 'table--bordered')}
            style={tableStyles}>
            {header.map((item, index) => (
              <div
                key={index}
                className={classnames('main-table--cell', 'header-cell')}
                onClick={() => handleSort(item)}>
                {item.title}
                {ordering === item.sortField && (
                  <span
                    className={classnames(
                      styles.orderingIcon,
                      orderDir && styles.iconDown
                    )}>
                    <IconLongArrowRight />
                  </span>
                )}
              </div>
            ))}

            {orders.map((record, index) => (
              <React.Fragment>
                <OrdersTableRow
                  key={index}
                  header={header}
                  record={record}
                  index={index}
                  total={orders.length}
                  onViewOrder={onViewOrder}
                  onEditOrder={onEditOrder}
                  onCreateInvoice={onCreateInvoice}
                />
              </React.Fragment>
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
      </div>
      {showInvoiceForm && (
        <InvoiceForm
          onSent={handleInvoiceSent}
          orderDetail={orderDetail}
          onClose={() => setShowInvoiceForm(false)}
        />
      )}
    </div>
  )
}

export default OrdersTable
