import React from 'react'

import styles from './TextField.scss'

const TextField = ({
  label,
  name,
  value,
  error,
  placeholder,
  type = 'text',
  onChange
}) => {
  return (
    <div className={styles.textField}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={({ target }) => onChange(name, target.value)}
      />
    </div>
  )
}

export default TextField
