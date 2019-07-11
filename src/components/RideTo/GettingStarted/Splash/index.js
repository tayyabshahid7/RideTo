import React from 'react'
import styles from './styles.scss'
import WhiteArrowDown from 'assets/images/rideto/WhiteArrowDown.svg'

const imageSplash =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/getting-started-splash.jpg'

function Splash({ scrollTo }) {
  const handleButtonClick = () => {
    scrollTo(0)
  }

  return (
    <div
      className={styles.splash}
      style={{ backgroundImage: `url(${imageSplash})` }}>
      <h1 className={styles.splashTitle}>Learn to Ride</h1>
      <p className={styles.splashLead}>
        It's time to ride. Whether you're new to bikes or a regular rider,
        RideTo will help you achieve your riding dreams. Let's get you
        started...
      </p>
      <button
        className={styles.splashButton}
        title="Scroll down"
        onClick={handleButtonClick}>
        <img src={WhiteArrowDown} alt="" />
        <img src={WhiteArrowDown} alt="" />
      </button>
    </div>
  )
}

export default Splash
