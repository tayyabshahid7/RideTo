import React from 'react'
import styles from './styles.scss'

const Footer = () => {
  return (
    <footer className={styles.container}>
      RideTo Ltd © {new Date().getFullYear()}
    </footer>
  )
}

export default Footer
