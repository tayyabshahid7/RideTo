import React, { useState } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import _ from 'lodash'

import { Button } from 'components/ConnectForm'
import InvoicesTableRow from '../InvoiceTableRow'
import InvoiceForm from '../InvoiceForm'
import { updateInvoice } from 'services/invoice'
import { IconLongArrowRight } from 'assets/icons'

import styles from './styles.scss'

const InvoicesTable = ({
  invoices,
  location,
  history,
  match,
  sorting,
  sortDir,
  onSort,
  onDelete,
  onLoadMore,
  loadedAll,
  onRefresh,
  showNotification,
  setUpdating
}) => {
  const [showForm, setShowForm] = useState(false)
  const [invoice, setInvoice] = useState(null)

  const header = [
    { title: 'Invoice #', sortField: 'number', field: 'id', width: '2fr' },
    { title: 'Amount', sortField: 'total', field: 'amount', width: '1.5fr' },
    { title: 'Status', sortField: 'status', field: 'status', width: '2fr' },
    { title: 'Order', sortField: 'orderSort', field: 'orderId', width: '2fr' },
    {
      title: 'Customer',
      sortField: 'customer',
      field: 'customer',
      width: '3fr'
    },
    {
      title: 'Due',
      sortField: 'dueDateSort',
      field: 'dueDate',
      width: '1.5fr'
    },
    { title: '', field: 'action', width: '100px' }
  ]

  let records = invoices.map(x => ({
    id: x.id,
    number: x.number,
    amount: '£' + (x.total / 100).toFixed(),
    status: x.status.substr(0, 1).toUpperCase() + x.status.substr(1),
    orderId: x.metadata.order,
    orderSort: x.metadata.order_friendly_id || x.metadata.order,
    customer: x.customer_name || x.customer_email,
    customerId: x.metadata.customer_id,
    dueDate: moment(new Date(x.due_date * 1000)).format('DD MMM YYYY'),
    dueDateSort: moment(new Date(x.due_date * 1000)).format('YYYY-MM-DD'),
    original: x
  }))

  if (sorting) {
    records = _.sortBy(records, sorting)

    if (sortDir) {
      records.reverse()
    }
  }

  const tableStyles = {
    gridTemplateColumns: header.map(x => x.width).join(' '),
    gridTemplateRows: `repeat(${records.length + 1}, auto) 1fr`
  }

  const onNewPayment = invoice => {
    history.push('/invoices/new-payment/' + invoice.id)
  }

  const showInvoiceForm = () => {
    setInvoice(null)
    setShowForm(true)
  }

  const handleInvoiceSent = () => {
    setShowForm(false)
    onRefresh()
  }

  const handleEdit = invoice => {
    setInvoice(invoice.original)
    setShowForm(true)
  }

  const handleSend = async invoice => {
    setUpdating(true)
    const tmp = invoice.original
    const data = {
      supplier: tmp.metadata.supplier_id,
      course_id: tmp.metadata.course_id,
      order: tmp.metadata.order,
      send_invoice: true
    }
    try {
      await updateInvoice(tmp.id, data)
    } catch (err) {
      console.log(err)
      showNotification('Error', 'Failed to update invoice details', 'danger')
    }
    setUpdating(false)

    onRefresh()
  }

  const handleSort = column => {
    if (column.sortField) {
      if (sorting !== column.sortField) {
        onSort(column.sortField, true)
        return
      }

      const dir = !sortDir
      onSort(column.sortField, dir)
    }
  }

  const handleShowOrder = invoice => {
    history.push(`/invoices/orders/edit/${invoice.orderId}`)
  }

  const statsStyle = {
    gridColumnStart: 1,
    gridColumnEnd: header.length + 1
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.headerLabel}>Invoices</label>
        <Button
          type="submit"
          color="primary"
          className={styles.headerButton}
          onClick={showInvoiceForm}>
          <span className={styles.plusIcon}></span>
          New Invoice
        </Button>
      </div>
      <div
        className={classnames('main-table', styles.tableContainer)}
        style={tableStyles}>
        {header.map((item, index) => (
          <div
            key={index}
            className="main-table--cell header-cell"
            onClick={() => handleSort(item)}>
            {item.title}
            {sorting === item.sortField && (
              <span
                className={classnames(
                  styles.sortingIcon,
                  !sortDir && styles.iconDown
                )}>
                <IconLongArrowRight />
              </span>
            )}
          </div>
        ))}

        {records.map((record, index) => (
          <InvoicesTableRow
            key={index}
            header={header}
            record={record}
            index={index}
            history={history}
            total={records.length}
            onNewPayment={onNewPayment}
            onDelete={onDelete}
            onEdit={handleEdit}
            onSend={handleSend}
            onShowOrder={handleShowOrder}
          />
        ))}
        <div style={statsStyle}>
          <div className={styles.tableStats}>
            {!loadedAll && (
              <Button color="white" onClick={onLoadMore}>
                Load More
              </Button>
            )}
          </div>
        </div>
      </div>
      {showForm && (
        <InvoiceForm
          onSent={handleInvoiceSent}
          invoice={invoice}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default InvoicesTable
