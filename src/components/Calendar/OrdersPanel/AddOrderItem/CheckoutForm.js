import React from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import styles from './CheckoutForm.scss'

import cardVisa from 'assets/images/card-visa.jpg'
import cardAmex from 'assets/images/card-amex.jpg'
import cardElectron from 'assets/images/card-electron.png'
import cardMastercard from 'assets/images/card-mastercard.jpg'
import cardMaestro from 'assets/images/card-maestro.png'

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
      },
      padding: '0.5rem'
    },
    invalid: {
      color: '#9e2146'
    }
  }
}

function CheckoutForm() {
  return (
    <div className={styles.checkout}>
      <div className={styles.header}>
        <h3 className={styles.title}>Payment</h3>
      </div>
      <div className={styles.price}>Total: £{125.0}</div>
      <div>
        <label className={styles.cards}>
          Card number{' '}
          {CARD_IMAGES.map(src => (
            <img key={src} src={src} alt="" />
          ))}
        </label>
        <CardNumberElement className={styles.input} {...options} />
      </div>
      <div>
        <label>Name on card</label>
        <input type="text" className={styles.input} />
      </div>
      <div>
        <label>Expiry date</label>
        <CardExpiryElement className={styles.input} {...options} />
      </div>
      <div>
        <label>CVC/CV2</label>
        <CardCVCElement className={styles.input} {...options} />
      </div>
      <div>
        <label>Billing postcode</label>
        <PostalCodeElement className={styles.input} {...options} />
      </div>
    </div>
  )
}

export default CheckoutForm
