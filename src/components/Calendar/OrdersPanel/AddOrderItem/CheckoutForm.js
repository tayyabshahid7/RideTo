import React from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import styles from './CheckoutForm.scss'

import cardVisa from '../../../../assets/images/card-visa.jpg'
import cardAmex from '../../../../assets/images/card-amex.jpg'
import cardElectron from '../../../../assets/images/card-electron.png'
import cardMastercard from '../../../../assets/images/card-mastercard.jpg'
import cardMaestro from '../../../../assets/images/card-maestro.png'
import { PoweredByStripe } from '../../../../assets/icons'

const CARD_IMAGES = [
  cardVisa,
  cardAmex,
  cardElectron,
  cardMastercard,
  cardMaestro
]

const options = {
  style: {
    base: {
      fontSize: '14px',
      color: '#424770',
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

function CheckoutForm({
  price,
  cardName,
  handleCardNameChange,
  handleStripeElementChange,
  singlePage = false,
  setCardElement
}) {
  return (
    <div className={styles.checkout}>
      <div className={styles.header}>
        <span className={styles.leftCol}>
          <h3 className={styles.title}>Payment</h3>{' '}
          <a
            href="https://stripe.com/gb"
            target="_blank"
            rel="noopener noreferrer">
            <PoweredByStripe />
          </a>
        </span>
        {!singlePage && <span>Step 2 of 2</span>}
      </div>
      <div className={styles.price}>Total: £{(price / 100.0).toFixed(2)}</div>
      <div>
        <label>
          <span className={styles.cards}>
            Card number{' '}
            {CARD_IMAGES.map(src => (
              <img key={src} src={src} alt="" />
            ))}
          </span>
          <CardNumberElement
            className={styles.input}
            {...options}
            onChange={el => handleStripeElementChange(el, 'Number')}
            onReady={el => setCardElement(el)}
          />
        </label>
      </div>
      <div>
        <label>
          Name on card{' '}
          <input
            required
            type="text"
            className={styles.input}
            placeholder="Joe Bloggs"
            value={cardName}
            onChange={handleCardNameChange}
          />
        </label>
      </div>
      <div>
        <label>
          Expiry date{' '}
          <CardExpiryElement
            className={styles.input}
            {...options}
            onChange={el => handleStripeElementChange(el, 'Date')}
          />
        </label>
      </div>
      <div>
        <label>
          CVC/CV2{' '}
          <CardCVCElement
            className={styles.input}
            {...options}
            onChange={el => handleStripeElementChange(el, 'CVC')}
          />
        </label>
      </div>
      <div>
        <label>
          Billing postcode{' '}
          <PostalCodeElement
            className={styles.input}
            {...options}
            onChange={el => handleStripeElementChange(el, 'PostCode')}
          />
        </label>
      </div>
    </div>
  )
}

export default CheckoutForm
