import React from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  injectStripe
} from 'react-stripe-elements'

import LabelField from 'pages/Widget/components/LabelField'
import AcceptTerms from 'pages/Widget/components/AcceptTerms'

import styles from './CheckoutForm.scss'

const handleChange = (event, details, onChange) => {
  const { id, value } = event.target
  onChange({ ...details, [id]: value })
}

const CheckoutForm = ({ details, errors, stripe, onChange, onSubmit }) => {
  const labelStyle = {
    marginTop: '16px',
    marginBottom: '16px'
  }

  const inputStyle = {
    base: {
      fontSize: '24px',
      lineHeight: '1.25',
      letterSpacing: '0.035rem'
    }
  }

  return (
    <div className={styles.checkForm}>
      <div className={styles.paymentFields}>
        <LabelField
          label="Card Number"
          name="card_number"
          style={labelStyle}
          error={errors.card_number}>
          <CardNumberElement style={inputStyle} />
        </LabelField>
        <LabelField
          label="Name On Card"
          name="card_name"
          style={labelStyle}
          error={errors.card_name}>
          <input
            id="card_name"
            type="text"
            value={details.card_name || ''}
            onChange={event => handleChange(event, details, onChange)}
          />
        </LabelField>
        <LabelField
          label="Expiry Date"
          name="card_expiry"
          style={labelStyle}
          error={errors.card_expiry}>
          <CardExpiryElement />
        </LabelField>
        <LabelField
          label="CVC/CV2"
          name="card_cvc"
          style={labelStyle}
          error={errors.card_cvc}>
          <CardCVCElement />
        </LabelField>
        <LabelField
          label="Billing Postcode"
          name="card_zip"
          style={labelStyle}
          error={errors.card_zip}>
          <PostalCodeElement />
        </LabelField>
      </div>

      <div className={styles.total}>
        <span>Total to pay:</span>
        <span>£TOTAL TODO</span>
      </div>

      <div className={styles.terms}>
        <h3>Terms</h3>
        <AcceptTerms
          accepted={details.accept_terms}
          error={errors.accept_terms}
          onChange={accept_terms => onChange({ ...details, accept_terms })}
        />
      </div>

      <button className="WidgetBtn" onClick={() => onSubmit(stripe)}>
        Confirm and Pay
      </button>
    </div>
  )
}

export default injectStripe(CheckoutForm)
