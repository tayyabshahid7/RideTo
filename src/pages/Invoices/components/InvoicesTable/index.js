import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import { Button } from 'components/ConnectForm'
import ColorTag from 'components/ColorTag'
import { IconClose } from 'assets/icons/'
import { Link } from 'react-router-dom'

const InvoicesTable = ({}) => {
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

  const tagMap = {
    outstanding: 'default',
    'partially paid': 'info',
    paid: 'success',
    overdue: 'danger',
    draft: 'default'
  }

  const getTagType = tag => {
    const tmp = tag.toLowerCase()
    return tagMap[tmp] || 'default'
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
          <React.Fragment>
            {header.map((item, rIndex) => {
              let cell
              if (item.field === 'orderId') {
                cell = (
                  <Link to={`/orders/${record.orderId}`}>{record.orderId}</Link>
                )
              } else if (item.field === 'customer') {
                cell = (
                  <Link to={`/customers/${record.customer}`}>
                    {record.customer}
                  </Link>
                )
              } else if (item.field === 'status') {
                cell = (
                  <ColorTag
                    text={record.status}
                    type={getTagType(record.status)}
                  />
                )
              } else {
                cell = <span>{record[item.field]}</span>
              }
              return (
                <div
                  className="main-table--cell"
                  key={`${index}-${item.id}-${rIndex}`}>
                  {cell}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default InvoicesTable
