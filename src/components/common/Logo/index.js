import React from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'
import { ConnectLogo } from 'assets/icons'

function CloseButton({ short }) {
  return (
    <Link to="/" className={styles.logo}>
      <ConnectLogo />
      {!short && <span>CONNECT</span>}
    </Link>
  )
}

export default CloseButton
