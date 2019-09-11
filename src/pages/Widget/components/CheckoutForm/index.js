import React from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  injectStripe
} from 'react-stripe-elements'

import LabelField from 'pages/Widget/components/LabelField'
import AcceptCheckbox from 'pages/Widget/components/AcceptCheckbox'
import cardVisa from 'assets/images/card-visa.jpg'
import cardAmex from 'assets/images/card-amex.jpg'
import cardElectron from 'assets/images/card-electron.png'
import cardMastercard from 'assets/images/card-mastercard.jpg'
import cardMaestro from 'assets/images/card-maestro.png'

import styles from './CheckoutForm.scss'

import PromoCode from 'components/RideTo/CheckoutPage/PromoCode'

const CARD_IMAGES = [
  cardVisa,
  cardAmex,
  cardElectron,
  cardMastercard,
  cardMaestro
]

const handleChange = (event, details, onChange) => {
  const { id, value } = event.target
  onChange({ ...details, [id]: value })
}

const CheckoutForm = ({
  widget,
  details,
  errors,
  stripe,
  isSaving,
  onChange,
  onSubmit,
  voucher_code,
  handleVoucherApply,
  onVoucherCodeChange,
  setCardElement,
  supplierName
}) => {
  const labelStyle = {
    marginTop: '16px',
    marginBottom: '16px'
  }
  const inputStyle = {
    base: {
      fontSize: '18px',
      letterSpacing: '0.035rem'
    }
  }
  const btnClass = isSaving
    ? `WidgetBtn ${styles.checkoutBtn} ${styles.disabled}`
    : `WidgetBtn ${styles.checkoutBtn}`
  const optinLabel =
    widget.email_optin_label ||
    'Add me to the mailing list for the latest news and special offers'

  return (
    <div className={styles.checkForm}>
      <div className={styles.paymentFields}>
        <div className={styles.payWith}>
          <span>Pay With:</span>
          <div className={styles.cardImages}>
            {CARD_IMAGES.map(src => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        </div>

        <LabelField
          label="Card Number"
          name="card_number"
          style={labelStyle}
          error={errors.card_number}>
          <CardNumberElement
            style={inputStyle}
            onReady={el => setCardElement(el)}
          />
        </LabelField>
        <LabelField
          label="Name On Card"
          name="card_name"
          style={labelStyle}
          error={errors.card_name}>
          <input
            id="card_name"
            type="text"
            placeholder="Name as appears on card"
            value={details.card_name || ''}
            onChange={event => handleChange(event, details, onChange)}
          />
        </LabelField>
        <LabelField
          label="Expiry Date"
          name="card_expiry"
          style={labelStyle}
          error={errors.card_expiry}>
          <CardExpiryElement style={inputStyle} />
        </LabelField>
        <LabelField
          label="CVC/CV2"
          name="card_cvc"
          style={labelStyle}
          error={errors.card_cvc}>
          <CardCVCElement style={inputStyle} />
        </LabelField>
        <LabelField
          label="Billing Postcode"
          name="card_zip"
          style={labelStyle}
          error={errors.card_zip}>
          <PostalCodeElement style={inputStyle} />
        </LabelField>
        <PromoCode
          widget={widget}
          voucher_code={voucher_code}
          // loadingPrice={loadingPrice}
          loadingPrice={false}
          handleVoucherApply={handleVoucherApply}
          onChange={onVoucherCodeChange}
        />
      </div>

      <div className={styles.terms}>
        <h3>Terms</h3>

        <AcceptCheckbox
          accepted={details.accept_terms}
          error={errors.accept_terms}
          onChange={accept_terms => onChange({ ...details, accept_terms })}>
          <div>
            I can confirm that I have read and agreed to the requirements and{' '}
            <a
              style={{ color: widget.button_color }}
              href={widget.terms}
              target="_blank"
              rel="noopener noreferrer">
              terms and conditions.
            </a>
          </div>
        </AcceptCheckbox>

        <AcceptCheckbox
          accepted={details.email_optin}
          onChange={email_optin => onChange({ ...details, email_optin })}>
          <div>{optinLabel}</div>
        </AcceptCheckbox>
      </div>

      {errors.paymentError && (
        <div className={styles.paymentError}>
          {typeof errors.paymentError !== 'string' ? (
            Object.entries(errors.paymentError).map(error => (
              <div>
                <strong>
                  {error[0]}: {error[1]}
                </strong>
              </div>
            ))
          ) : (
            <div>
              <strong>{errors.paymentError}</strong>
            </div>
          )}
        </div>
      )}

      <button
        className={btnClass}
        disabled={isSaving}
        onClick={() => onSubmit(stripe)}>
        Confirm and Pay
      </button>

      <p className={styles.mandate}>
        I authorise {supplierName} to send instructions to the financial
        institution that issued my card to take payments from my card account in
        accordance with the terms of my agreement with you.
      </p>
    </div>
  )
}

export default injectStripe(CheckoutForm)
