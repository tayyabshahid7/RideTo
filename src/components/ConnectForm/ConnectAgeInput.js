import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import ConnectDatePicker from './ConnectDatePicker'
import { getAge } from 'utils/helper'

export default function ConnectAgeInput(props) {
  const { label, id, name, value, hideAge, noWrapLabel, disabled } = props

  return (
    <div className={styles.formGroup}>
      {label && (
        <label
          className={classnames(
            styles.label,
            noWrapLabel && styles.labelNoWrap,
            disabled && styles.labelDisabled
          )}
          htmlFor={id || name}>
          {label}
        </label>
      )}
      <div className={styles.ageInputGroup}>
        <ConnectDatePicker {...props} maxDate={new Date()} />
        {value && !hideAge && (
          <div className={styles.age}>({getAge(value)})</div>
        )}
      </div>
    </div>
  )
}
