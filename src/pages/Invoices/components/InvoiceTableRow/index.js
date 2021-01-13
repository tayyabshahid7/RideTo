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
  IconCreditCard,
  IconChangeStatus
} from 'assets/icons'
import { getTagType } from 'services/invoice'

const InvoiceTableRow = ({
  header,
  record,
  index,
  total,
  history,
  onDelete,
  onEdit,
  onShowOrder,
  onSend
}) => {
  const menuRef = useRef()

  const calcDown = index => {
    return index > 4 && index > total - 5
  }

  const handleNewPayment = () => {
    menuRef.current.hideMenu()
    window.open(record.original.hosted_invoice_url)
  }

  const handleEdit = () => {
    menuRef.current.hideMenu()
    onEdit(record)
  }

  const handleChangeStatus = () => {
    menuRef.current.hideMenu()
    history.push(`/invoices/status/${record.id}`)
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
    window.open(record.original.invoice_pdf)
  }

  return (
    <React.Fragment>
      {header.map((item, rIndex) => {
        let cell
        if (item.field === 'orderId') {
          cell = (
            <span onClick={() => onShowOrder(record)} className={styles.link}>
              {record.orderId}
            </span>
          )
        } else if (item.field === 'customer') {
          cell = (
            <Link
              className={styles.link}
              to={`/customers/${record.customerId}`}>
              {record.customer}
            </Link>
          )
        } else if (item.field === 'id') {
          cell = <span>{record.number}</span>
        } else if (item.field === 'status') {
          cell = (
            <ColorTag text={record.status} type={getTagType(record.status)} />
          )
        } else if (item.field === 'action') {
          cell = (
            <ActionThreeDot ref={menuRef} down={calcDown(index)}>
              {record.status === 'Open' && (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleNewPayment}>
                    <IconCreditCard />
                    <span>Take Payment</span>
                  </div>
                  <div className={styles.divider}></div>
                </React.Fragment>
              )}

              {record.status === 'Draft' ? (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleEdit}>
                    <IconEdit />
                    <span>Update Invoice</span>
                  </div>
                  <div className={styles.spacing}></div>
                  <div className={styles.menuItem} onClick={handleDelete}>
                    <IconTrash />
                    <span>Delete Invoice</span>
                  </div>
                  <div className={styles.divider}></div>
                </React.Fragment>
              ) : record.status === 'Void' ||
                record.status === 'Paid' ? null : (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleChangeStatus}>
                    <IconChangeStatus />
                    <span>Change Invoice Status</span>
                  </div>
                  <div className={styles.divider}></div>
                </React.Fragment>
              )}

              {record.original.invoice_pdf && (
                <React.Fragment>
                  <div className={styles.menuItem} onClick={handleDownload}>
                    <IconDownArrow />
                    <span>Download Invoice</span>
                  </div>
                </React.Fragment>
              )}
              {record.status === 'Draft' && (
                <React.Fragment>
                  {record.original.invoice_pdf && (
                    <div className={styles.spacing}></div>
                  )}
                  <div className={styles.menuItem} onClick={handleSend}>
                    <IconRightArrow />
                    <span>Send Invoice</span>
                  </div>
                </React.Fragment>
              )}
            </ActionThreeDot>
          )
        } else if (item.field === 'dueDate' || item.field === 'createdDate') {
          cell = <span className={styles.noBreak}>{record[item.field]}</span>
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
