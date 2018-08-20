import React from 'react'

import styles from './LabelField.scss'

const LabelField = ({ label, name, error, children, style = {} }) => {
  const className = error
    ? `${styles.textField} ${styles.error}`
    : styles.textField

  return (
    <div className={className} style={style}>
      <label htmlFor={name}>{label}</label>
      {children}

      {error && <span className={styles.message}>{error}</span>}
    </div>
  )
}

export default LabelField
