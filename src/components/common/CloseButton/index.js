import React from 'react'
import styles from './styles.scss'

function CloseButton({ onClick }) {
  return <div className={styles.container} onClick={onClick}></div>
}

export default CloseButton
