import React from 'react'
// import blackRideTologo from '../../assets/images/rideto-black.png'
import whiteRideTologo from '../../assets/images/rideto-white.png'
import greenRideToLogo from '../../assets/images/rideto_green.svg'
import styles from './styles.scss'
import classnames from 'classnames'

const Header = ({ dark, children }) => {
  return (
    <div className={classnames(styles.container, dark && styles.dark)}>
      <div className={styles.image}>
        {dark ? (
          <img src={whiteRideTologo} alt="RideTo logo" />
        ) : (
          <img src={greenRideToLogo} alt="RideTo logo" />
        )}
      </div>
      <div className={styles.header}>{children}</div>
    </div>
  )
}

export default Header
