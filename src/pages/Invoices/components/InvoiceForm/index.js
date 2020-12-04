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
import { sendInvoice } from 'services/invoice'
import { fetchOrderById } from 'services/order'
import { fetchCustomer } from 'services/customer'

const InvoiceForm = ({
  invoice,
  suppliers,
  info,
  onSent,
  onClose,
  showNotification
}) => {
  const [customer, setCustomer] = useState(null)
  const [order, setOrder] = useState(null)
  const [supplier, setSupplier] = useState(null)
  const [course, setCourse] = useState(null)
  const [orderOptions, setOrderOptions] = useState([])
  const [lines, setLines] = useState([])
  // const [defaultLines, setDefaultLines] = useState([])
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const supplierOptions = suppliers.map(x => ({
    name: x.name,
    id: x.id
  }))
  let courseTypeOptions = []

  if (supplier) {
    courseTypeOptions = info.courseTypes
      .filter(x => x.schoolIds.includes(supplier.id))
      .map(x => ({
        name: x.name,
        constant: x.constant,
        id: x.id
      }))
  }

  // in edit mode, fill data
  useEffect(() => {
    async function loadInvoice() {
      if (!invoice) {
        return
      }

      const fetchData = async () => {
        return await fetchCustomer(metadata.customer_id)
      }

      const { metadata } = invoice
      setCustomer({
        id: metadata.customer_id,
        name: invoice.customer_name,
        email: invoice.customer_email,
        orders: []
      })
      setEmail(invoice.customer_email)
      const tmpSuppplier = supplierOptions.find(
        x => x.id === parseInt(metadata.supplier_id)
      )

      if (tmpSuppplier) {
        setSupplier(tmpSuppplier)
      }
      const tmpCourse = info.courseTypes.find(
        x => x.id === parseInt(metadata.course_id)
      )
      if (tmpCourse) {
        setCourse(tmpCourse)
      }
      if (metadata.notes) {
        setNotes(metadata.notes)
      }
      // fetch customer detail and orders
      const cdetail = await fetchData()

      const tmpOrderOptions = cleanUpOrders(cdetail.orders)
      setOrderOptions(tmpOrderOptions)
      const tmpOrder = tmpOrderOptions.find(x => x.id === metadata.order)
      if (tmpOrder) {
        setOrder(tmpOrder)
      }
    }

    loadInvoice()
  }, [invoice])

  const handleClose = () => {
    onClose()
  }

  const handleChangeCourse = value => {
    setCourse(value)
    setOrder(null)
  }

  const handleChangeNote = event => {
    const { value } = event.target
    setNotes(value)
  }

  const handleOrderChange = async value => {
    setOrder(value)

    if (value) {
      const result = await fetchOrderById(value.id)
      const tmpSuppplier = supplierOptions.find(
        x => x.id === result.supplier_id
      )
      if (tmpSuppplier) {
        setSupplier(tmpSuppplier)
      }

      const tmpCourse = info.courseTypes.find(
        x => x.id === result.course_type_id
      )
      if (tmpCourse) {
        setCourse(tmpCourse)
      }
    }
    // TODO: fetch order detail and determine school and course
  }

  const handleChangeSupplier = value => {
    setSupplier(value)
    setCourse(null)
    setOrder(null)
  }

  const cleanUpOrders = orders => {
    return orders.map(x => {
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
  }

  const handleCustomerChange = value => {
    console.log(value)
    setCustomer(value)
    setOrderOptions(cleanUpOrders(value.orders))
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
    if (!notes) {
      showNotification('Error', 'Please add a note', 'danger')
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

    if (order) {
      data.order = order.id
    }

    return data
  }

  const handleSend = async isSend => {
    const formData = prepareData()
    formData.send_invoice = isSend

    setSaving(true)

    const result = await sendInvoice(formData)
    console.log(result)

    setSaving(false)
    onSent()
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
            <SearchCustomerInput
              value={customer}
              onChange={handleCustomerChange}
            />
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
            <Button color="white" onClick={() => handleSend(false)}>
              Save as Draft
            </Button>
            <Button color="primary" onClick={() => handleSend(true)}>
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
