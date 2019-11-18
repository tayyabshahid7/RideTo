import React from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className={styles.container}>
      RideTo Ltd © {new Date().getFullYear()}{' '}
      <Link to="/terms" className={styles.terms}>
        Terms & Conditions
      </Link>
    </footer>
  )
}

export default Footer
