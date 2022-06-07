import shield from 'assets/images/security.svg'
import classnames from 'classnames'
import RideToButton from 'components/RideTo/Button'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import PeaceOfMindPolicyInfo from 'components/RideTo/CheckoutPage/PeaceOfMindPolicyInfo'
import React, { useState } from 'react'
import { createPOM } from 'utils/helper'
import styles from './styles.scss'

function POMSelector({
  handlePOMToggleClick,
  hasPOM,
  popup = false,
  onCheckoutPage = false,
  className
}) {
  const { discount_price } = createPOM()
  const [addedButtonTextOnHover, setAddedButtonTextOnHover] = useState('Added')
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
        <div
          className={classnames(
            styles.headerText,
            onCheckoutPage && styles.headerTextCheckout
          )}>
          <div>
            {popup && <span>Add the Peace of mind policy</span>}
            {!popup && <span>Peace of mind policy</span>}
            {!popup && <PeaceOfMindPolicyInfo />}
          </div>
        </div>
        {!popup && (
          <RideToButton
            id="pom-add-button"
            className={classnames(
              styles.headerAddButton,
              hasPOM && styles.headerAddButtonSelected,
              onCheckoutPage && styles.headerAddButtonCheckout
            )}
            onClick={handlePOMToggleClick}
            onMouseOver={() => setAddedButtonTextOnHover('Remove')}
            onMouseLeave={() => setAddedButtonTextOnHover('Added')}>
            {hasPOM ? (
              <span className={styles.AddedButton}>
                {addedButtonTextOnHover}
                {addedButtonTextOnHover === 'Added' ? (
                  <i className={classnames('fa fa-check', styles.tick)} />
                ) : (
                  ''
                )}
              </span>
            ) : (
              <span>Add</span>
            )}
          </RideToButton>
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
        *Terms and conditions apply.
        <br />
        *Does not cover lack of highway code understanding.
      </div>
    </div>
  )
}

export default POMSelector
