import React from 'react'
import styles from './styles.scss'
import { getAge } from 'utils/helper'
import classnames from 'classnames'

export function ConnectInput({
  label,
  type = 'text',
  onChange,
  value,
  id,
  name,
  disabled,
  required,
  basic
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={id || name}>
          {label}
        </label>
      )}
      <input
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

export function ConnectAgeInput({
  label,
  onChange,
  value,
  id,
  name,
  disabled,
  required,
  basic
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={id || name}>
          {label}
        </label>
      )}
      <div className={styles.ageInputGroup}>
        <input
          name={name}
          className={classnames(styles.input, basic && styles.basic)}
          id={id || name}
          type="date"
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
        {value && <div className={styles.age}>({getAge(value)})</div>}
      </div>
    </div>
  )
}

export function ConnectSelect({
  label,
  onChange,
  selected,
  value,
  id,
  name,
  placeholder,
  options,
  valueArray,
  labelField = 'name',
  valueField = 'id',
  disabled,
  required,
  basic,
  textStyle = false,
  raw
}) {
  if (!options) {
    options = valueArray
  }

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={id || name}>
          {label}
        </label>
      )}
      <select
        // defaultValue={placeholder && ''}
        className={classnames(
          styles.select,
          basic && styles.basic,
          textStyle && styles.textStyle
        )}
        name={name}
        id={id || name}
        value={selected || value || ''}
        onChange={e => {
          if (raw) {
            onChange(e)
          } else {
            onChange(
              e.target.value,
              e.target.options[e.target.selectedIndex].innerText,
              e.target.name
            )
          }
        }}
        disabled={disabled}
        required={required}>
        {placeholder && (
          <option disabled value="">
            {typeof placeholder === 'boolean' ? 'Select' : placeholder}
          </option>
        )}
        {options.map(opt => (
          <option
            key={opt.key || opt[valueField]}
            disabled={!opt[valueField]}
            value={opt[valueField]}
            name={opt[labelField]}>
            {opt[labelField]}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ConnectLabeledContent({ label, children, disabled, basic }) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={classnames(
          styles.input,
          styles.plainText,
          basic && styles.basic
        )}
        disabled={disabled}>
        {children}
      </div>
    </div>
  )
}

export function ConnectTextArea({
  label,
  name,
  value,
  type,
  disabled,
  onChange,
  children
}) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={styles.textarea}
        name={name}
        value={value}
        type={type}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  )
}

export function Button({
  type = 'button',
  children,
  color = 'primary',
  onClick,
  disabled,
  small
}) {
  return (
    <button
      className={classnames(
        styles.button,
        styles[`button${color.charAt(0).toUpperCase()}${color.slice(1)}`],
        small && styles.buttonSmall
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  )
}
