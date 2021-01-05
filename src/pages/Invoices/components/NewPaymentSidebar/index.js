import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import InvoicesPaymentForm from '../InvoicesPaymentForm'
import { getInvoices } from 'store/invoice'
import { fetchOrderById } from 'services/order'
import { actions as notifyActions } from 'store/notification'
import { STRIPE_KEY } from 'common/constants'
import { StripeProvider, Elements } from 'react-stripe-elements'
import styles from './styles.scss'

const NewPaymentSidebar = ({
  history,
  match,
  invoices,
  suppliers,
  params,
  showNotification,
  getInvoices
}) => {
  const [invoice, setInvoice] = useState(null)
  const [order, setOrder] = useState(null)
  // const [loading, setLoading] = useState(false)

  const stripeAccountId = suppliers.length
    ? suppliers[0].stripe_account_id
    : null

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

  console.log('payment form', order, invoice)

  return (
    <div className={styles.container}>
      <DateHeading
        title="James Beddows"
        subtitle={order.direct_friendly_id}
        onBack={handleBack}
      />
      <div className={styles.priceLine}></div>
      <StripeProvider apiKey={STRIPE_KEY} stripeAccount={stripeAccountId}>
        <Elements>
          <InvoicesPaymentForm
            history={history}
            order={order}
            invoice={invoice}
          />
        </Elements>
      </StripeProvider>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    invoices: state.invoice.invoices,
    suppliers: state.auth.user.suppliers,
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
