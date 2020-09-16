import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

export default function ConnectCheckbox({
  label,
  type = 'checkbox',
  disabled,
  checked = false,
  onChange,
  noWrapLabel,
  name,
  vertical = false
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label
          className={classnames(
            styles.label,
            styles.labelCheckbox,
            vertical && styles.labelCheckboxVertical,
            disabled && styles.labelDisabled
          )}>
          <input
            name={name}
            checked={checked}
            type={type}
            disabled={disabled}
            onChange={onChange}
          />
          <span>{label}</span>
        </label>
      )}
    </div>
  )
}
