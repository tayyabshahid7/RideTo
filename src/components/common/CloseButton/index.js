import React from 'react'
import styles from './styles.scss'

function Logo({ handleClick }) {
  return <div className={styles.container} onClick={handleClick}></div>
}

export default Logo
