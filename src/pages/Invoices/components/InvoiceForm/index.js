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

const InvoiceForm = ({ onClose }) => {
  const [customer, setCustomer] = useState(null)
  const [order, setOrder] = useState(null)
  const [supplier, setSupplier] = useState(null)
  const [course, setCourse] = useState(null)
  const [orderOptions, setOrderOptions] = useState([])
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
    // console.log(value)
    // setCustomer(value)
  }

  const handleChangeNote = event => {
    const { value } = event.target
    setNotes(value)
  }

  const handleOrderChange = value => {
    setOrder(value)
    // TODO: fetch order detail and determine school and course
  }

  const handleCustomerChange = value => {
    setCustomer(value)
    const tmp = value.orders.map(x => {
      let id = x.split('#')
      if (id.length > 1) {
        id = id[1]
      } else {
        id = id[0]
      }
      return {
        id: id,
        name: x
      }
    })
    setOrderOptions(tmp)
    setOrder(null)
    setEmail(value.email)
  }

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
              value={supplier}
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
              value={course}
              onChange={handleChangeOption}
              size="big"
              options={options}
              isMulti={false}
              closeMenuOnSelect={true}
            />
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Order</label>
            <ConnectReactSelect
              value={order}
              onChange={handleOrderChange}
              size="big"
              options={orderOptions}
              isMulti={false}
              closeMenuOnSelect={true}
            />
          </div>
          <div className={styles.divider} />

          <div className={styles.blockHeader}>Customer Details</div>
          <div>
            <label className={styles.label} style={{ marginBottom: 9 }}>
              Email
            </label>
            <ConnectInput
              basic
              readOnly
              size="lg"
              name="email"
              value={email || ''}
              onChange={() => {}}
              type="email"
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
