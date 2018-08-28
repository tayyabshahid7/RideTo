import React from 'react'

import styles from './Checkbox.scss'

const Checkbox = ({
  checked,
  children,
  disabled,
  id = null,
  name = '',
  size = 'small',
  extraClass = '',
  error,
  onChange
}) => {
  const checkboxId = id || `checkbox_${Math.floor(Math.random() * 10000)}`
  const className = error
    ? `${styles.checkbox} ${extraClass} ${styles[size]} ${styles.error}`
    : `${styles.checkbox} ${extraClass} ${styles[size]}`

  return (
    <div className={className}>
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  )
}

export default Checkbox
