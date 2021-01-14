import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
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
import {
  sendInvoice,
  updateInvoice,
  deleteInvoiceLine,
  addInvoiceLine
} from 'services/invoice'
import { fetchOrderById } from 'services/order'
import { fetchCustomer, createCustomer } from 'services/customer'
import { getErrorMsg } from 'utils/helper'
import { validateEmail } from 'common/emailExtensions'

const InvoiceForm = ({
  invoice,
  orderDetail,
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
  const [defaultLines, setDefaultLines] = useState([])
  const [email, setEmail] = useState('')
  const [due, setDue] = useState(30)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  let supplierName = ''
  let courseTypeName = ''

  if (orderDetail) {
    const tmpSuppplier = suppliers.find(x => x.id === orderDetail.supplierId)
    supplierName = tmpSuppplier.name
    const tmpCourseType = info.courseTypes.find(
      x => x.id === orderDetail.courseTypeId
    )
    courseTypeName = tmpCourseType.name
    if (!email && orderDetail.customerEmail) {
      setEmail(orderDetail.customerEmail)
    }
  }

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
        try {
          return await fetchCustomer(metadata.customer_id)
        } catch (err) {
          showNotification('Error', 'Failed to load customer detail', 'danger')
          return null
        }
      }

      const { metadata, due_date } = invoice
      const dueDays = moment(new Date(due_date * 1000)).diff(moment(), 'days')
      setDue(dueDays)

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

      // line items
      const tmpLines = invoice.lines.data.map(x => {
        const data = {
          id: x.id,
          description: x.description,
          quantity: x.quantity,
          price: x.price.unit_amount / 100,
          tax: ((x.tax_amounts[0].amount / x.amount) * 100).toFixed(2) + '%'
        }
        return data
      })
      setDefaultLines(tmpLines.reverse())

      // fetch customer detail and orders
      const cdetail = await fetchData()

      if (cdetail) {
        const tmpOrderOptions = cleanUpOrders(cdetail.orders)
        setOrderOptions(tmpOrderOptions)
        const tmpOrder = tmpOrderOptions.find(x => x.id === metadata.order)
        if (tmpOrder) {
          setOrder(tmpOrder)
        }
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

  const handleChangeEmail = event => {
    setEmail(event.target.value)
  }

  const handleChangeDue = event => {
    setDue(event.target.value)
  }

  const handleOrderChange = async value => {
    setOrder(value)

    if (value) {
      try {
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
      } catch (err) {
        showNotification('Error', 'Failed to load order details', 'danger')
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
    setCustomer(value)
    setOrderOptions(cleanUpOrders(value.orders))
    setOrder(null)
    setEmail(value.email || value.name)
  }

  const validateData = () => {
    if (!orderDetail) {
      if (!supplier) {
        showNotification('Error', 'Please choose a supplier', 'danger')
        return false
      }

      if (!customer && !email) {
        showNotification('Error', 'Please input customer email', 'danger')
        return false
      }

      if (!customer && email) {
        if (!validateEmail(email)) {
          showNotification('Error', 'Customer email is invalid', 'danger')
          return false
        }
      }
    }

    if (!lines.length) {
      showNotification('Error', 'Please add a line item', 'danger')
      return false
    }

    let flag = true
    lines.forEach((line, index) => {
      if (!line.description) {
        showNotification(
          'Error',
          `Item #${index + 1}: Description is required`,
          'danger'
        )
        flag = false
      }
      if (!line.quantity) {
        showNotification(
          'Error',
          `Line #${index + 1}: Qty is required`,
          'danger'
        )
        flag = false
      }
      if (!line.price) {
        showNotification(
          'Error',
          `Line #${index + 1}: Price is required`,
          'danger'
        )
        flag = false
      }
      if (!line.tax) {
        showNotification(
          'Error',
          `Line #${index + 1}: Tax is required`,
          'danger'
        )
        flag = false
      }
    })

    if (!flag) {
      return false
    }

    return true
  }

  const prepareData = async () => {
    if (!validateData()) {
      return
    }

    let data = {}

    if (orderDetail) {
      data = {
        customer: orderDetail.customerId,
        supplier: orderDetail.supplierId,
        course_id: orderDetail.courseTypeId,
        order: orderDetail.orderId
      }
    } else {
      data = {
        supplier: supplier.id
      }
      if (course) {
        data.course_id = course.id
      }

      if (!invoice) {
        if (customer) {
          data.customer = customer.id
        } else if (email) {
          // create customer using the email and assign it
          try {
            setSaving(true)
            const tmp = await createCustomer(email)
            data.customer = tmp.customer_id
          } catch (err) {
            console.log(err)
            showNotification('Error', 'Failed to create a customer', 'danger')
            return
          } finally {
            setSaving(false)
          }
        }
      }
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

    data.items = items
    data.days_until_due = due
    data.notes = notes

    if (order) {
      data.order = order.id
    }

    return data
  }

  const handleSend = async isSend => {
    const formData = await prepareData()
    if (!formData) {
      return
    }
    formData.send_invoice = isSend

    setSaving(true)

    try {
      if (invoice) {
        for (const line of defaultLines) {
          await deleteInvoiceLine(invoice.id, line.id)
        }
        for (const line of formData.items) {
          delete line.id
          await addInvoiceLine(invoice.id, line)
        }
        delete formData.items
        await updateInvoice(invoice.id, formData)
      } else {
        await sendInvoice(formData)
      }
      onSent()
    } catch (err) {
      const defaultMsg = invoice
        ? 'Failed to update invoice details'
        : 'Failed to create a new invoice'
      showNotification('Error', getErrorMsg(err) || defaultMsg, 'danger')
    } finally {
      setSaving(false)
    }
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
            Invoice {invoice ? '#' + invoice.number : <span>#</span>}
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Customer</label>
            {invoice ? (
              <label className={styles.labelValue}>
                {customer && customer.name}
              </label>
            ) : orderDetail ? (
              <label className={styles.labelValue}>
                {orderDetail.customer}
              </label>
            ) : (
              <SearchCustomerInput
                value={customer}
                onChange={handleCustomerChange}
              />
            )}
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>School</label>
            {orderDetail ? (
              <label className={styles.labelValue}>{supplierName}</label>
            ) : (
              <ConnectReactSelect
                value={supplier}
                onChange={handleChangeSupplier}
                size="big"
                options={supplierOptions}
                isMulti={false}
                closeMenuOnSelect={true}
              />
            )}
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Course</label>
            {orderDetail ? (
              <label className={styles.labelValue}>{courseTypeName}</label>
            ) : (
              <ConnectReactSelect
                value={course}
                onChange={handleChangeCourse}
                size="big"
                options={courseTypeOptions}
                isMulti={false}
                closeMenuOnSelect={true}
              />
            )}
          </div>
          <div className={styles.invoiceLine}>
            <label className={styles.label}>Order</label>
            {orderDetail ? (
              <label className={styles.labelValue}>{orderDetail.order}</label>
            ) : (
              <ConnectReactSelect
                value={order}
                onChange={handleOrderChange}
                size="big"
                options={orderOptions}
                isMulti={false}
                closeMenuOnSelect={true}
              />
            )}
          </div>
          <div className={styles.divider} />

          <div className={styles.blockHeader}>Customer Details</div>
          <div>
            <label className={styles.label} style={{ marginBottom: 9 }}>
              Email
            </label>
            <ConnectInput
              basic
              disabled={!!customer || !!orderDetail}
              size="lg"
              name="email"
              value={email || ''}
              onChange={handleChangeEmail}
              type="email"
              required
            />
          </div>
          <div className={styles.divider} />

          <InvoiceFormLineItems
            value={defaultLines}
            onChange={handleLineChange}
          />
          <div>
            <div className={styles.blockHeader}>Notes</div>
            <ConnectTextArea
              name="notes"
              value={notes}
              type="textarea"
              onChange={handleChangeNote}
            />
          </div>
          <div>
            <div className={styles.blockHeader}>Payment due</div>
            <div className={styles.inlineInput}>
              <ConnectInput
                basic
                size="lg"
                name="email"
                value={due}
                onChange={handleChangeDue}
                type="number"
                min={1}
                max={100}
                required
              />
              <label className={styles.label} style={{ marginBottom: 20 }}>
                days after invoice is sent
              </label>
            </div>
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
