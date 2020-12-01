import React, { useState } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { ConnectInput, Button } from 'components/ConnectForm'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import { STRIPE_KEY } from 'common/constants'
import { StripeProvider, Elements } from 'react-stripe-elements'
import LoadingMask from 'components/LoadingMask'
import { IconExclamation, IconCheck } from 'assets/icons'

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

const InvoicesPaymentForm = ({ history }) => {
  const [formData, setFormData] = useState(initialFormData)
  const [edited, setEdited] = useState(false)
  const [cardElement, setCardElement] = useState(null)
  const [saving, setSaving] = useState(false)
  const [screen, setScreen] = useState('form')

  const handleClose = () => {
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
    setTimeout(() => {
      setScreen('success')
      setSaving(false)
    }, 1000)
    // TODO: from calendar/orders/AddOrderForm/index.js
    // const { error, token } = await handleStripePayment({
    //   stripe,
    //   cardElement,
    //   full_name: cardName,
    //   email: order.user_email,
    //   phone: order.user_phone
    // })
  }

  const handleStripeElementChange = (el, name) => {
    console.log(name, el.empty, el.complete)
  }

  return (
    <StripeProvider apiKey={STRIPE_KEY}>
      <Elements>
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
                <label className={styles.label}>Cardholder Name</label>
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
              <div
                className={classnames(styles.resultIcon, styles.iconSuccess)}>
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
      </Elements>
    </StripeProvider>
  )
}

export default InvoicesPaymentForm
