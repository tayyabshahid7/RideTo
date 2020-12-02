import React, { useEffect, useState } from 'react'
import styles from './styles.scss'
import CloseButton from 'components/common/CloseButton'
import {
  ConnectInput,
  ConnectReactSelect,
  ConnectTextArea,
  Button
} from 'components/ConnectForm'
import InvoiceFormLineItems from './InvoiceFormLineItems'
import SearchCustomerInput from 'components/SearchCustomerInput'
import SearchOrderInput from 'components/SearchOrderInput'

const InvoiceForm = ({ onClose }) => {
  const [customer, setCustomer] = useState(null)
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {}, [])

  const handleClose = () => {
    console.log('closing')
    onClose()
  }

  const options = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' }
  ]

  const handleChangeOption = value => {
    console.log(value)
    setCustomer(value)
  }

  const handleChangeEmail = event => {
    const { value } = event.target
    setEmail(value)
  }

  const handleChangeNote = event => {
    const { value } = event.target
    setNotes(value)
  }

  const handleOrderChange = () => {}

  const handleCustomerChange = () => {}

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h6>New Invoice</h6>
        <CloseButton onClick={handleClose} />
      </div>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <div className={styles.blockHeader} style={{ marginBottom: 36 }}>
            Invoice <span>#</span>
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Customer</label>
            <SearchCustomerInput onChange={handleCustomerChange} />
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>School</label>
            <ConnectReactSelect
              value={customer}
              onChange={handleChangeOption}
              size="big"
              options={options}
              isMulti={false}
              closeMenuOnSelect={true}
            />
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Course</label>
            <ConnectReactSelect
              value={customer}
              onChange={handleChangeOption}
              size="big"
              options={options}
              isMulti={false}
              closeMenuOnSelect={true}
            />
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Order</label>
            <SearchOrderInput onChange={handleOrderChange} />
          </div>
          <div className={styles.divider} />

          <div className={styles.blockHeader}>Customer Details</div>
          <div>
            <label className={styles.label} style={{ marginBottom: 9 }}>
              Email
            </label>
            <ConnectInput
              basic
              size="lg"
              name="email"
              value={email || ''}
              type="email"
              onChange={handleChangeEmail}
              required
            />
          </div>
          <div className={styles.divider} />

          <InvoiceFormLineItems />

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
          <div className={styles.actions}>
            <Button color="white">Cancel</Button>
            <Button color="primary">Save Invoice</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceForm
