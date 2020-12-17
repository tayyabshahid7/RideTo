import React, { useState } from 'react'
import classnames from 'classnames'
import moment from 'moment'

import { Button } from 'components/ConnectForm'
import InvoicesTableRow from '../InvoiceTableRow'
import InvoiceForm from '../InvoiceForm'
import { updateInvoice } from 'services/invoice'

import styles from './styles.scss'

const InvoicesTable = ({
  invoices,
  location,
  history,
  match,
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
    { title: 'Invoice #', field: 'id', width: '2fr' },
    { title: 'Amount', field: 'amount', width: '1.5fr' },
    { title: 'Status', field: 'status', width: '2fr' },
    { title: 'Order', field: 'orderId', width: '2fr' },
    { title: 'Customer', field: 'customer', width: '3fr' },
    { title: 'Due', field: 'dueDate', width: '1.5fr' },
    { title: '', field: 'action', width: '100px' }
  ]

  const records = invoices.map(x => ({
    id: x.id,
    number: x.number,
    amount: '£' + (x.total / 100).toFixed(),
    status: x.status.substr(0, 1).toUpperCase() + x.status.substr(1),
    orderId: x.metadata.order,
    customer: x.customer_name || x.customer_email,
    dueDate: moment(new Date(x.due_date * 1000)).format('DD MMM YYYY'),
    original: x
  }))

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
          <div key={index} className="main-table--cell header-cell">
            {item.title}
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
