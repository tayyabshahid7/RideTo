import React from 'react'
import styles from './styles.scss'

const Footer = () => {
  return (
    <div className={styles.container}>
      © {new Date().getFullYear()} Connectmct.
    </div>
  )
}

export default Footer
