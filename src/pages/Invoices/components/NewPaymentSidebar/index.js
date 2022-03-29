import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import OrderPaymentContainer from '../OrderPaymentContainer'
import { getInvoices } from 'store/invoice'
import { fetchOrderById } from 'services/order'
import { actions as notifyActions } from 'store/notification'
import styles from './styles.scss'

const NewPaymentSidebar = ({
  history,
  match,
  invoices,
  params,
  showNotification,
  getInvoices
}) => {
  const [invoice, setInvoice] = useState(null)
  const [order, setOrder] = useState(null)
  // const [loading, setLoading] = useState(false)

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
          handleBack()
          return null
        }
      }
      const tmpOrder = await fetchData()
      setOrder(tmpOrder)
    }

    loadOrder()
  }, [invoice])

  const handleCloseAndRefresh = () => {
    getInvoices(params)
    handleBack()
  }

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


  const customer = {
    email: invoice.customer_email,
    full_name: invoice.customer_email,
    phone: invoice.customer_phone
  }

  return (
    <div className={styles.container}>
      <DateHeading
        title="James Beddows"
        subtitle={order.direct_friendly_id}
        onBack={handleBack}
      />
      <div className={styles.priceLine}></div>
      <OrderPaymentContainer
        invoiceId={invoice.id}
        customer={customer}
        amount={invoice.amount_due}
        orderId={order.friendly_id}
        onRefresh={handleCloseAndRefresh}
      />
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
)(NewPaymentSidebar)
