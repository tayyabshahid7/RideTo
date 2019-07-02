import React, { Component } from 'react'
import styles from './styles.scss'
import { Button } from 'reactstrap'
import Input from 'components/RideTo/Input'
import classnames from 'classnames'

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
      onChange,
      widget,
      widget: { widget_color }
    } = this.props
    const { showPromo } = this.state

    return (
      <div
        className={classnames(
          styles.promoWrapper,
          widget && styles.widgetPromoWrapper
        )}>
        {showPromo ? (
          <div className={styles.promoContainer}>
            <Input
              placeholder="Promo code"
              name="voucher_code"
              value={voucher_code}
              className={classnames(
                styles.promoInput,
                widget && styles.widgetPromoInput
              )}
              onChange={event => onChange({ voucher_code: event.target.value })}
              required
            />
            <Button
              color="primary"
              className={classnames(
                styles.applyBtn,
                widget && 'WidgetBtn',
                widget && styles.widgetApplyBtn
              )}
              disabled={voucher_code === '' || loadingPrice}
              onClick={handleVoucherApply}
              style={widget && { backgroundColor: widget_color }}>
              Apply
            </Button>
          </div>
        ) : (
          <div
            className={styles.promoAction}
            onClick={() => this.setState({ showPromo: true })}
            style={widget && { color: widget_color }}>
            I have a promo code
          </div>
        )}
      </div>
    )
  }
}

export default PromoCode
