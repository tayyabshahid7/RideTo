import React, { Component } from 'react'
import styles from './styles.scss'
import { Button } from 'reactstrap'
import Input from 'components/RideTo/Input'

class PromoCode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showPromo: false
    }
  }

  render() {
    const {
      voucher_code,
      loadingPrice,
      handleVoucherApply,
      onChange
    } = this.props
    const { showPromo } = this.state

    return (
      <div className={styles.promoWrapper}>
        {showPromo ? (
          <div className={styles.promoContainer}>
            <Input
              placeholder="Promo code"
              name="voucher_code"
              value={voucher_code}
              className={styles.promoInput}
              onChange={event => onChange({ voucher_code: event.target.value })}
              required
            />
            <Button
              color="primary"
              className={styles.applyBtn}
              disabled={voucher_code === '' || loadingPrice}
              onClick={handleVoucherApply}>
              Apply
            </Button>
          </div>
        ) : (
          <div
            className={styles.promoAction}
            onClick={() => this.setState({ showPromo: true })}>
            I have a promo code
          </div>
        )}
      </div>
    )
  }
}

export default PromoCode
