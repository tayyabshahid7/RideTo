import React from 'react'
import styles from './styles.scss'
import WhiteArrowDown from 'assets/images/rideto/WhiteArrowDown.svg'

function Splash({ scrollTo }) {
  return (
    <div className={styles.splash}>
      <h1 className={styles.splashTitle}>Learn to Ride</h1>
      <p className={styles.splashLead}>
        It’s time to ride. Whether you’re new to bikes or a regular rider,
        RideTo will help you achieve your riding dreams. Let’s get you
        started...
      </p>
      <button
        className={styles.splashButton}
        title="Scroll down"
        onClick={() => {
          scrollTo(1)
        }}>
        <img src={WhiteArrowDown} alt="" />
        <img src={WhiteArrowDown} alt="" />
      </button>
    </div>
  )
}

export default Splash
