import React from 'react';
import styles from './styles.scss'

const Footer = () => {

  return (
    <div className={styles.container}>
      © {(new Date()).getFullYear()} RideTo Ltd.
    </div>
  )
}

export default Footer
