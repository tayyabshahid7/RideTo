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

const PaymentForm = ({ details, errors = {}, onDetailChange }) => {
  const inputStyle = {
    base: {
      fontSize: '15px',
      fontFamily: 'ProximaNova',
      color: '#141414'
    }
  }

  const handleChange = event => {
    const { name, value } = event.target
    onDetailChange(name, value)
  }
  const handleAddressChange = (name, value) => {
    onDetailChange(`billingAddress.${name}`, value)
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
          value={details.card_name}
          className={styles.input}
          onChange={handleChange}
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
          onChange={() => onDetailChange('sameAddress', true)}
          checked={details.sameAddress}
          name="sameAddress">
          Same as delivery address
        </Radiobox>
        <Radiobox
          extraClass={styles.radiobox}
          onChange={() => onDetailChange('sameAddress', false)}
          checked={!details.sameAddress}
          name="sameAddress">
          Use a different billing address
        </Radiobox>
        {!details.sameAddress && (
          <div className={styles.title}>Billing Address</div>
        )}
        {!details.sameAddress && (
          <AddressForm
            address={details.billingAddress}
            onChange={handleAddressChange}
            errors={errors.billingAddress}
          />
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
