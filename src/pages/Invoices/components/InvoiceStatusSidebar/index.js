import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import styles from './styles.scss'
import { fetchOrderById } from 'services/order'
import ColorTag from 'components/ColorTag'
import LoadingMask from 'components/LoadingMask'
import {
  getTagType,
  markInvoiceAsPaid,
  deleteInvoice,
  markInvoiceAsUncollectible
} from 'services/invoice'
import { getInvoices } from 'store/invoice'
import { actions as notifyActions } from 'store/notification'
import { ConnectTextArea, Button } from 'components/ConnectForm'

const InvoiceStatusSidebar = ({
  history,
  match,
  invoices,
  params,
  showNotification,
  getInvoices
}) => {
  const [invoice, setInvoice] = useState(null)
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadOrder() {
      if (!invoice) {
        return
      }

      const fetchData = async () => {
        try {
          return await fetchOrderById(invoice.metadata.order)
        } catch (err) {
          showNotification('Error', 'Failed to load order', 'danger')
          return null
        }
      }
      const tmpOrder = await fetchData()
      setOrder(tmpOrder)
    }

    loadOrder()
  }, [invoice])

  const handleBack = () => {
    history.push('/invoices')
  }

  const { id } = match.params

  if (!invoice) {
    const tmp = invoices.find(x => x.id === id)
    if (!tmp) {
      handleBack()
      return null
    }
    setInvoice(tmp)
  }

  if (!order || !invoice) {
    return null
  }

  const handleChangeStatus = value => {
    setStatus(value)
  }

  const handleChangeNote = event => {
    const { value } = event.target
    setNotes(value)
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      if (status === 'paid') {
        await markInvoiceAsPaid(invoice.id)
      } else if (status === 'void') {
        await deleteInvoice(invoice.id)
      } else if (status === 'uncollectible') {
        await markInvoiceAsUncollectible(invoice.id)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
    getInvoices(params)
    handleBack()
  }

  if (invoice.status === 'void') {
    handleBack()
    return null
  }

  const statusOptions = [
    {
      name: 'paid',
      title: 'Paid',
      description:
        'Payment of this invoice was collected in-person or on the phone.'
    },
    {
      name: 'void',
      title: 'Void',
      description:
        'This invoice was accidentally finalised or contains a mistake.'
    }
  ]

  if (invoice.status.toLowerCase() === 'open') {
    statusOptions.push({
      name: 'uncollectible',
      title: 'Uncollectible',
      description:
        'Payment of this invoice is not expected, but you can still collect payment.'
    })
  }

  return (
    <div className={styles.container}>
      <DateHeading
        title="James Beddows"
        subtitle={'Direct #' + order.friendly_id}
        onBack={handleBack}
      />
      {/* <div className={styles.divider}></div> */}
      <div className={styles.priceLine}>
        <div className={styles.priceValue}>
          <h6>£{(invoice.total / 100).toFixed(2)}</h6>
          <span>Invoice #{invoice.number}</span>
        </div>
        <ColorTag text={invoice.status} type={getTagType(invoice.status)} />
      </div>

      {statusOptions.map(option => (
        <div
          key={option.name}
          onClick={() => handleChangeStatus(option.name)}
          className={styles.optionItem}>
          <label className="general-check round-check">
            <input
              type="checkbox"
              name={option.name}
              checked={status === option.name}
              onChange={() => {}}
            />
            <span className="slider"></span>
          </label>
          <div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </div>
        </div>
      ))}
      <div>
        <label className={styles.label} style={{ marginBottom: 20 }}>
          Notes
        </label>
        <ConnectTextArea
          name="notes"
          value={notes}
          type="textarea"
          onChange={handleChangeNote}
        />
      </div>
      <Button color="primary" onClick={handleUpdate}>
        Update Status
      </Button>
      <LoadingMask loading={loading} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    invoices: state.invoice.invoices,
    params: state.invoice.params
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showNotification: notifyActions.showNotification,
      getInvoices
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceStatusSidebar)
