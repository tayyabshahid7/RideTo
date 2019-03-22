import React from 'react'
import styles from './styles.scss'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'

function POMSelector() {
  return (
    <div className={styles.container}>
      <div className={styles.tailored}>
        <span>Tailored for this course</span>
      </div>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div>
            Peace of mind policy{' '}
            <span className={styles.price}>for only £19.95</span>
          </div>
          <div className={styles.tAndC}>T & C's apply</div>
        </div>
        <div className={styles.headerSwitch} />
      </div>
      <OrderIncluded pom />
    </div>
  )
}

export default POMSelector
