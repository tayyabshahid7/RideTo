import React, { useRef } from 'react'
import styles from './styles.scss'
import ColorTag from 'components/ColorTag'
import ActionThreeDot from 'components/ActionThreeDot'
import { Link } from 'react-router-dom'
import {
  IconRightArrow,
  IconDownArrow,
  IconEdit,
  IconTrash,
  IconPound
} from 'assets/icons'

const InvoiceTableRow = ({
  header,
  record,
  index,
  total,
  onNewPayment,
  onDelete,
  onEdit,
  onSend
}) => {
  const menuRef = useRef()
  const tagMap = {
    outstanding: 'default',
    'partially paid': 'info',
    paid: 'success',
    overdue: 'danger',
    void: 'danger',
    draft: 'default'
  }

  const getTagType = tag => {
    const tmp = tag.toLowerCase()
    return tagMap[tmp] || 'default'
  }

  const calcDown = index => {
    return index > 4 && index > total - 5
  }

  const handleNewPayment = () => {
    menuRef.current.hideMenu()
    onNewPayment()
  }

  const handleEdit = () => {
    menuRef.current.hideMenu()
    onEdit(record)
  }

  const handleChangeStatus = () => {
    menuRef.current.hideMenu()
  }

  const handleDelete = () => {
    menuRef.current.hideMenu()
    onDelete(record)
  }

  const handleSend = () => {
    menuRef.current.hideMenu()
    onSend(record)
  }

  const handleDownload = () => {
    menuRef.current.hideMenu()
    console.log(record.original)
    window.open(record.original.invoice_pdf)
  }

  return (
    <React.Fragment>
      {header.map((item, rIndex) => {
        let cell
        if (item.field === 'orderId') {
          cell = <Link to={`/orders/${record.orderId}`}>{record.orderId}</Link>
        } else if (item.field === 'customer') {
          cell = (
            <Link to={`/customers/${record.customer}`}>{record.customer}</Link>
          )
        } else if (item.field === 'status') {
          cell = (
            <ColorTag text={record.status} type={getTagType(record.status)} />
          )
        } else if (item.field === 'action') {
          cell = (
            <ActionThreeDot ref={menuRef} down={calcDown(index)}>
              {/* <div className={styles.menuItem} onClick={handleNewPayment}>
                <IconPound />
                <span>New Payment</span>
              </div>
              <div className={styles.divider}></div> */}

              {record.status === 'Draft' ? (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleEdit}>
                    <IconEdit />
                    <span>Edit Invoice</span>
                  </div>
                  <div className={styles.spacing}></div>
                  <div className={styles.menuItem} onClick={handleDelete}>
                    <IconTrash />
                    <span>Delete Invoice</span>
                  </div>
                </React.Fragment>
              ) : (
                <div className={styles.menuItem} onClick={handleChangeStatus}>
                  <IconEdit />
                  <span>Change Invoice Status</span>
                </div>
              )}
              <div className={styles.divider}></div>
              {record.original.invoice_pdf && (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleDownload}>
                    <IconDownArrow />
                    <span>Download Invoice</span>
                  </div>
                  <div className={styles.spacing}></div>
                </React.Fragment>
              )}
              {record.status === 'Draft' && (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleSend}>
                    <IconRightArrow />
                    <span>Send Invoice</span>
                  </div>
                </React.Fragment>
              )}
            </ActionThreeDot>
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
  )
}

export default InvoiceTableRow