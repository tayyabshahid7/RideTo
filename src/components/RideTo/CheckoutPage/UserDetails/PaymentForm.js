import React from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
  // PostalCodeElement,
  // injectStripe
} from 'react-stripe-elements'
import Input from 'components/RideTo/Input'
import Radiobox from 'components/Radiobox'
import { Row, Col } from 'reactstrap'
import AddressForm from 'components/AddressForm'
import styles from './styles.scss'

const PaymentForm = ({ payment, errors = {}, onPaymentChange }) => {
  const inputStyle = {
    base: {
      fontSize: '15px',
      lineHiehgt: '24px',
      fontFamily: 'ProximaNova',
      color: '#141414',
      height: '48px',
      padding: '11px 16px'
    }
  }

  return (
    <div className={styles.checkForm}>
      <div className={styles.paymentFields}>
        <div className={styles.title}>Payment Details</div>

        <div className={styles.cardElementWrapper}>
          <CardNumberElement style={inputStyle} />
        </div>
        <Input
          placeholder="Cardholder Name"
          name="card_name"
          value={payment.card_name}
          className={styles.input}
          onChange={onPaymentChange}
          required
        />
        <Row>
          <Col>
            <div className={styles.cardElementWrapper}>
              <CardExpiryElement style={inputStyle} placeholder="Expiry Date" />
            </div>
            <div className={styles.subtext}>MM/YY</div>
          </Col>
          <Col>
            <div className={styles.cardElementWrapper}>
              <CardCVCElement style={inputStyle} placeholder="CVV/CV2" />
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.title}>Billing Details</div>
      <div className={styles.rowItem}>
        <Radiobox
          extraClass={styles.radiobox}
          onChange={() => onPaymentChange({ sameAddress: true })}
          error={errors.terms}
          checked={payment.sameAddress}
          name="sameAddress">
          Same as delivery address
        </Radiobox>
        <Radiobox
          extraClass={styles.radiobox}
          onChange={() => onPaymentChange({ sameAddress: false })}
          error={errors.terms}
          checked={!payment.sameAddress}
          name="sameAddress">
          Use a different billing address
        </Radiobox>
        {!payment.sameAddress && (
          <div className={styles.title}>Billing Address</div>
        )}
        {!payment.sameAddress && (
          <AddressForm address={payment} onChange={onPaymentChange} />
        )}
      </div>

      {errors.paymentError && (
        <div className={styles.paymentError}>
          <strong>{errors.paymentError}</strong>
        </div>
      )}
    </div>
  )
}

export default PaymentForm
