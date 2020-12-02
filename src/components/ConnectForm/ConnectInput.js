import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import TimeField from 'react-simple-timefield'
import ConnectDatePicker from './ConnectDatePicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export default function ConnectInput(props) {
  let {
    label,
    prefix,
    prefixBig = false,
    type = 'text',
    size,
    onChange,
    readOnly = false,
    noWrapLabel,
    value,
    id,
    name,
    disabled,
    required,
    basic,
    ...rest
  } = props

  const handleTimeChange = value => {
    onChange({
      target: {
        name,
        value: value.substr(0, 5) + ':00'
      }
    })
  }

  if (type === 'time') {
    value = value.slice(0, 5)

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
          onChange={handleTimeChange}
          input={
            <input
              name={name}
              className={classnames(styles.input, basic && styles.basic)}
              id={id || name}
              type="text"
              readOnly={readOnly}
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
      <div className={styles.inputHolder}>
        {prefix && (
          <span
            className={classnames(
              styles.prefix,
              prefixBig && styles.prefixBig
            )}>
            {prefix}
          </span>
        )}
        <input
          {...rest}
          name={name}
          className={classnames(
            styles.input,
            basic && styles.basic,
            size === 'lg' && styles.large,
            prefix && styles.prefixInput,
            prefixBig && styles.prefixBigInput
          )}
          id={id || name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  )
}
