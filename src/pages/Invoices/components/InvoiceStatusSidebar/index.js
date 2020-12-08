import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import styles from './styles.scss'
import { fetchOrderById } from 'services/order'
import ColorTag from 'components/ColorTag'
import { getTagType } from 'services/invoice'
import { ConnectTextArea, Button } from 'components/ConnectForm'
const InvoiceStatusSidebar = ({ history, match, invoices }) => {
  const [invoice, setInvoice] = useState(null)
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function loadOrder() {
      if (!invoice) {
        return
      }

      const fetchData = async () => {
        return await fetchOrderById(invoice.metadata.order)
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

  const handleUpdate = () => {}

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
    },
    {
      name: 'uncollectible',
      title: 'Uncollectible',
      description:
        'Payment of this invoice is not expected, but you can still collect payment.'
    }
  ]

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
          <span>Invoice #{invoice.id}</span>
        </div>
        <ColorTag text={invoice.status} type={getTagType(invoice.status)} />
      </div>

      {statusOptions.map(option => (
        <div
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
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    invoices: state.invoice.invoices
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceStatusSidebar)
