import React, { useState } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { injectStripe } from 'react-stripe-elements'
import { ConnectInput, Button } from 'components/ConnectForm'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import LoadingMask from 'components/LoadingMask'
import { IconExclamation, IconCheck } from '../../../../assets/icons'
import { searchCustomer, getCustomerSetupIntent } from 'services/customer'
import { markInvoiceAsPaid } from 'services/invoice'
import { payOrder } from 'services/order'
import { useMediaQuery } from 'react-responsive'

const initialFormData = {
  holderName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardPostcode: ''
}

const options = {
  style: {
    base: {
      fontSize: '11px',
      color: '#444',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146'
    }
  }
}

const OrderPaymentForm = ({
  amount,
  orderId,
  customer,
  invoiceId,
  stripe,
  onRefresh,
  onPaid
}) => {
  const [formData, setFormData] = useState(initialFormData)
  const [edited, setEdited] = useState(false)
  const [cardElement, setCardElement] = useState(null)
  const [saving, setSaving] = useState(false)
  const [screen, setScreen] = useState('form')

  const handleChange = event => {
    const { name, value } = event.target
    const tmp = Object.assign({}, formData)
    tmp[name] = value

    setFormData(tmp)
    setEdited(true)
    // TODO: remove this later
    if (edited && cardElement) {
      return
    }
  }

  const onStripeFormReady = el => {
    setCardElement(el)
  }

  const handleResubmit = () => {
    setScreen('form')
    setTimeout(() => handleSubmit())
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      let tmp
      // STEP 1: Get stripe customer Id
      // search customer by email to get stripe customer id
      // we already have it in invoice detail though
      tmp = await searchCustomer(customer.email)

      const customerId = tmp.stripe_customer_id
      // STEP 2: Get customer setup intent
      tmp = await getCustomerSetupIntent(customerId)
      const { client_secret } = tmp

      const billingDetail = {}
      if (customer.full_name) {
        billingDetail.name = customer.full_name
      }
      if (customer.email) {
        billingDetail.email = customer.email
      }
      if (customer.phone) {
        billingDetail.phone = customer.phone
      }

      // STEP 3: Add card to stripe
      const { setupIntent, error } = await stripe.handleCardSetup(
        client_secret,
        cardElement,
        {
          payment_method_data: {
            billing_details: billingDetail
          }
        }
      )

      if (error) {
        console.log('error', error)
        throw error
      } else {
        // call setup intent again to confirm
        await getCustomerSetupIntent(customerId, {
          setup_id: setupIntent.id
        })

        // STEP 4: Pay the invoice
        // pay order and update invoice status as paid
        const payload = {
          order: orderId,
          customer: customerId,
          expected_price: amount,
          email: customer.email
        }
        await payOrder(payload)

        if (invoiceId) {
          await markInvoiceAsPaid(invoiceId)
        }
        setScreen('success')
        setSaving(false)
        onPaid && onPaid()
      }
    } catch (err) {
      console.log(err)
      setScreen('error')
      setSaving(false)
    }
  }

  const handleStripeElementChange = (el, name) => {}

  const isDesktop = useMediaQuery({ minWidth: 768 })
  const stripeStyle = isDesktop
    ? { base: { fontSize: '11px' } }
    : { base: { fontSize: '16px' } }

  return (
    <div className={styles.container}>
      {screen === 'form' && (
        <React.Fragment>
          <ConnectInput
            label="Cardholder Name"
            basic
            name="holderName"
            value={formData.holderName}
            onChange={handleChange}
            required
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Card Number</label>
            <CardNumberElement
              className={styles.input}
              {...options}
              onChange={el => handleStripeElementChange(el, 'Number')}
              onReady={el => onStripeFormReady(el)}
              style={stripeStyle}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expiry</label>
              <CardExpiryElement
                className={styles.input}
                {...options}
                onChange={el => handleStripeElementChange(el, 'Date')}
                style={stripeStyle}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CVC</label>
              <CardCVCElement
                className={styles.input}
                {...options}
                onChange={el => handleStripeElementChange(el, 'CVC')}
                style={stripeStyle}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Postcode</label>
              <PostalCodeElement
                className={styles.input}
                {...options}
                onChange={el => handleStripeElementChange(el, 'PostCode')}
                style={stripeStyle}
              />
            </div>
          </div>
          {saving ? (
            <Button color="secondary" style={{ width: '100%' }}>
              Processing Payment
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={handleSubmit}
              style={{ width: '100%' }}>
              Submit Payment
            </Button>
          )}
          <LoadingMask loading={saving} />
        </React.Fragment>
      )}
      {screen === 'error' && (
        <div className={styles.result}>
          <div className={styles.resultIcon}>
            <IconExclamation />
          </div>
          <p>There was a problem processing your payment.</p>
          <Button
            color="primary"
            onClick={handleResubmit}
            style={{ width: '100%' }}>
            Try Again
          </Button>
        </div>
      )}
      {screen === 'success' && (
        <div className={styles.result}>
          <div className={classnames(styles.resultIcon, styles.iconSuccess)}>
            <IconCheck />
          </div>
          <p>Your payment was successfully processed.</p>
          <Button color="primary" onClick={onRefresh} style={{ width: '100%' }}>
            Close
          </Button>
        </div>
      )}
    </div>
  )
}

export default injectStripe(OrderPaymentForm)
