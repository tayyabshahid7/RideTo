import WhiteArrowDown from 'assets/images/rideto/WhiteArrowDown.svg'
import React from 'react'
import styles from './styles.scss'
// import Div100vh from 'react-div-100vh'
// import { useMediaQuery } from 'react-responsive'

const imageSplash =
  'https://rideto-production.imgix.net/static/images/getting-started-splash.jpg?q=80&auto=format,compress,true'

function Splash({ scrollTo }) {
  // let height = 'calc(100rvh - 56px)'

  // if (useMediaQuery({ query: '(min-width: 801px)' })) {
  //   height = 'calc(100rvh - 80px)'
  // }

  // if (useMediaQuery({ query: '(min-width: 933px' })) {
  //   height = 'calc(100rvh - 80px - 89px)'
  // }

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
