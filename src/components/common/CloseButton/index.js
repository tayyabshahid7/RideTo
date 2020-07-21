import React from 'react'
import styles from './styles.scss'
import { IconClose } from 'assets/icons'

function Logo({ handleClick }) {
  return (
    <div className={styles.container} onClick={handleClick}>
      <IconClose />
    </div>
  )
}

export default Logo
