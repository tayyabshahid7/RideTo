import React from 'react'

import styles from './LabelField.scss'

const LabelField = ({ label, name, error, children }) => {
  return (
    <div className={styles.textField}>
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  )
}

export default LabelField
