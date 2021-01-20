import React, { useEffect, useState, useMemo } from 'react'
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch
} from 'react-router-dom'
import queryString from 'query-string'
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
import { createCustomer } from 'services/customer'
import { getErrorMsg } from 'utils/helper'

function useRouter() {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const match = useRouteMatch()

  // Return our custom router object
  // Memoize so that a new object is only returned if something changes
  return useMemo(() => {
    return {
      // For convenience add push(), replace(), pathname at top level
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      match,
      location,
      history
    }
  }, [params, match, location, history])
}

const InvoiceForm = ({
  invoice,
  orderDetail,
  suppliers,
  onSent,
  onClose,
  showNotification
}) => {
  const [customer, setCustomer] = useState(null)
  const [supplier, setSupplier] = useState(null)
  const [lines, setLines] = useState([])
  const [defaultLines, setDefaultLines] = useState([])
  const [email, setEmail] = useState('')
  const [due, setDue] = useState(30)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [url, setUrl] = useState(null)

  const { history } = useRouter()

  if (!url) {
    setUrl(history.location.pathname)
  }


  useEffect(() => {
    return () => {
      if (history.action === 'POP') {
        handleClose()
        history.push(history.location.pathname, history.location.state)
        history.replace(url)
      }
    }
  }, [history])

  let supplierName = ''

  if (orderDetail) {
    const tmpSuppplier = suppliers.find(x => x.id === orderDetail.supplierId)
    supplierName = tmpSuppplier.name

    if (!email && orderDetail.customerEmail) {
      setEmail(orderDetail.customerEmail)
    }
  }
  const supplierOptions = suppliers.map(x => ({
    name: x.name,
    id: x.id
  }))

  // in edit mode, fill data
  useEffect(() => {
    async function loadInvoice() {
      if (!invoice) {
        return
      }

      const { metadata, due_date, status } = invoice
      setStatus(status)
      const dueDays = moment(new Date(due_date * 1000)).diff(moment(), 'days')
      setDue(dueDays)

      setCustomer({
        id: metadata.customer_id,
        name: invoice.customer_name,
        email: invoice.customer_email
      })
      setEmail(invoice.customer_email)
      const tmpSuppplier = supplierOptions.find(
        x => x.id === parseInt(metadata.supplier_id)
      )

      if (tmpSuppplier) {
        setSupplier(tmpSuppplier)
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
    }

    loadInvoice()
  }, [invoice])

  const handleClose = () => {
    onClose()
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

  const handleChangeSupplier = value => {
    setSupplier(value)
  }

  const handleCustomerChange = value => {
    setCustomer(value)
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
        if (
          !email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ) {
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
        supplier: orderDetail.supplierId
      }
    } else {
      data = {
        supplier: supplier.id
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

    return data
  }

  const handleTakePayment = () => {
    window.open(invoice.hosted_invoice_url)
    handleClose()
  }

  const handleDownload = () => {
    window.open(invoice.invoice_pdf)
    handleClose()
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
          try {
            await deleteInvoiceLine(invoice.id, line.id)
          } catch (err) {
            console.log(err)
          }
        }
        for (const line of formData.items) {
          try {
            delete line.id
            await addInvoiceLine(invoice.id, line)
          } catch (err) {
            console.log(err)
          }
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
            {status && status !== 'draft' ? (
              <label className={styles.labelValue}>
                {supplier && supplier.name}
              </label>
            ) : orderDetail ? (
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
          <div className={styles.divider} />

          <div className={styles.blockHeader}>Customer Details</div>
          <div>
            <label className={styles.label} style={{ marginBottom: 9 }}>
              Email
            </label>
            <ConnectInput
              basic
              disabled={
                !!customer || !!orderDetail || (status && status !== 'draft')
              }
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
            disabled={status && status !== 'draft'}
          />
          <div>
            <div className={styles.blockHeader}>Notes</div>
            <ConnectTextArea
              name="notes"
              value={notes}
              type="textarea"
              disabled={status && status !== 'draft'}
              onChange={handleChangeNote}
            />
          </div>
          <div>
            <div className={styles.blockHeader}>Payment Due</div>
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
                disabled={status && status !== 'draft'}
                required
              />
              <label className={styles.label} style={{ marginBottom: 20 }}>
                days after invoice is sent
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            {status && (status === 'paid' || status === 'void') ? (
              <Button color="primary" onClick={() => handleDownload()}>
                Download Invoice
              </Button>
            ) : status && status !== 'draft' ? (
              <Button color="primary" onClick={() => handleTakePayment()}>
                Take Payment
              </Button>
            ) : (
              <React.Fragment>
                <Button color="white" onClick={() => handleSend(false)}>
                  Save as Draft
                </Button>
                <Button color="primary" onClick={() => handleSend(true)}>
                  Save & Send
                </Button>
              </React.Fragment>
            )}
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
