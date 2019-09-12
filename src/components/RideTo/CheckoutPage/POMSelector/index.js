import React from 'react'
import styles from './styles.scss'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import classnames from 'classnames'
import { createPOM } from 'utils/helper'
import shield from 'assets/images/security.svg'

function POMSelector({ handlePOMToggleClick, hasPOM, popup = false }) {
  const { discount_price } = createPOM()

  return (
    <div
      className={classnames(styles.container, popup && styles.containerPopup)}>
      <div>
        <img src={shield} alt="Shield" className={styles.pomShield} />
      </div>
      <div className={classnames(styles.price, popup && styles.priceBold)}>
        Only £{discount_price}
      </div>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div>Peace of mind policy</div>
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
      <OrderIncluded pom />
      <div className={styles.tAndC}>
        Terms and conditions apply.
        <br />
        Does not cover lack of highway code understanding.
      </div>
    </div>
  )
}

export default POMSelector
