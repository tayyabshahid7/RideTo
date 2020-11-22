import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import { Button } from 'components/ConnectForm'
import InvoicesTableRow from '../InvoiceTableRow'

const InvoicesTable = props => {
  const header = [
    { title: 'Invoice #', field: 'id', width: '2fr' },
    { title: 'Amount', field: 'amount', width: '1.5fr' },
    { title: 'Status', field: 'status', width: '2fr' },
    { title: 'Order', field: 'orderId', width: '2fr' },
    { title: 'Customer', field: 'customer', width: '3fr' },
    { title: 'Due', field: 'dueDate', width: '1.5fr' },
    { title: '', field: 'action', width: '100px' }
  ]

  const dummy = {
    id: 'AD1231231234',
    amount: '$150.00',
    status: 'Outstanding',
    orderId: 'DIRECT#398728',
    customer: 'Chris Mahon',
    dueDate: '16 Aug 2020'
  }

  const records = []
  for (let i = 0; i < 25; i++) {
    records.push(Object.assign({}, dummy))
  }
  records[1].status = 'Partially Paid'
  records[2].status = 'Paid'
  records[3].status = 'Overdue'
  records[4].status = 'Draft'

  const tableStyles = {
    gridTemplateColumns: header.map(x => x.width).join(' ')
  }

  const onNewPayment = () => {}

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.headerLabel}>Invoices</label>
        <Button type="submit" color="primary" className={styles.headerButton}>
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
      </div>
    </div>
  )
}

export default InvoicesTable
