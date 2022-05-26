import shield from 'assets/images/security.svg'
import classnames from 'classnames'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import PeaceOfMindPolicyInfo from 'components/RideTo/CheckoutPage/PeaceOfMindPolicyInfo'
import React from 'react'
import { createPOM } from 'utils/helper'
import styles from './styles.scss'

function POMSelector({
  handlePOMToggleClick,
  hasPOM,
  popup = false,
  className
}) {
  const { discount_price } = createPOM()

  return (
    <div
      className={classnames(
        styles.container,
        className,
        popup && styles.containerPopup
      )}>
      <div>
        <img src={shield} alt="Shield" className={styles.pomShield} />
      </div>
      {!popup && (
        <div className={classnames(styles.price, popup && styles.priceBold)}>
          Only £{discount_price}
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div>
            {popup && <span>Add the Peace of mind policy</span>}
            {!popup && <span>Peace of mind policy</span>}
            {!popup && <PeaceOfMindPolicyInfo />}
          </div>
        </div>
        {!popup && (
          <button
            id="pom-switch"
            className={classnames(
              styles.headerSwitch,
              hasPOM && styles.headerSwitchSelected
            )}
            onClick={handlePOMToggleClick}>
            <div className={styles.headerSwitchSlider} />
          </button>
        )}
      </div>
      {popup && (
        <div
          className={classnames(styles.pricePopup, popup && styles.priceBold)}>
          For Only £{discount_price}
        </div>
      )}
      <OrderIncluded pom popup={popup} />
      <div className={styles.tAndC}>
        Terms and conditions apply.
        <br />
        Does not cover lack of highway code understanding.
      </div>
    </div>
  )
}

export default POMSelector
