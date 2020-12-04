import React, { useState } from 'react'
import classnames from 'classnames'
import moment from 'moment'

import { Button, ConnectInput } from 'components/ConnectForm'
import InvoicesTableRow from '../InvoiceTableRow'
import InvoiceForm from '../InvoiceForm'
import { IconAngleRight, IconAngleLeft } from 'assets/icons'

import styles from './styles.scss'

const InvoicesTable = ({
  invoices,
  location,
  history,
  match,
  onDelete,
  onEdit,
  page,
  total,
  onPage,
  pageSize = 25,
  onRefresh
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
    amount: '£' + (x.total / 100).toFixed(),
    status: x.status.substr(0, 1).toUpperCase() + x.status.substr(1),
    orderId: x.metadata.order,
    customer: x.customer_name,
    dueDate: moment(new Date(x.due_date * 1000)).format('DD MMM YYYY')
  }))

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

  const handleEdit = invoice => {
    const data = invoices.find(x => x.id === invoice.id)
    setInvoice(data)
    setShowForm(true)
    console.log('%cedit invoice', 'color: red', data)
  }

  const handlePageChange = event => {
    event.persist()
    pageChanged(parseInt(event.target.value))
  }

  const pageChanged = page => {
    page = Math.max(1, page)
    page = Math.min(Math.ceil(total / pageSize), page)
    console.log(page)
    onPage(page)
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
            onDelete={onDelete}
            onEdit={handleEdit}
          />
        ))}
        <div style={statsStyle}>
          <div className={styles.tableStats}>
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
