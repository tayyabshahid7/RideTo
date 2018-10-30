import React from 'react'

import styles from './styles.scss'

const Radiobox = ({
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
  const radioboxId = id || `radio_${Math.floor(Math.random() * 10000)}`
  const className = error
    ? `${styles.radiobox} ${extraClass} ${styles[size]} ${styles.error}`
    : `${styles.radiobox} ${extraClass} ${styles[size]}`

  return (
    <div className={className}>
      <input
        type="radio"
        id={radioboxId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={radioboxId}>{children}</label>
    </div>
  )
}

export default Radiobox
