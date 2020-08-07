import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import TimeField from 'react-simple-timefield'
import ConnectDatePicker from './ConnectDatePicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export default function ConnectInput(props) {
  const {
    label,
    type = 'text',
    onChange,
    noWrapLabel,
    value,
    id,
    name,
    disabled,
    required,
    basic,
    ...rest
  } = props

  if (type === 'time') {
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
        <TimeField
          value={value}
          onChange={value => {
            onChange({
              target: {
                name,
                value
              }
            })
          }}
          input={
            <input
              name={name}
              className={classnames(styles.input, basic && styles.basic)}
              id={id || name}
              type="text"
              disabled={disabled}
              required={required}
            />
          }
        />
      </div>
    )
  }

  if (type === 'date') {
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
        <ConnectDatePicker {...props} />
      </div>
    )
  }

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
      <input
        {...rest}
        name={name}
        className={classnames(styles.input, basic && styles.basic)}
        id={id || name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
    </div>
  )
}
