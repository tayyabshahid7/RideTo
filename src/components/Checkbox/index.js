import React from 'react'

import styles from './Checkbox.scss'

const Checkbox = ({
  checked,
  children,
  disabled,
  size = 'small',
  extraClass = '',
  error,
  onChange
}) => {
  const id = `checkbox_${Math.floor(Math.random() * 10000)}`
  const className = error
    ? `${styles.checkbox} ${extraClass} ${styles[size]} ${styles.error}`
    : `${styles.checkbox} ${extraClass} ${styles[size]}`

  return (
    <div className={className}>
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
