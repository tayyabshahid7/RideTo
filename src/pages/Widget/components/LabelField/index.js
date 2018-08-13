import React from 'react'

import styles from './LabelField.scss'

const LabelField = ({ label, name, error, children }) => {
  const className = error
    ? `${styles.textField} ${styles.error}`
    : styles.textField

  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  )
}

export default LabelField
