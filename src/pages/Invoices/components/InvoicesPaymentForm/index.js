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
import { IconExclamation, IconCheck } from 'assets/icons'
import { searchCustomer, getCustomerSetupIntent } from 'services/customer'
import { markInvoiceAsPaid } from 'services/invoice'
import { payOrder } from 'services/order'

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

const InvoicesPaymentForm = ({ history, order, invoice, stripe, onClose }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [edited, setEdited] = useState(false)
  const [cardElement, setCardElement] = useState(null)
  const [saving, setSaving] = useState(false)
  const [screen, setScreen] = useState('form')

  const handleClose = () => {
    onClose && onClose()
    history.push('/invoices')
  }

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

  const handleSubmit = async () => {
    setSaving(true)
    try {
      let tmp
      // STEP 1: Get stripe customer Id
      // search customer by email to get stripe customer id
      // we already have it in invoice detail though
      tmp = await searchCustomer(invoice.customer_email)

      const customerId = tmp.stripe_customer_id
      // STEP 2: Get customer setup intent
      tmp = await getCustomerSetupIntent(customerId)
      const { client_secret } = tmp

      console.log(tmp, stripe)

      // STEP 3: Add card to stripe
      const { setupIntent, error } = await stripe.handleCardSetup(
        client_secret,
        cardElement,
        {
          payment_method_data: {
            billing_details: {
              name: invoice.customer_name,
              email: invoice.customer_email,
              phone: invoice.customer_phone
            }
          }
        }
      )
      console.log(setupIntent)

      if (error) {
        console.log(error)
        setScreen('error')
      } else {
        // call setup intent again to confirm
        tmp = await getCustomerSetupIntent(customerId, {
          setup_id: setupIntent.id
        })

        // STEP 4: Pay the invoice
        // pay order and update invoice status as paid
        const payload = {
          order: invoice.metadata.order,
          customer: customerId,
          expected_price: invoice.amount_due,
          email: invoice.customer_email
        }
        tmp = await payOrder(payload)
        console.log(tmp)

        tmp = await markInvoiceAsPaid(invoice.id)
        console.log(tmp)
        setScreen('success')
      }
    } catch (err) {
      setSaving('error')
      console.log(err)
      setSaving(false)
    }
  }

  const handleStripeElementChange = (el, name) => {
    console.log(name, el.empty, el.complete, el)
  }

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
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expiry</label>
              <CardExpiryElement
                className={styles.input}
                {...options}
                onChange={el => handleStripeElementChange(el, 'Date')}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CVC</label>
              <CardCVCElement
                className={styles.input}
                {...options}
                onChange={el => handleStripeElementChange(el, 'CVC')}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Postcode</label>
              <PostalCodeElement
                className={styles.input}
                {...options}
                onChange={el => handleStripeElementChange(el, 'PostCode')}
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
            onClick={handleSubmit}
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
          <Button
            color="primary"
            onClick={handleClose}
            style={{ width: '100%' }}>
            Close
          </Button>
        </div>
      )}
    </div>
  )
}

export default injectStripe(InvoicesPaymentForm)
