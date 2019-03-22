import React from 'react'
import styles from './styles.scss'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import classnames from 'classnames'
import { createPOM } from 'utils/helper'

function POMSelector({ handlePOMToggleClick, hasPOM }) {
  const { discount_price } = createPOM()

  return (
    <div className={styles.container}>
      <div className={styles.tailored}>
        <span>Tailored for this course</span>
      </div>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div>
            Peace of mind policy{' '}
            <span className={styles.price}>for only £{discount_price}</span>
          </div>
          <div className={styles.tAndC}>T & C's apply</div>
        </div>
        <button
          className={classnames(
            styles.headerSwitch,
            hasPOM && styles.headerSwitchSelected
          )}
          onClick={handlePOMToggleClick}>
          <div className={styles.headerSwitchSlider} />
        </button>
      </div>
      <OrderIncluded pom />
    </div>
  )
}

export default POMSelector
