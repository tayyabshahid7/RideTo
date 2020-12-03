import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
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
import LoadingMask from 'components/LoadingMask'
import { actions as notifyActions } from 'store/notification'

const InvoiceForm = ({ suppliers, info, onClose, showNotification }) => {
  const [customer, setCustomer] = useState(null)
  const [order, setOrder] = useState(null)
  const [supplier, setSupplier] = useState(null)
  const [course, setCourse] = useState(null)
  const [orderOptions, setOrderOptions] = useState([])
  const [lines, setLines] = useState([])
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const supplierOptions = suppliers.map(x => ({
    name: x.name,
    id: x.id
  }))

  const courseTypeOptions = info.courseTypes.map(x => ({
    name: x.name,
    constant: x.constant,
    id: x.id
  }))

  useEffect(() => {}, [])

  const handleClose = () => {
    console.log('closing')
    onClose()
  }

  const handleChangeCourse = value => {
    setCourse(value)
  }

  const handleChangeNote = event => {
    const { value } = event.target
    setNotes(value)
  }

  const handleOrderChange = value => {
    setOrder(value)
    // TODO: fetch order detail and determine school and course
  }

  const handleChangeSupplier = value => {
    setSupplier(value)
  }

  const handleCustomerChange = value => {
    console.log(value)
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

  const validateData = () => {
    if (!customer) {
      showNotification('Error', 'Please choose a customer', 'danger')
      return false
    }
    if (!supplier) {
      showNotification('Error', 'Please choose a supplier', 'danger')
      return false
    }
    if (!course) {
      showNotification('Error', 'Please choose a course', 'danger')
      return false
    }
    if (!lines.length) {
      showNotification('Error', 'Please add a line item', 'danger')
      return false
    }
    lines.forEach((line, index) => {
      if (!line.description) {
        showNotification(
          'Error',
          `Item #${index + 1}: Description is required`,
          'danger'
        )
        return false
      }
      if (!line.quantity) {
        showNotification(
          'Error',
          `Line #${index + 1}: Qty is required`,
          'danger'
        )
        return false
      }
      if (!line.price) {
        showNotification(
          'Error',
          `Line #${index + 1}: Price is required`,
          'danger'
        )
        return false
      }
      if (!line.tax) {
        showNotification(
          'Error',
          `Line #${index + 1}: Tax is required`,
          'danger'
        )
        return false
      }
    })

    return true
  }

  const prepareData = () => {
    if (!validateData()) {
      return
    }

    const items = lines.map(x => {
      let tax = x.tax.split('%')[0]
      tax = parseFloat(tax)

      return {
        ...x,
        tax,
        price: x.price * 100
      }
    })

    const data = {
      customer: customer.id,
      supplier: supplier.id,
      course_id: course.id,
      items,
      notes
    }
    console.log(order)
    if (order) {
      data.order = order.id
    }

    return data
  }

  const handleSaveDraft = () => {
    const formData = prepareData()
    formData.send_invoice = false
    console.log(formData)
  }

  const handleSend = () => {
    const formData = prepareData()
    formData.send_invoice = true
    console.log(formData)

    setSaving(true)

    setTimeout(() => setSaving(false), 1000)
  }

  const handleLineChange = lines => {
    setLines(lines)
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
              onChange={handleChangeSupplier}
              size="big"
              options={supplierOptions}
              isMulti={false}
              closeMenuOnSelect={true}
            />
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Course</label>
            <ConnectReactSelect
              value={course}
              onChange={handleChangeCourse}
              size="big"
              options={courseTypeOptions}
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

          <InvoiceFormLineItems onChange={handleLineChange} />

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
            <Button color="white" onClick={handleSaveDraft}>
              Save as Draft
            </Button>
            <Button color="primary" onClick={handleSend}>
              Save & Send
            </Button>
          </div>
        </div>
      </div>
      <LoadingMask loading={saving} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    suppliers: state.auth.user.suppliers,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceForm)
