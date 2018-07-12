import React from 'react';
import classNames from 'classnames'
import styles from './styles.scss'
import blackRideTologo from "assets/images/rideto-black.png"
import whiteRideTologo from "assets/images/rideto-white.png"

const Header = ({dark, children}) =>  {
  return (
  <div className={classNames(styles.container,dark&&styles.dark)}>
    <div className={styles.image}>
    {
      dark ?
        <img src={whiteRideTologo} alt="RideTo logo"/>
      :
        <img src={blackRideTologo} alt="RideTo logo"/>
    }
    </div>
    <div className={styles.header}>
      {children}
    </div>
  </div>
  )
}

export default Header