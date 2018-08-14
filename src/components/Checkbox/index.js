import React from 'react'

import styles from './Checkbox.scss'

const Checkbox = ({ checked, children, disabled, onChange }) => {
  const id = `checkbox_${Math.floor(Math.random() * 10000)}`

  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  )
}

export default Checkbox
