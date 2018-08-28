import React from 'react'
import IconRideToLogo from '../../assets/icons/IconRideToLogo'

import styles from './styles.scss'
import classnames from 'classnames'

const Header = ({ dark, children }) => {
  return (
    <div className={classnames(styles.container, dark && styles.dark)}>
      <div className={styles.image}>
        <IconRideToLogo
          className={classnames(styles.logoImage, dark && styles.darkLogo)}
        />
      </div>
      <div className={styles.header}>{children}</div>
    </div>
  )
}

export default Header
