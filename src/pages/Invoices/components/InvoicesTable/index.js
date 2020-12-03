import React, { useState } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import { Button } from 'components/ConnectForm'
import InvoicesTableRow from '../InvoiceTableRow'
import InvoiceForm from '../InvoiceForm'
import moment from 'moment'

const InvoicesTable = ({ invoices, location, history, match, onRefresh }) => {
  const [showForm, setShowForm] = useState(false)

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
    amount: '£' + (x.total / 100).toFixed(),
    status: x.status.substr(0, 1).toUpperCase() + x.status.substr(1),
    orderId: x.metadata.order,
    customer: x.customer_name,
    dueDate: moment(x.due_date).format('DD MMM YYYY')
  }))

  // records[1].status = 'Partially Paid'
  // records[2].status = 'Paid'
  // records[3].status = 'Overdue'
  // records[4].status = 'Draft'

  const tableStyles = {
    gridTemplateColumns: header.map(x => x.width).join(' '),
    gridTemplateRows: `repeat(${records.length + 1}, auto) 1fr`
  }

  const onNewPayment = () => {
    history.push('/invoices/new-payment')
  }

  const showInvoiceForm = () => {
    setShowForm(true)
  }

  const handleInvoiceSent = () => {
    setShowForm(false)
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
            total={records.length}
            onNewPayment={onNewPayment}
          />
        ))}
        <div style={statsStyle}></div>
      </div>
      {showForm && (
        <InvoiceForm
          onSent={handleInvoiceSent}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default InvoicesTable
